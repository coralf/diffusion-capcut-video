import { Autowired, Bean } from "../../../../common/ioc-manager";
import { getBase64Image, getRandomInteger } from "../../../utils/utils";
import { ArtCreationController } from "../art-creation-controller";
import { ArtCreationStore, IEditTableDataItem, IImage } from "../art-creation-store";
import { GlobalSettingService } from "./global-setting-service";
import { ipcRender, IpcUiService } from "./ipc-ui-service";

@Bean
export class KolorsService {
    @Autowired
    private artCreationController!: ArtCreationController;

    @Autowired
    private globalSettingService!: GlobalSettingService;

    @Autowired
    private artCreationStore!: ArtCreationStore;

    @Autowired
    private ipcUiService!: IpcUiService;

    public async textToImage(data: IEditTableDataItem) {
        const nextEditTableDataItem = data;
        const nextImage: IImage = {
            ...nextEditTableDataItem.image,
            loading: true
        };
        nextEditTableDataItem.image = nextImage;
        this.artCreationController.updateView([nextEditTableDataItem]);
        const image = await this.requestTextToImage(nextEditTableDataItem);
        const upscaleData = await ipcRender.invoke("kolorsUpscaleBase64Image", { image });
        const { path } = await this.saveImageToFile(
          nextEditTableDataItem,
          upscaleData.image
        );
        nextImage.src = getBase64Image(upscaleData.image);
        nextImage.path = path;
        nextImage.loading = false;
        nextEditTableDataItem.image = nextImage;
        this.artCreationController.updateView([nextEditTableDataItem]);
    }

    private async requestTextToImage(item: IEditTableDataItem) {
        const data = await ipcRender.invoke("kolorsTextToImage", {
            prompt: item.prompts,
            width: 1024,
            height: 1024,
            num_inference_steps: 32,
            guidance_scale: 5.0,
            num_images_per_prompt: 1,
            seed: getRandomInteger(1, 100000)
        });
        return data?.image;
    }

    private saveImageToFile = (
      item: IEditTableDataItem,
      imageBase64: string
    ) => {
        const fileName = `img-${item.id}.png`;
        return ipcRender.invoke("saveImageToFile", { fileName, imageBase64 });
    };

    public async upscale() {
        const editTableDataSource =
          this.artCreationStore.getStore().editTableDataSource;
        const nextEditTableDataItem = editTableDataSource[0];
        const upscaleOptions = {
            path: nextEditTableDataItem.image?.path
        };
        const nextImage = { ...nextEditTableDataItem.image, loading: true };
        nextEditTableDataItem.image = nextImage;
        this.artCreationController.updateView(editTableDataSource);
        const data = await ipcRender.invoke("kolorsUpscale", upscaleOptions);
        const { path } = await this.saveImageToFile(
          nextEditTableDataItem,
          data.image
        );
        nextImage.src = getBase64Image(data.image);
        nextImage.path = path;
        nextImage.loading = false;
        nextEditTableDataItem.image = nextImage;
        this.artCreationController.updateView(editTableDataSource);
    }

    public async batchTextToImage(dataSource: IEditTableDataItem[]) {
        for (const item of dataSource) {
            await this.textToImage(item);
        }
    }
}
