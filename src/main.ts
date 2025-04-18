/**
 * electron API Documentation
 * https://www.electronjs.org/docs/latest/api/app
 */
import {
  app,
  BrowserWindow,
  screen,
  systemPreferences,
  dialog,
  Menu,
} from "electron";
import * as path from "path";
import http from "http";
import {
  IS_DEV,
  PRODUCT_TITLE,
  PACKAGE_LOCK_PATH,
  ASSETS_PATH,
  PLATFORM,
} from "./constants/config";
import { handleTray, handleUpdate, handleProtocol, log } from "./plugins";
import { crearteServer } from "./server/server";

/**
 * express 服务，代理静态资源
 */
let expressServer: http.Server;
/**
 * electron 窗口
 */
let appWindow: BrowserWindow;

log.info("------------------------------app启动------------------------------");

if (app.requestSingleInstanceLock()) {
  if (!IS_DEV) {
    handleUpdate(appWindow);
  }

  handleProtocol();

  app.whenReady().then(() => {
    log.info("app.whenReady");

    expressServer = crearteServer(21419);
    appWindow = createWindow();

    app.on("activate", () => {
      log.info("app.on('activate')");

      if (!expressServer) {
        expressServer = crearteServer(21419);
      }
      if (!appWindow) {
        appWindow = createWindow();
      }
    });
  });

  app.on("second-instance", () => {
    log.info("app.on('second-instance')");

    if (appWindow?.isMinimized()) {
      appWindow.restore();
    }
    appWindow?.focus();
  });

  app.on("window-all-closed", () => {
    log.info("app.on('window-all-closed')");

    expressServer?.close();
    app?.quit();
  });

  app.on("before-quit", () => {
    log.info("app.on('before-quit')");
    log.info(
      "------------------------------app退出------------------------------"
    );
  });
} else {
  expressServer?.close();
  app?.quit();
}

function createWindow() {
  const microphoneStatus = systemPreferences.getMediaAccessStatus("microphone");
  log.info(
    `systemPreferences.getMediaAccessStatus('microphone') 麦克风权限状态：${microphoneStatus}`
  );
  if (microphoneStatus !== "granted") {
    switch (PLATFORM) {
      case "win":
        dialog.showMessageBox({
          type: "warning",
          title: "提示",
          message: "请前往系统设置中开启麦克风权限",
          buttons: ["确定"],
        });
        break;
      case "mac":
        systemPreferences.askForMediaAccess("microphone").then((status) => {
          log.info(
            `systemPreferences.askForMediaAccess('microphone') 申请麦克风权限结果：${status}`
          );
        });
        break;
      default:
        break;
    }
  }

  let { width, height } = screen.getPrimaryDisplay().workAreaSize;
  log.info(
    `screen.getPrimaryDisplay().workAreaSize 屏幕尺寸：${width}x${height}`
  );
  if (width < 1024 || height < 768) {
    width = 1024;
    height = 768;
  }
  width = Math.round(width * 0.8);
  height = Math.round(height * 0.8);

  log.info(`new BrowserWindow 窗口尺寸：${width}x${height}`);
  const _window = new BrowserWindow({
    icon: path.join(ASSETS_PATH, "img/icon.png"),
    width,
    height,
    center: true,
    resizable: true,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      devTools: IS_DEV,
    },
  });

  if (PLATFORM === "mac") {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
  } else {
    _window.setMenu(null);
  }

  import(PACKAGE_LOCK_PATH).then((res) => {
    _window.setTitle(`${PRODUCT_TITLE} v${res.default.version}`);
  });

  if (IS_DEV) {
    _window.webContents.session.setCertificateVerifyProc(
      (request, callback) => {
        // 忽略SSL证书错误
        callback(0);
      }
    );
    _window.loadURL("https://localhost:3000/");
    _window.webContents.openDevTools();
  } else {
    _window.loadFile(path.join(ASSETS_PATH, "html", "index.html"));
  }

  handleTray(_window);

  return _window;
}
