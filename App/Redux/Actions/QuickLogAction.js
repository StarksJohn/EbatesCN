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
        backColor:Colors.halfOpacityAppUnifiedBackColor,
        disabled:true,
        title:'获取验证码'
    },//无法点击状态
    enable:{
        id:'1',
        backColor:Colors.appUnifiedBackColor,
        disabled:false,
        title:'获取验证码'
    },//可点击开始第一次获取验证码状态
    countDown:{
        id:'2',
        backColor:Colors.halfOpacityAppUnifiedBackColor,
        disabled:true,
        title:'已发送'
    },//倒计时更新状态
    resend:{
        id:'3',
        backColor:Colors.appUnifiedBackColor,
        disabled:false,
        title:'重发验证码'
    },//可点击开始第一次获取验证码状态
}

/**
 * 登录按钮状态
 * @type {{unable: number, enable: number, countDown: number}}
 */
export const loginBtBtState={
    unable:{
        id:'0',
        backColor:Colors.halfOpacityAppUnifiedBackColor,
        disabled:true

    },//
    enable:{
        id:'1',
        backColor:Colors.appUnifiedBackColor,
        disabled:false

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

/**
 * 验证码按钮进入 countDown 状态
 * @returns {{type: number}}
 */
export function onAuthCodeBtCountDownAction (lastTime) {
    return {
        type: oauthCodeBtState.countDown,
        lastTime:lastTime
    }
}

/**
 * 重发
//  */
export function onAuthCodeBtResendAction () {
    return {
        type: oauthCodeBtState.resend,
    }
}


