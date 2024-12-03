/**
 * 计算两个行数组之间的差异（使用 Myers 差异算法）
 * @param {string[]} oldText - 原始行数组
 * @param {string[]} newText - 新行数组
 * @returns {deletions[], insertions[]} 差异操作数组
 */
export default function myersDiffCompare(oldText, newText) {
    const m = oldText.length;
    const n = newText.length;

    // 定义二维数组D，用于保存编辑距离
    const D = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // 初始化边界条件
    for (let i = 0; i <= m; i++) {
        D[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        D[0][j] = j;
    }

    // 计算编辑距离矩阵
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (oldText[i - 1] === newText[j - 1]) {
                D[i][j] = D[i - 1][j - 1]; // 没有修改
            } else {
                D[i][j] = Math.min(
                    D[i - 1][j] + 1,     // 删除操作
                    D[i][j - 1] + 1,     // 插入操作
                    D[i - 1][j - 1] + 1  // 替换操作
                );
            }
        }
    }

    // 回溯得到差异行
    const deletions = [];
    const insertions = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldText[i - 1] === newText[j - 1]) {
            // 如果两行相同，不做任何操作
            i--;
            j--;
        } else {
            if (i > 0 && j > 0 && D[i][j] === D[i - 1][j - 1] + 1) {
                // 替换操作，拆分为删除和插入
                deletions.push(oldText[i - 1]);
                insertions.push(newText[j - 1]);
                i--;
                j--;
            } else if (i > 0 && D[i][j] === D[i - 1][j] + 1) {
                // 删除操作
                deletions.push(oldText[i - 1]);
                i--;
            } else if (j > 0 && D[i][j] === D[i][j - 1] + 1) {
                // 插入操作
                insertions.push(newText[j - 1]);
                j--;
            }
        }
    }

    // 由于是从后向前回溯，需要反转数组
    deletions.reverse();
    insertions.reverse();

    return { deletions, insertions };
}
