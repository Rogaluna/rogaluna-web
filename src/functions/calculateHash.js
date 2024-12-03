export function DJBHash (str) {
  let hash = 5381;
  const len = str.length;
  for (let i = 0; i < len; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i); // 等价于 hash * 33 + c
      hash = hash & 0xFFFFFFFF; // 确保哈希值为32位整数
  }
  return hash >>> 0; // 转换为无符号整数
} 