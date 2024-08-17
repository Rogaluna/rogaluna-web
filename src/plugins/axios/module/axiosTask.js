class AxiosTask {
  constructor() {
    if (new.target === AxiosTask) {
      throw new TypeError("无法构造AxiosTask实例");
    }

    if (!this.execute || typeof this.execute !== 'function') {
      throw new TypeError("扩展AxiosTask的类必须实现execute方法");
    }
  }

  // 子类必须实现的execute方法
  async execute() {
    throw new Error("execute方法必须在子类中实现");
  }
}

export default AxiosTask;
