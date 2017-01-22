/**
 * Created by Ebates on 17/1/19.
 * SearchResultPageActions
 * 搜索结果页的 actions
 */
import *as BaseListActions from './BaseListActions'

export const defultTabLabels = 'getDefultTabLabels';
/**
 * 搜索结果页的 ScrollableTabView 挂载时, 获取 默认的 2个 列表的 tabLabel
 * @returns {{type: string}}
 */
export function getDefultTabLabelsAction() {
    return {
        type: defultTabLabels,
    }
}

export const updateTabLabels = 'updateTabLabels';
/**
 * 更新 搜索结果 页的 ScrollableTabView 的 某个 tabLabel的 值
 * @param tabLabelTag : BizApi里 不同 API  的 tabLabel 的 默认值
 * @param nums 数量
 * @returns {{type: string}}
 */
export function updateTabLabelsAction(tabLabelTag,nums) {
    return {
        type: updateTabLabels,
        value:{tabLabelTag:tabLabelTag,nums:nums}
    }
}

/**
 * 商家列表 无数据 action
 * @param keyWord 搜索的关键词
 * @returns {{type: string, value: {tabLabelTag: *, nums: *}}}
 */
export function merchantListNodataAction(keyWord,ApiName,opt) {
    return {
        type: BaseListActions.BaseListStatus.NODATA,
        ApiName:ApiName,
        opt:opt
    }
}