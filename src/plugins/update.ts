/**
 * electron-builder Auto Update API Documentation
 * https://www.electron.build/auto-update
 */
import { BrowserWindow, dialog, shell } from "electron";
import { MacUpdater, NsisUpdater } from "electron-updater";
import * as path from "path";
import { log } from "./log";
import { PLATFORM, IS_DEV, ASSETS_PATH, OSS_URL } from "../constants/config";
import { getPackageJSON } from "../utils/tools";

let updateWindow: BrowserWindow;
/**
 * 注：electron 内置的 autoUpdater 没有下载进度事件监听，无法实现进度条，不推荐使用
 */
let AutoUpdater: typeof MacUpdater | typeof NsisUpdater;
switch (process.platform) {
  case "darwin":
    AutoUpdater = MacUpdater;
    break;
  case "win32":
    AutoUpdater = NsisUpdater;
    break;
}

/**
 * 检测并下载更新
 */
export function handleUpdate(
  appWindow: BrowserWindow,
  options?: {
    updateNotAvailableCallback?: () => void;
    errorCallback?: () => void;
  }
) {
  const autoUpdater = new AutoUpdater({
    provider: "generic",
    url: `${OSS_URL}/packages/${PLATFORM}`,
  });

  autoUpdater.logger = log;

  // 避免自动下载更新影响用户端网速，由 autoUpdater.downloadUpdate 手动触发下载
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-not-available", (info) => {
    if (typeof options?.updateNotAvailableCallback === "function") {
      options.updateNotAvailableCallback();
    }
    log.info(
      "autoUpdater.on('update-not-available') 当前已经是最新版本：",
      info.version
    );
  });

  autoUpdater.on(
    "error",
    (error, message: string | "net::ERR_INTERNET_DISCONNECTED") => {
      if (typeof options?.errorCallback === "function") {
        options.errorCallback();
      }
      log.error("autoUpdater.on('error') 更新失败 error：", error);
      log.error(`autoUpdater.on('error') 更新失败 message：【${message}】`);
    }
  );

  autoUpdater.on("download-progress", ({ percent }) => {
    appWindow?.setProgressBar(percent / 100);
    updateWindow?.webContents?.send("download-progress_percent", percent);
    log.info("autoUpdater.on('download-progress') 更新进度：", `%${percent}`);
  });

  autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall();
    log.info("autoUpdater.on('update-downloaded') 更新下载完成");
  });

  autoUpdater.on("update-available", (info) => {
    log.info(
      "autoUpdater.on('update-available') 检测到新的客户端版本：",
      info.version
    );
    dialog
      .showMessageBox({
        type: "info",
        title: "版本更新",
        message: `检测到新的客户端版本: v${info.version}`,
        buttons: ["稍后再说", "立即更新并安装"],
      })
      .then(async (index) => {
        if (index.response !== 1) {
          log.info("dialog.showMessageBox 【稍后再说】，取消更新");
          return;
        }
        log.info("dialog.showMessageBox 【立即更新并安装】，开始更新");

        switch (PLATFORM) {
          case "win":
            updateWindow = new BrowserWindow({
              icon: path.join(ASSETS_PATH, "img/icon.png"),
              width: 180,
              height: 30,
              resizable: false,
              fullscreenable: false,
              frame: false,
              autoHideMenuBar: true,
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                devTools: IS_DEV,
              },
            });
            updateWindow.loadFile(path.join(ASSETS_PATH, "html/update.html"));
            autoUpdater.downloadUpdate();
            break;
          case "mac":
            const macPackageJSON = await getPackageJSON({
              platform: "mac",
            });
            if (macPackageJSON?.path) {
              const desktopURL = `${OSS_URL}/packages/mac/${macPackageJSON.path}`;
              shell.openExternal(desktopURL);
            }
            break;
        }
      });
  });
}
