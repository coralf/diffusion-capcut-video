import { contextBridge, ipcRenderer } from "electron";
import { IpcService } from "./../services/ipc/IpcService";

/**
 * 暴露在window上面给前端调用
 */
const electronHandler = {
  ipcRender: {
    send(key: string, ...args: any[]) {
      ipcRenderer.send(key, ...args);
    },

    invoke(key: Exclude<keyof IpcService, 'initialize'>, ...args: any[]) {
      return ipcRenderer.invoke(key, ...args);
    },
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);


export type ElectronHandler = typeof electronHandler;
