import { app } from "electron";
import * as path from "path";
import { PRODUCT_NAME, IS_DEV, PLATFORM } from "../constants/config";

/**
 * 注册伪协议
 */
export function handleProtocol() {
  // 每次运行都删除自定义协议 然后再重新注册
  app.removeAsDefaultProtocolClient(PRODUCT_NAME);

  if (IS_DEV && PLATFORM === "win") {
    // 设置 electron.exe 和 app 的路径
    app.setAsDefaultProtocolClient(PRODUCT_NAME, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient(PRODUCT_NAME);
  }
}
