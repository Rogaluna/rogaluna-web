import AxiosTask from "../axiosTask";

class AsyncTask extends AxiosTask {
  constructor(executeFunction) {
    super();

    if (new.target === AxiosTask) {
      throw new TypeError("无法构造Axios派生类实例");
    }

    if (!executeFunction || typeof executeFunction !== 'function') {
      throw new TypeError('execute 必须有一个可用的实现');
    }

    this.executeFunction = executeFunction;
  }

  async execute() {
    try {
      await this.executeFunction();
    } catch (error) {
      console.error('execute 无法执行:', error);
      throw error;
    }
  }
}

export default AsyncTask;
