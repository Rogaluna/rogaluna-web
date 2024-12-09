import Vue from 'vue';
import AxiosTask from "./axiosTask";

class TaskQueue {
  constructor() {
    this.queue = Vue.observable([]);;
    this.isProcessing = false;
  }

  addTask(task) {
    // 检查是否是AxiosTask的派生类
    if (!(task instanceof AxiosTask)) {
      throw new TypeError("Task must be an instance of AxiosTask or its subclass");
    }

    this.queue.push(task);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift();
    try {
      await task.execute();
    } catch (error) {
      console.error('任务执行失败:', error);
      // 错误处理逻辑
    }
    await this.processQueue();
  }
}

export default TaskQueue;
