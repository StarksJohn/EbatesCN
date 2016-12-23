/**
 * Created by Ebates on 16/12/22.
 * 快捷登录页面的action
 */
import Colors from '../../Utils/Colors'

/**
 * 验证码按钮状态
 * @type {{unable: number, enable: number, countDown: number}}
 */
export const oauthCodeBtState={
    unable:{
        id:'0',
        backColor:Colors.halfOpacityAppUnifiedBackColor
    },//无法点击状态
    enable:{
        id:'1',
        backColor:Colors.appUnifiedBackColor
    },//可点击开始获取验证码状态
    countDown:{
        id:'2',
        backColor:Colors.halfOpacityAppUnifiedBackColor
    },//倒计时状态
}

/**
 * 登录按钮状态
 * @type {{unable: number, enable: number, countDown: number}}
 */
export const loginBtBtState={
    unable:{
        id:'0',
        backColor:Colors.halfOpacityAppUnifiedBackColor
    },//
    enable:{
        id:'1',
        backColor:Colors.appUnifiedBackColor
    },//
}

/**
 * 验证码按钮可点击开始获取验证码状态
 * @type {string}
 */
export function onAuthCodeBtEnableAction () {
    return {
        type: oauthCodeBtState.enable,
    }
}

/**
 * 验证码按钮进入 unable 状态
 * @returns {{type: number}}
 */
export function onAuthCodeBtUnableAction () {
    return {
        type: oauthCodeBtState.unable,
    }
}


