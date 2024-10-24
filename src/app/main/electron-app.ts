import { app, BrowserWindow, clipboard, globalShortcut, net, protocol, shell } from "electron";
import path from "path";
import { resolveHtmlPath } from "./util";
import { MetaSchemaService } from "../services/meta-schema/MetaSchemaService";
import MenuBuilder from "./menu";
import { IpcService } from "../services/ipc/IpcService";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import os from "os";
import { CreateBeanManager, IocContainer } from "../../common/ioc-manager";
import { JianYingService } from "../services/jianying/JianYingService";
import { SettingService } from "../services/setting/SettingService";
import { StableDiffusionService } from "../services/stable-diffusion/StableDiffusionService";
import { ImageProtocol } from "./img-protocol";


class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}


export function getAssetPath(...paths: string[]) {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../assets');

  return path.join(RESOURCES_PATH, ...paths);
}

export class ElectronApp {


  private iocContext!: IocContainer;


  public initialize = () => {
    if (process.env.NODE_ENV === 'production') {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }

    if (this.isDebug) {
      require('electron-debug')();
    }
    /**
     * Add event listeners...
     */
    app.on('window-all-closed', () => {
      this.metaSchemaService.onWindowClose();
      // Respect the OSX convention of having the application in memory even
      // after all windows have been closed
      // if (process.platform !== 'darwin') {
      app.quit();
      // }
    });

    app.whenReady()
      .then(() => {
        // 自定义本地图片文件访问协议
        protocol.handle(ImageProtocol.Name, (request) => {
          return net.fetch('file://' + request.url.slice(`${ImageProtocol.Name}://`.length));
        });
        const mainWindow = this.createWindow();
        app.on('activate', () => {
          // On macOS it's common to re-create a window in the app when the
          // dock icon is clicked and there are no other windows open.
          if (mainWindow === null) this.createWindow();
        });
      })
      .catch(console.log);

  };

  public getPlatformCompatibleOptions = () => {
    if (os.platform() === 'win32') {
      return {
        titleBarOverlay: {
          color: '#1f1f1f',
          symbolColor: 'rgba(255, 255, 255, 0.85)',
          height: 26
        }
      };
    }

  };


  public createWindow = async () => {
    let mainWindow: BrowserWindow | null = null;

    if (this.isDebug) {
      await this.installExtensions();
    }

    const platformCompatibleOptions = this.getPlatformCompatibleOptions();

    mainWindow = new BrowserWindow({
      // show: false,
      width: 1920,
      height: 1080,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
        nodeIntegration: true,
        webSecurity: false
        // contextIsolation: false,
      },
      // frame: false, // 隐藏窗口边框
      // transparent: true, // 设置窗口透明
      titleBarStyle: 'hidden',
      ...platformCompatibleOptions
    });
    mainWindow.loadURL(resolveHtmlPath('index.html'));
    mainWindow.on('ready-to-show', () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      // mainWindow.webContents.closeDevTools();
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize();
      } else {
        mainWindow.show();
      }
    });

    mainWindow.on('closed', () => {
      this.metaSchemaService.onWindowClose();
      mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
    this.initializeIocContainer(mainWindow);
    return mainWindow;
  };

  private initializeIocContainer(mainWindow: BrowserWindow) {
    this.iocContext = CreateBeanManager({
      instances: {
        browserWindow: mainWindow
      },
      beans: [
        IpcService,
        JianYingService,
        MetaSchemaService,
        SettingService,
        StableDiffusionService,
      ]
    });
  }

  public get metaSchemaService() {
    return this.iocContext.getBean<MetaSchemaService>(MetaSchemaService.name);
  }


  public installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload,
      )
      .catch(console.log);
  };


  public get isDebug() {
    return process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
  }

}
