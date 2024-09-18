import { axiosInstance } from "../../main";

const loginAPI = async (username, password) => {
  try {
    // 发送 POST 请求到登录 API
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axiosInstance.post('/api/account/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("Token 已获取", response.data);

    // 返回注册成功的信息
    return response.data;
  } catch (error) {
    console.error("登录失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default loginAPI;
