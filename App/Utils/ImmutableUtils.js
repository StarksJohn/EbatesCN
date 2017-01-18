/**
 * Created by Ebates on 17/1/18.
 * ImmutableUtils
 *  为 immutable 添加的 扩展
 */

const {List} = require('immutable') //导入  Immutable.js 的 Record API

/**
 *  List 数据类型添加 array 方法, 返回其 JS的 array 数据结构
 * @returns {List.array|*|Array|string|string|string}
 */
List.prototype.array = function() {
    return this._tail.array;
};

