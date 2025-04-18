import log from "electron-log";
import * as path from "path";
import { USER_DATA_PATH } from "../constants/config";

log.transports.file.resolvePath = () => {
  return path.join(USER_DATA_PATH, `runtime.log`);
};

export { log };
