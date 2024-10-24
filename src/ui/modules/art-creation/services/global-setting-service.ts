import { makeAutoObservable } from 'mobx';

import { AfterConstruct, Autowired, Bean } from '../../../../common/ioc-manager';
import { IpcUiService } from './ipc-ui-service';

export interface ISdModel {
    modelName: string;
    imageUrl: string;
}

@Bean
export class GlobalSettingService {

    public sdModelList: ISdModel[] = [];

    @Autowired
    private ipcUiService!: IpcUiService;


    public constructor() {
        makeAutoObservable(this);
    }

    @AfterConstruct
    async afterConstruct() {
    }


    public async getSdModelList() {
        const sdModelList = await this.ipcUiService.getSdModelList();
        return sdModelList.map(item => {
            return { ...item, value: item.title, label: item.modelName };
        });
    }

    public async getLoraModelList() {
        const loraModelList = await this.ipcUiService.getLoraModelList();
        return loraModelList.map(item => {
            return { ...item, key: item.name };
        });
    }

    public async getSdConfig() {
        const sdConfig = await this.ipcUiService.getSdConfig();
        return sdConfig;
    }

    public async updateSdConfig(options: any) {
        return this.ipcUiService.updateSdConfig(options);
    }

    public getLoraPrompts = (loraModels: any[]) => {
        return loraModels?.map(item => {
            return `<lora:${item.key}:${item.weight || 1}>`;
        }).join(',');
    };


}
