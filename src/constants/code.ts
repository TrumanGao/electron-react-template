/**
 * close 事件状态码
 * https://developer.mozilla.org/zh-CN/docs/Web/API/CloseEvent
 */
export enum WS_CLOSE_CODE {
  // '0–999' = '保留段，未使用。'
  /**
   * 正常关闭；无论为何目的而创建，该链接都已成功完成任务。
   */
  CLOSE_NORMAL = 1000,
  /**
   * 终端离开，可能因为服务端错误，也可能因为浏览器正从打开连接的页面跳转离开。
   */
  CLOSE_GOING_AWAY = 1001,
  /**
   * 由于协议错误而中断连接。
   */
  CLOSE_PROTOCOL_ERROR = 1002,
  /**
   * 由于接收到不允许的数据类型而断开连接 (如仅接收文本数据的终端接收到了二进制数据)。
   */
  CLOSE_UNSUPPORTED = 1003,
  // 1004, // '保留。其意义可能会在未来定义。'
  /**
   * 保留。表示没有收到预期的状态码。
   */
  CLOSE_NO_STATUS = 1005,
  /**
   * 保留。用于期望收到状态码时连接非正常关闭 (也就是说，没有发送关闭帧)。
   */
  CLOSE_ABNORMAL = 1006,
  /**
   * 由于收到了格式不符的数据而断开连接 (如文本消息中包含了非 UTF-8 数据)。
   */
  UnsupportedData = 1007,
  /**
   * 由于收到不符合约定的数据而断开连接。这是一个通用状态码，用于不适合使用 1003 和 1009 状态码的场景。
   */
  PolicyViolation = 1008,
  /**
   * 由于收到过大的数据帧而断开连接。
   */
  CLOSE_TOO_LARGE = 1009,
  /**
   * 客户端期望服务器商定一个或多个拓展，但服务器没有处理，因此客户端断开连接。
   */
  MissingExtension = 1010,
  /**
   * 客户端由于遇到没有预料的情况阻止其完成请求，因此服务端断开连接。
   */
  InternalError = 1011,
  /**
   * 服务器由于重启而断开连接。
   */
  ServiceRestart = 1012,
  /**
   * 服务器由于临时原因断开连接，如服务器过载因此断开一部分客户端连接。
   */
  TryAgainLater = 1013,
  // '1014' = '由 WebSocket 标准保留以便未来使用。',
  // '1015' = 'TLS Handshake 保留。 表示连接由于无法完成 TLS 握手而关闭 (例如无法验证服务器证书).',
  // '1016–1999' = '由 WebSocket 标准保留以便未来使用。',
  // '2000–2999' = '由 WebSocket 拓展保留使用。',
  // '3000–3999' = '?可以由库或框架使用.? 不应由应用使用。可以在 IANA 注册，先到先得。',
  // '4000–4999' = '可以由应用使用。',
}

export enum HTTP_CODE {
  /* 成功状态码 */
  SUCCESS = 10000, // "成功"

  /* 参数相关：20001-29999 */
  PARAM_IS_INVALID = 20001, // "参数无效"
  PARAM_IS_BLANK = 20002, // "参数为空"
  PARAM_TYPE_ERROR = 20003, // "参数类型错误"
  PARAM_NOT_COMPLETE = 20004, // "参数缺失"
  ILLEGAL_REQUEST = 20006, // "非法请求"

  /* 账号相关：30001-39999*/
  USER_NOT_LOGGED_IN = 30001, // "用户未登录"
  USER_LOGIN_ERROR = 30002, // "账号或密码错误"
  USER_ACCOUNT_LOCKED = 30003, // "账号已被锁定"
  USER_NOT_EXIST = 30004, // "用户不存在"
  PHONE_HAS_USED = 30005, // "该手机号已被注册"
  SMS_CODE_EXPIRE = 30006, // "短信验证码已失效"
  SMS_CODE_ERROR = 30007, // "短信验证码错误"

  /* 权限错误：40001-49999 */
  PERMISSION_NO_ACCESS = 40001, // "您没有权限访问"
  REPEAT_LOGIN = 40002, // "您的账号已在其他设备上重复登录"

  // 客户端错误
  EXECUTE_COMMAND_ERROR = 50021, // Error executing command
  PYTHON_SCRIPT_ERROR = 50022, // Python script error
  PATH_NOT_EXISTS = 50023, // path not exists

  /* 接口错误：60001-69999 */
  INTERFACE_INNER_INVOKE_ERROR = 60001, // "内部系统接口调用异常"
  INTERFACE_OUTTER_INVOKE_ERROR = 60002, // "外部系统接口调用异常"
  INTERFACE_FORBID_VISIT = 60003, // "该接口禁止访问"
  INTERFACE_ADDRESS_INVALID = 60004, // "接口地址无效"
  INTERFACE_REQUEST_TIMEOUT = 60005, // "接口请求超时"
  INTERFACE_EXCEED_LOAD = 60006, // "接口负载过高"
  INTERFACE_TALKWORK_ERROR = 60007, // "话术变量替换失败"
  INTERFACE_SMSID_ERROR = 60008, // "短信发送失败"
  INTERFACE_PROVIDER_ERROR = 60009, // "服务提供方接口内部异常"

  /* 系统错误：90001-99999 */
  SYSTEM_INNER_BUSY = 90001, // "系统繁忙，请稍后重试"
  SYSTEM_INNER_ERROR = 99999, // "系统内部异常"
}
