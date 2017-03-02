/**
 * Created by Ebates on 16/12/27.
 * 注册相关的actions
 */
import Colors from '../../Utils/Colors'
import *as BizApi from '../../NetWork/API/BizApi'


export const registerBtStates={
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
 * 注册页面初始化state,避免 record 类型的数据 不因页面Pop而 重置
 * @type {string}
 */
export const  registerPageInitState='registerPageInitState';
export function registerPageInitStateActions() {
    return {
        type:registerPageInitState,
        ApiName:BizApi.RegisterPageApi.ApiName,
    }
}

export const  changeRegisterBtStates='changeRegisterBtStates';
export function changeRegisterBtStatesActions(b) {
    return {
        type:changeRegisterBtStates,
        ApiName:BizApi.RegisterPageApi.ApiName,
        newState:b?registerBtStates.enable:registerBtStates.unable
    }
}

export const  showRegisterSucessbt='showRegisterSucessbt';
export function showRegisterSucessbtAction() {
    return {
        type:showRegisterSucessbt,
        ApiName:BizApi.RegisterPageApi.ApiName,
    }
}