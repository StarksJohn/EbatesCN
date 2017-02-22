/**
 * Created by Ebates on 17/2/22.
 * ForgetPassPageActions
 */
import Colors from '../../Utils/Colors'

/**
 * 继续按钮的状态
 * @type {{unable: {disabled: boolean, backColor: string}, enable: {disabled: boolean, backColor: string}}}
 */
export const goOnBtStates={
    unable:{
        disabled:true,
        backColor:Colors.halfOpacityAppUnifiedBackColor
    },
    enable:{
        disabled:false,
        backColor:Colors.appUnifiedBackColor
    },
}

/**
 * 忘记密码 页面初始化state,避免 record 类型的数据 不因页面Pop而 重置
 * @type {string}
 */
export const  ForgetPassPageInitState='ForgetPassPageInitState';
export function ForgetPassPageInitStateActions() {
    return {
        type:ForgetPassPageInitState,
    }
}

export const  changeGoOnBtStates='changeGoOnBtStates';
export function changeGoOnBtStatesActions(b, apiName) {
    return {
        type:changeGoOnBtStates,
        newState:b?goOnBtStates.enable:goOnBtStates.unable,
        ApiName:apiName,
    }
}