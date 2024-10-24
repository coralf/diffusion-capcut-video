import { BrowserWindow, dialog } from "electron";
import os from "os";
import path from "path";
import fs from "fs";
import { merge } from "lodash";
import { Autowired, Bean } from "../../../common/ioc-manager";
import { IGlobalSetting } from "./interface";


@Bean
export class SettingService {

  @Autowired
  private browserWindow!: BrowserWindow;

  // 数据存储目录
  private dataDicPath: string = path.join(os.homedir(), '.effect-ut');

  private globalSettingCache: IGlobalSetting | null = null;

  private get dataSettingPath() {
    return path.join(this.dataDicPath, 'global-setting.json');
  }

  public constructor() {
    this.initialize();
  }


  private initialize() {
    if (!fs.existsSync(this.dataDicPath)) {
      fs.mkdirSync(this.dataDicPath);
      this.writeGlobalSetting({
        'workspace': {
          'workspaceDicName': 'ut-workspace',
          'metaInfoFileName': 'meta-info.json',
          'imagesDicName': 'images',
          'audiosDicName': 'audios',
          'srtsDicName': 'srts'
        },
        'stableDiffusionBaseUrl': ''
      });
    }
  }

  public get globalSetting() {
    if (!this.globalSettingCache) {
      this.globalSettingCache = this.getGlobalSetting();
    }
    return this.globalSettingCache;
  }


  public getGlobalSetting() {
    const globalSettingStr = fs.readFileSync(this.dataSettingPath, 'utf-8');
    const globalSetting = JSON.parse(globalSettingStr || '{}');
    return globalSetting as IGlobalSetting;
  }


  public writeGlobalSetting(value: any) {
    return fs.writeFileSync(this.dataSettingPath, JSON.stringify(value), 'utf-8');
  }


  public updateGlobalSetting(additionalSetting: Partial<IGlobalSetting>) {
    const globalSetting = this.getGlobalSetting();
    const mgGlobalSetting = merge({}, globalSetting, additionalSetting);
    this.globalSettingCache = mgGlobalSetting;
    return this.writeGlobalSetting(mgGlobalSetting);
  }

  public selectFolder() {
    return dialog.showOpenDialog(this.browserWindow, {
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled) {
        const selectedFolder = result.filePaths[0];
        this.updateGlobalSetting({
          jianyingWorkspace: selectedFolder
        });
        return selectedFolder;
      }
    }).catch(err => {
      console.error(err);
    });
  }


  public getFoldPath = (path: string) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    return path;
  }

  public getWorkSpaceFoldPath = () => {
    const workspaceFold = path.join(this.globalSetting.jianyingWorkspace, this.globalSetting.workspace.workspaceDicName);
    return this.getFoldPath(workspaceFold);
  }


  public getImagesFoldPath = () => {
    const workspaceFold = path.join(this.getWorkSpaceFoldPath(), this.globalSetting.workspace.imagesDicName);
    return this.getFoldPath(workspaceFold);
  }

  public getAudiosFoldPath = () => {
    const workspaceFold = path.join(this.getWorkSpaceFoldPath(), this.globalSetting.workspace.audiosDicName);
    return this.getFoldPath(workspaceFold);
  };

  public getSrtsFoldPath = () => {
    const workspaceFold = path.join(this.getWorkSpaceFoldPath(), this.globalSetting.workspace.srtsDicName);
    return this.getFoldPath(workspaceFold);
  };


  public getWorkspaceMetaInfoFilePath() {
    return path.join(this.globalSetting.jianyingWorkspace, this.globalSetting.workspace.workspaceDicName, this.globalSetting.workspace.metaInfoFileName);
  }


}
