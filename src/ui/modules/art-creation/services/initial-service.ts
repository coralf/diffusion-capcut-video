import { useAppProps } from 'antd/es/app/context';

import { AfterConstruct, Autowired, Bean } from '../../../../common/ioc-manager';
import { ArtCreationStore, IEditTableDataItem } from '../art-creation-store';
import { GlobalSettingService } from './global-setting-service';
import { IpcUiService } from './ipc-ui-service';

@Bean
export class InitialService {

    @Autowired
    private artCreationStore!: ArtCreationStore;

    @Autowired
    private antApi!: useAppProps;

    @Autowired
    private ipcUiService!: IpcUiService;

    @Autowired
    private globalSettingService!: GlobalSettingService;


    @AfterConstruct
    public afterConstruct() {
        this.initialize();
    }

    private async initialize() {
        try {
            this.showLoading(true);
            await this.initMetaSchema();
            await this.initSdModel();
            await this.initLoraModel();
        } catch (e) {
            console.error(e);
            this.antApi.message.error('stable diffusion webui 连接失败，请检查配置', 5);
        } finally {
            this.showLoading(false);
        }
    }


    public showLoading(loading: boolean, text: string = '正在加载') {
        const spinning = loading;
        const options = {
            spinning,
            tip: spinning ? text : ''
        };
        this.artCreationStore.setStore({
            spinProps: options
        });
    }

    private async initLoraModel() {
        const loraModelList = await this.globalSettingService.getLoraModelList();
        this.artCreationStore.setStore({
            loraModelList
        });
    }

    private async initSdModel() {
        const sdModelList = await this.globalSettingService.getSdModelList();
        const sdConfig = await this.globalSettingService.getSdConfig();
        const sdModelCheckpoint = sdConfig['sd_model_checkpoint'];
        const sdModel = sdModelList.find(item => item.title === sdModelCheckpoint)?.title;
        this.artCreationStore.setStore({
            sdModelList,
            sdModel,
            sdModelSelectLoading: false
        });
    }


    private async initMetaSchema() {
        const metaSchema = await this.ipcUiService.getMetaSchema();
        this.artCreationStore.setStore({
            editTableDataSource: this.mapEditTableDataSource(metaSchema.editTableDataSource),
        });
    }


    private mapEditTableDataSource(editTableDataSource: IEditTableDataItem[]) {
        return editTableDataSource;
    }


}
