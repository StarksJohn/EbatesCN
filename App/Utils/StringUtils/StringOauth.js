/**
 * Created by Ebates on 16/12/20.
 * 字符串验证
 */

/**
 * str1里是否包含str2
 * @param str1
 * @param str2
 * @returns {boolean}
 */
export function contain(str1,str2) {
    // indexOf: str第一次在str1里出现的下标
    return str1.indexOf(str2)>0;
}
