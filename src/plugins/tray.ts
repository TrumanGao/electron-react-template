import { app, BrowserWindow, nativeImage, Menu, Tray, dialog } from "electron";
import * as path from "path";
import { PRODUCT_NAME, ASSETS_PATH } from "../constants/config";
import { handleUpdate } from "./update";

/**
 * 配置托盘
 */
export function handleTray(appWindow: BrowserWindow) {
  const image = nativeImage.createFromPath(
    path.join(ASSETS_PATH, "img/icon.png"),
  );
  const tray = new Tray(image.resize({ width: 18, height: 18 }));

  tray.setToolTip(PRODUCT_NAME);

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "检查更新",
        click() {
          appWindow?.show();
          handleUpdate(appWindow, {
            updateNotAvailableCallback() {
              dialog.showMessageBox({
                type: "info",
                title: "版本更新",
                message: "当前已经是最新版本",
                buttons: ["确定"],
              });
            },
            errorCallback() {
              dialog.showMessageBox({
                type: "error",
                title: "版本更新",
                message: "更新失败，请检查网络状态后重试",
                buttons: ["确定"],
              });
            },
          });
        },
      },
      {
        label: "显示",
        click() {
          appWindow?.show();
        },
      },
      {
        label: "退出",
        click() {
          app.quit();
          tray.destroy();
          appWindow?.destroy();
        },
      },
    ]),
  );

  tray.on("click", () => {
    appWindow.show();
  });
}
