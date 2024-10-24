import { Bean } from '../../../../common/ioc-manager';

export const ipcRender = window.electron.ipcRender;

@Bean
export class IpcUiService {
    private ipcRender = ipcRender;


    public getSdModelList() {
        return this.ipcRender.invoke('getSdModelList');
    }

    public getSdConfig() {
        return this.ipcRender.invoke('getSdConfig');
    }

    public updateSdConfig(options: any) {
        return this.ipcRender.invoke('updateSdConfig', options);
    }

    public getLoraModelList() {
        return this.ipcRender.invoke('getLoraModelList');
    }

    public getMetaSchema() {
        return ipcRender.invoke('getMetaSchema');
    }

    public selectFolder() {
        return ipcRender.invoke('selectFolder');
    }

    public updateGlobalSetting(options: any) {
        return ipcRender.invoke('updateGlobalSetting', options);
    }

    public getGlobalSetting() {
        return ipcRender.invoke('getGlobalSetting');
    }

}
