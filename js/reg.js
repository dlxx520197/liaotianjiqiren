const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "该账号已注册";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", async function (
  val
) {
  if (!val) {
    return "请填写昵称";
  }
});

const loginIdPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "请填写密码";
  }
});

const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== loginIdPwdValidator.input.value) {
      return "两次密码不一致，请重新输入";
    }
  }
);

const form = $(".user-form");

form.onsubmit = async (e) => {
  e.preventDefault();
  //   验证所有的表单是否通过
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginIdPwdValidator,
    loginPwdConfirmValidator
  );
  //   如果没有通过直接返回
  if (!result) {
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  //   验证通过，调用API注册
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功,点击确定，跳转到登录界面");
    location.href = "./login.html";
  }
};
