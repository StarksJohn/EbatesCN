/**
 * Created by Ebates on 17/3/9.
 * BaseGridViewActions
 */

export const BaseGridViewStates = {
    Loading: 0,//正在读接口
    fetchOk: 1,//数据 拿到 成功
    fetchFail: 2, // 数据 拿失败
};

export const ChangeBaseGridViewStatesAction='changeBaseGridViewStatesAction';
export function changeBaseGridViewStates(ApiName, states,dataArr) {
    return {type: ChangeBaseGridViewStatesAction, ApiName:ApiName, newState:states,dataArr:dataArr};
}

/**
 * 改变 网格视图里 item的 边框颜色
 * @type {string}
 */
export const ChangeBaseGridViewItemborderColorAction='ChangeBaseGridViewItemborderColorAction';
export function ChangeBaseGridViewItemborderColor(ApiName, newBorderColor) {
    return {type: ChangeBaseGridViewStatesAction, ApiName:ApiName, newBorderColor};
}