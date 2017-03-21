/**
 * Created by Ebates on 17/3/20.
 * DataType
 * 判断js中的数据类型的几种方法  http://www.cnblogs.com/dushao/p/5999563.html
 */

export function isString(data) {
    return Object.prototype.toString.call(data) === '[object String]';
}

export function isArray(data) {
    return Object.prototype.toString.call(data) === '[object Array]';
}