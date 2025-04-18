import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import { exec } from "child_process";
import {
  PLATFORM,
  PACKAGE_LOCK_PATH,
  USER_DATA_PATH,
  PUBLIC_PATH,
} from "../constants/config";
import { HTTP_CODE } from "../constants/code";
import { getPackageJSON } from "../utils/tools";
import { log } from "../plugins";

export const app = express();

app.use(cors());
/**
 * 处理 Content-Type: application/x-www-form-urlencoded 的数据
 */
app.use(express.urlencoded({ extended: true }));
/**
 * 处理 Content-Type: application/json 的数据
 */
app.use(express.json());

app.get("/", async function (req, res) {
  const packageLockJSON = (await import(PACKAGE_LOCK_PATH)).default;
  try {
    const packageJSON = await getPackageJSON({ platform: PLATFORM });
    const content = `当前已联网。本地客户端版本：${packageLockJSON.version}；最新客户端版本：${packageJSON.version}`;
    res.send(content);
  } catch (error) {
    const content = `当前无网络。本地客户端版本：${packageLockJSON.version}`;
    res.send(content);
  }
});

app.get("/meta", function (req, res) {
  res.sendFile(PACKAGE_LOCK_PATH);
});

app.get("/monitor", function (req, res) {
  res.sendFile(path.join(USER_DATA_PATH, `runtime.log`));
});

app.post("/api/code/pythonMinifier", (req, res) => {
  if (!req?.body?.code) {
    return res.send({
      code: HTTP_CODE.PARAM_IS_BLANK,
      message: "No code provided",
    });
  }

  let pythonMinifierPath = "";
  switch (PLATFORM) {
    case "win":
      pythonMinifierPath = path.join(
        PUBLIC_PATH,
        "python-minifier",
        "main.exe"
      );
      break;
    case "mac":
      pythonMinifierPath = path.join(PUBLIC_PATH, "python-minifier", "main");
      break;
  }
  log.info("pythonMinifier - pythonMinifierPath:", pythonMinifierPath);

  if (!fs.existsSync(pythonMinifierPath)) {
    log.error(`pythonMinifier -【${pythonMinifierPath}】not exists.`);
    return res.send({
      code: HTTP_CODE.PATH_NOT_EXISTS,
      message: `【${pythonMinifierPath}】not exists`,
    });
  }

  // 将code写入文件，python-minifier 文件
  const tempfilePath = path.join(USER_DATA_PATH, "main.temp.py");
  fs.removeSync(tempfilePath);
  fs.writeFileSync(tempfilePath, req.body.code, {
    encoding: "utf8",
  });

  const command = `"${pythonMinifierPath}" --path "${tempfilePath}" --remove-literal-statements --rename-globals --remove-asserts --remove-debug`;

  log.info("pythonMinifier - command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      const errorMessage =
        error.message || `${error.name}: Error executing command`;
      log.error("pythonMinifier - Error executing command:", {
        name: error.name,
        message: errorMessage,
        stack: error.stack,
        code: error.code,
      });
      return res.send({
        code: HTTP_CODE.EXECUTE_COMMAND_ERROR,
        message: errorMessage,
      });
    }
    if (stderr) {
      log.error("pythonMinifier - Python script error:", stderr);
      return res.send({ code: HTTP_CODE.PYTHON_SCRIPT_ERROR, message: stderr });
    }
    log.info("pythonMinifier - Minified stdout: ", stdout);

    const minfilePath = path.join(USER_DATA_PATH, "main.min.py");
    fs.remove(minfilePath).then(() => {
      fs.writeFile(minfilePath, stdout, {
        encoding: "utf8",
      });
    });
    return res.send({ code: HTTP_CODE.SUCCESS, data: stdout });
  });
});

export function crearteServer(port: number) {
  return app.listen(port, function () {
    log.info(`app.listen localhost:${port}`);
  });
}
