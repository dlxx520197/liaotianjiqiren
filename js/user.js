// 验证账号的通用代码
// 对某一个表单验证的构造函数
class FieldValidator {
  /**
   *
   * @param {String} txtId  文本框的id
   * @param {Function} func  验证规则的函数，需要对文本框验证时的时候，调用该函数，验证成功返回true,验证失败返回flase
   */
  constructor(txtId, func) {
    this.input = $(`#${txtId}`);
    this.validatorFunc = func;
    this.p = this.input.nextElementSibling;
    this.input.onblur = () => {
      this.validate();
    };
  }

  //   验证，验证成功返回true,验证失败返回flase
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerHTML = err;
      return false;
    } else {
      this.p.innerHTML = "";
      return true;
    }
  }

  /**
   *验证传入的所有的表单项
   * @param  {...any} validators
   * @returns 全部验证成功则返回true,有一个验证失败则返回false
   */
  static async validate(...validators) {
    const promise = validators.map((item) => item.validate());
    const results = await Promise.all(promise);
    return results.every((item) => item);
  }
}
