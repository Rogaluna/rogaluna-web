const generateUid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.random() * 16 | 0; // 随机生成0-15的整数
    const value = char === 'x' ? random : (random & 0x3 | 0x8); // 根据规则设置 x 或 y 位
    return value.toString(16); // 转为16进制
  });
};

export default generateUid;