import { ElectronApp } from './electron-app';

function initialize() {
  const electronApp = new ElectronApp();
  electronApp.initialize();
}
initialize();
