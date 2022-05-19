(async () => {
  // 验证当前的账号是否已经登录
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("你的账号未登录或登录已过期，点击确定，跳转到登录页面");
    location.href = "./login.html";
    return;
  }

  //   获取昵称和loginId的dom元素
  const doms = {
    nickname: $("#nickname"),
    loginId: $("#loginId"),
    close: $(".close"),
    chatContainer: $(".chat-container"),
    msgContainer: $(".msg-container"),
    txtMsg: $("#txtMsg"),
  };

  //设置用户信息
  setUserInfo();
  //添加事件
  addEvent();
  // 加载聊天历史记录
  loadHistory();

  /**
   * 加载聊天历史记录
   */
  async function loadHistory() {
    const resp = await API.getHistory();
    resp.data.forEach((item) => {
      sendChat(item);
    });
  }

  /**
   * 很据传入的聊天信息，设置聊天
   * @param {Object} item
   */
  function sendChat(item) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (item.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = item.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";
    const content = $$$("div");
    content.classList.add("chat-content");
    content.innerText = item.content;
    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = defalutTime(item.createdAt);
    // 加入的dom结构里面去
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
    // 设置滚动条的位置
    setScroll();
  }

  /**
   * 设置滚动条的位置
   */
  function setScroll() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  /**
   * 格式化传入时间戳
   * @param {string} date
   * @returns {string} 返回一个格式化后的日期字符串
   */
  function defalutTime(date) {
    const dates = new Date(date);
    const year = dates.getFullYear();
    const month = (dates.getMonth() + 1).toString().padStart(2, "0");
    const day = dates.getDate().toString().padStart(2, "0");
    const hour = dates.getHours().toString().padStart(2, "0");
    const minute = dates.getMinutes().toString().padStart(2, "0");
    const seconds = dates.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  }

  /**
   * 设置用户信息
   */
  function setUserInfo() {
    //   设置用户信息
    doms.nickname.innerText = user.nickname;
    doms.loginId.innerText = user.loginId;
  }

  /**
   * 添加事件
   */
  function addEvent() {
    //   退出登录
    doms.close.addEventListener("click", () => {
      API.loginOut();
      location.href = "./login.html";
    });
    // 发送消息表单提交事件
    doms.msgContainer.addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = doms.txtMsg.value;
      if (!doms.txtMsg.value) {
        return;
      }
      // 发送消息
      sendChat({
        content,
        from: user.loginId,
        to: null,
        createdAt: Date.now(),
      });
      // 清空文本框
      doms.txtMsg.value = "";
      // 设置滚动条
      setScroll();
      const resp = await API.sendMessage(content);
      sendChat({
        from: null,
        to: user.loginId,
        ...resp.data,
      });
      // 设置滚动条
      setScroll();
    });
  }
})();
