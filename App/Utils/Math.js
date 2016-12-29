/**
 * Created by Ebates on 16/12/28.
 *
 * 计算相关
 */

/**
 * 生成0到任意值的随机数 http://www.cnblogs.com/javaScriptYang/p/5684797.html
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
