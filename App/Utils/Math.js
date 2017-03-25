/**
 * Created by Ebates on 16/12/28.
 * Math
 * 计算相关
 */

/**
 * 生成 [min,max] 的随机数 http://www.cnblogs.com/javaScriptYang/p/5684797.html
 * @param min
 * @param max
 */
export function randomNums(min, max) {
    // let a= parseInt(Math.random()*(max-min+1)+min,10);
    //  Log.log('a==='+a);
    let b = Math.floor(Math.random() * (max - min + 1) + min);
    // Log.log('b===' + b);
    // showToast('产生新随机数===' + b);
    return b;
}

/**
 * 丢弃小数部分,保留整数部分 http://www.ablanxue.com/shtml/201407/23258_1.shtml
 * @param n
 * @returns {Number}
 * @constructor
 */
export function Math_parseInt(n) {
    return parseInt(n);
}

/**
 * 计算 绝对值, 不知道为啥外部 调用就报错
 * @param value
 * @returns {number}
 * @constructor
 */
// export function AbsoluteValue(value) {
//     return Math.abs(value)
// }
