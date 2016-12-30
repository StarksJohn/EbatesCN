/**
 * Created by Ebates on 16/12/27.
 * 注册相关的actions
 */
import Colors from '../../Utils/Colors'

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
    }
}

export const  changeRegisterBtStates='changeRegisterBtStates';
export function changeRegisterBtStatesActions(b) {
    return {
        type:changeRegisterBtStates,
        newState:b?registerBtStates.enable:registerBtStates.unable
    }
}

export const  showRegisterSucessbt='showRegisterSucessbt';
export function showRegisterSucessbtAction() {
    return {
        type:showRegisterSucessbt,
    }
}

/**
 * 改变图片验证码
 * @type {string}
 */
export const changeRegisterOauthCodeImg='changeRegisterOauthCodeImg';
export function changeOauthCodeImgAction(uri) {
    return {
        type:changeRegisterOauthCodeImg,
        uri:uri
    }
}