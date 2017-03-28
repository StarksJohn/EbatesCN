/**
 * Created by Ebates on 2017/3/27.
 * BizDropDownMenuAndListActions.js
 * 通用的 筛选控件(包含 menu和 下拉列表) 的 actions
 */

/**
 * 改变 下拉列表的高
 * @type {string}
 */
export const changeDropDownListH='changeDropDownListH';
export function changeDropDownListHAction(ApiName,H) {
    return {type: changeDropDownListH, ApiName,H};
}

/**
 * 下拉列表控件 卸载时, 重置 其默认的 高
 * @type {string}
 */
export const resetDropDownListH='resetDropDownListH';
export function resetDropDownListHAction(ApiName) {
    return {type: resetDropDownListH, ApiName};
}