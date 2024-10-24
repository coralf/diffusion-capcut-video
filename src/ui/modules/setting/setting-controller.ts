import { makeAutoObservable } from 'mobx';

import { IGlobalSetting } from '../../../app/services/setting/interface';
import { CreateBeanManager, IocContainer } from '../../../common/ioc-manager';
import { toJSON } from '../../utils/utils';
import { IpcUiService } from '../art-creation/services/ipc-ui-service';

export class SettingController {

    private context: IocContainer;

    public globalSetting?: IGlobalSetting;

    public constructor() {
        makeAutoObservable(this);
        this.context = CreateBeanManager({
            instances: {
                [SettingController.name]: this,
            },
            beans: [
                IpcUiService,
            ]
        });

        this.initialize()
    }


    private async initialize() {
        this.globalSetting = await this.getGlobalSetting();
    }

    public getGlobalSetting() {
        return this.ipcUiService.getGlobalSetting();
    }

    public get ipcUiService() {
        return this.context.getBean<IpcUiService>(IpcUiService.name);
    }


    public selectFolder = async () => {
        const path = await this.ipcUiService.selectFolder();
        if (path) {
            this.setGlobalSetting({
                jianyingWorkspace: path
            });
        }
    }

    public updateGlobalSetting = () => {
        return this.ipcUiService.updateGlobalSetting(toJSON(this.globalSetting || {}));
    }


    public setGlobalSetting = (values: Partial<IGlobalSetting>) => {
        this.globalSetting = {
            ...this.globalSetting,
            ...values
        } as IGlobalSetting;
    };

}
