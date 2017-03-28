/**
 * Created by Ebates on 2017/3/27.
 * AllMerchantPageActions.js
 */

/**
 * 全部商家页 获取 最左边的下拉列表数据 成功后 调用
 * @type {string}
 */
export const fetchCategoryListSuccess='fetchCategoryListSuccess';
export function fetchCategoryListSuccessAction(ApiName,dataArr) {
    return {type: fetchCategoryListSuccess, ApiName:ApiName,dataArr:dataArr};
}