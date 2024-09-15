import SparkMD5 from 'spark-md5';

// 生成 MD5 校验码
const generateMD5 = (data) => {
  return SparkMD5.ArrayBuffer.hash(data);
};

export default generateMD5;