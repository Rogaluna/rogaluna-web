import { axiosInstance } from "../../main";
import Cookies from 'js-cookie';

const loginAPI = async (usernameOrId, password) => {
  try {
    // 发送 POST 请求到登录 API
    const formData = new FormData();
    formData.append('usernameOrId', usernameOrId);
    formData.append('password', password);

    const response = await axiosInstance.post('/api/account/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("Token 已获取", response.data);

    // 将 Token 设置到 Cookie 中
    Cookies.set('token', response.data.token, {
      secure: false, // 确保在 HTTP 连接下也允许使用
      sameSite: 'Strict', // 防止 CSRF 攻击，设置为 'Strict' 或 'Lax'
    });

    // 返回登录成功的信息
    return { success: true, message: "login success" };
  } catch (error) {
    console.error("登录失败: ", error);
    // 返回登录失败的消息
    return { success: false, message: error.message };
  }
};

export default loginAPI;
