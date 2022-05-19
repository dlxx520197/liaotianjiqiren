const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});

const loginIdPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  //   验证所有的表单是否通过
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginIdPwdValidator
  );
  //   如果没有通过直接返回
  if (!result) {
    return;
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.login(data);
  if (resp.code === 0) {
    location.href = "./index.html";
  } else {
    loginIdValidator.p.innerHTML = "账号或密码错误";
    loginIdPwdValidator.input.value = "";
    loginIdValidator.input.value = "";
  }
};
