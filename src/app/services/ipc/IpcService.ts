import { KolorsService } from '../kolors/KolorsService';
import { ipcMain, IpcMainInvokeEvent } from 'electron';

import { AfterConstruct, Autowired, Bean } from '../../../common/ioc-manager';
import { JianYingService } from '../jianying/JianYingService';
import { IMetaSchema } from '../meta-schema/interface';
import { MetaSchemaService } from '../meta-schema/MetaSchemaService';
import { SettingService } from '../setting/SettingService';
import { StableDiffusionService } from '../stable-diffusion/StableDiffusionService';

@Bean
export class IpcService {
    @Autowired
    private stableDiffusionService!: StableDiffusionService;
    @Autowired
    private metaSchemaService!: MetaSchemaService;
    @Autowired
    private settingService!: SettingService;
    @Autowired
    private jianYingService!: JianYingService;

    @Autowired
    private kolorsService!: KolorsService;

    @AfterConstruct
    public initialize() {
        Object.keys(this)?.forEach((key: string) => {
            if (typeof this[key] === 'function') {
                ipcMain.handle(key, (event: IpcMainInvokeEvent, ...args) => {
                    return this[key]?.(...args);
                });
            }
        });
    }

    public saveMetaSchema = (options: IMetaSchema) => {
        return this.metaSchemaService.saveMetaSchema(options);
    };

    public getMetaSchema = () => {
        return this.metaSchemaService.getMetaSchema();
    };

    public exportJianYingProjectWithMedia = (options: any) => {
        return this.jianYingService.exportJianYingProjectWithMedia(options);
    };

    public getTextToImageProgress = () => {
        return this.stableDiffusionService.getTextToImageProgress();
    };

    public textToImage = (options: any) => {
        return this.stableDiffusionService.textToImage(options);
    };

    public extraSingleImage = (options: any) => {
        return this.stableDiffusionService.extraSingleImage(options);
    };

    public saveImageToFile = (options: any) => {
        return this.stableDiffusionService.saveImageToFile(options);
    };

    public getSdModelList = () => {
        return this.stableDiffusionService.getSdModelList();
    };

    public getSdConfig = () => {
        return this.stableDiffusionService.getSdConfig();
    };

    public updateSdConfig = (options: any) => {
        return this.stableDiffusionService.updateSdConfig(options);
    };

    public getLoraModelList = () => {
        return this.stableDiffusionService.getLoraModelList();
    };

    public selectFolder = () => {
        return this.settingService.selectFolder();
    };

    public getGlobalSetting = () => {
        return this.settingService.getGlobalSetting();
    };

    public updateGlobalSetting = (options: any) => {
        return this.settingService.updateGlobalSetting(options);
    };

    public kolorsTextToImage = (options: any) => {
        return this.kolorsService.textToImage(options);
    };

    public kolorsUpscale = (options: any) => {
        return this.kolorsService.upscale(options);
    };
    public kolorsUpscaleBase64Image = (options: any) => {
        return this.kolorsService.upscaleBase64Image(options);
    };
}
