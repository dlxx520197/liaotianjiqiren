const API = (() => {
  const BASE_URL = "https://study.duyiedu.com"; //基地址
  const TOKEN_KEY = "token"; //令牌的存放变量名

  /**
   * 根据传入的路径，发出一个GET请求
   * @param {path} path 路径
   * @returns 返回一个Promise（相应头）
   */
  function get(path) {
    const headers = {};
    // 设置headers的描述信息
    setHeaders(headers);
    return fetch(`${BASE_URL}${path}`, { headers });
  }

  /**
   * 根据传入的路径和body(请求体)发出一个POST请求
   * @param {path} path 路径
   * @param {Object} bodyObj 请求体
   * @returns 返回一个Promise（相应头）
   */
  function post(path, bodyObj) {
    const headers = {
      "content-type": "application/json",
    };
    // 设置headers的描述信息
    setHeaders(headers);
    return fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj),
    });
  }

  /**
   * 设置传入的headers的描述信息
   * @param {headers} headers
   */
  function setHeaders(headers) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
  }

  /**
   *根据传入的对象信息，注册一个账号
   * @param {Object} userInfo {loginId:? loginPwd:? nickname:?}
   * @returns 返回一个注册的对象，如果该对象的code为400，则注册失败，失败的原因为msg
   */
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }

  /**
   *根据传入的账号和密码验证登录
   * @param {Object} loginInfo {loginId:? loginPwd:?}
   * @returns 返回一个登录信息对象，如果登录成功的话，会将令牌保存到本地
   * data:包含了所有的登录信息，如果code为0的话，表示没有错误，登录成功
   */
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const data = await resp.json();
    // 保存令牌到localstorage
    if (data.code === 0) {
      const token = resp.headers.get("Authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return data;
  }

  /**
   * 根据传入的loginId判断账号是否存在
   * @param {String} loginId  loginId
   * @returns 返回一个验证信息 data属性为true则表示该账号已经存在，否则的话，表示该账号不存在
   */
  async function exists(loginId) {
    const resp = await get(`/api/user/exists?loginId=${loginId}`);
    return await resp.json();
  }

  /**
   * 发出一个GET请求，得到当前的用户信息
   * @returns 返回一个用户信息对象
   */
  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }

  /**
   * 根据传入的字符串，发送一个聊天信息
   * @param {string} content
   * @returns 返回一个机器人的回复信息对象
   */
  async function sendMessage(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  }

  /**
   * 发出一个GET请求，得到当前账号的信息历史记录
   * @returns  返回一个信息历史记录的对象
   */
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }

  /**
   * 退出登录
   */
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  // 返回一个api对象
  return {
    reg,
    login,
    exists,
    profile,
    sendMessage,
    getHistory,
    loginOut,
  };
})();
