/**
 * Created by Ebates on 17/1/18.
 * ImmutableUtils
 *  为 immutable 添加的 扩展
 */

const {List} = require('immutable') //导入  Immutable.js 的 Record API

/**
 *  List 数据类型添加 toJSArray 方法, 返回其 JS的 array 数据结构,但 array里的model还是 immutable 数据类型 ;
 *      如果数据源需要增删的情况不建议 被 官方的API :toJS() 代替,例如 SearchPageListApi 的 $dataArray 如果 this.$dataArray.toJSArray() 改成 this.$dataArray.toJS(), 返回的数组里的model也都是 JS 类型的 数据结构了, 导致 列表 添加或者删除 model后 , 0号cell 都 重绘了
 *      如果数据源不需要 删除, 如 搜索结果页的 商家列表,则 SearchResultPageMerchantListReducer 的 setIn(['dataSource'], state.dataSource.cloneWithRows(temp$dataArray.toJS())) 应该用 toJS() 转成 JS 类型的数据结构, 这样 加载 下页时, 之前页面的 model 对应的cell 都没重绘
 * @returns {List.array|*|Array|string|string|string}
 */
List.prototype.toJSArray = function() {
    return this._tail.array;
};

