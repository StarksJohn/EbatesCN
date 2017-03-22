/**
 * Created by Ebates on 17/3/14.
 * MerchantDetailPageActions
 */
import Colors from '../../Utils/Colors'

/**
 * 优化及折扣和 如何获得返利 这2个按钮的 可能状态
 * @type {{unable: {disabled: boolean, backColor: string}, enable: {disabled: boolean, backColor: string}}}
 */
export const btStates = {
    unSelect: {
        TextColor: Colors.backPopBtColor,
        lineColor: Colors.transparent
    },
    Select: {
        TextColor: Colors.appUnifiedBackColor,
        lineColor: Colors.appUnifiedBackColor
    },
}

/**
 * 改变优惠及折扣cell2个按钮的状态
 * @type {string}
 */
export const ChangeIsSelectCouponsForMerchantBt = 'ChangeIsSelectCouponsForMerchantBt';
export function changeIsSelectCouponsForMerchantBt(b, ApiName) {
    return {type: ChangeIsSelectCouponsForMerchantBt, data: b, ApiName: ApiName}
}

/**
 * 是否显示 底部 加载中 视图
 * @type {string}
 */
export const changeIsRenderFooterView = 'isRenderFooterView';
export function changeIsRenderFooterViewAction(b, ApiName) {
    return {type: changeIsRenderFooterView, data: b, ApiName: ApiName}
}

/**
 * 切换到 优惠及折扣 列表 的对应数据源
 * @type {string}
 */
export const changeToCouponList='changeToCouponList';
export function changeToCouponListAction(opt, ApiName, newData) {
    return {type:changeToCouponList,opt,ApiName,newData}
}

