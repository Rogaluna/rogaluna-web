import { axiosInstance } from "../../main";

const registerAPI = async (username, password) => {
  try {
    // 发送 POST 请求到注册 API
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axiosInstance.post('/api/account/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("已注册", response.data);

    // 返回注册成功的信息
    return response.data;
  } catch (error) {
    console.error("注册失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default registerAPI;
