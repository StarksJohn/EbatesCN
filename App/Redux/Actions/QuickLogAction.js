/**
 * Created by Ebates on 16/12/22.
 * 快捷登录页面的action
 */

/**
 * 验证码按钮状态
 * @type {{unable: number, enable: number, countDown: number}}
 */
export const oauthCodeBtState={
    unable:'0',//无法点击状态
    enable:'1',//可点击开始获取验证码状态
    countDown:'2',//倒计时状态
}

/**
 * 登录按钮状态
 * @type {{unable: number, enable: number, countDown: number}}
 */
export const loginBtBtState={
    unable:0,//
    enable:1,//
}

/**
 * 验证码按钮可点击开始获取验证码状态
 * @type {string}
 */
// export const onAuthCodeBtEnableAction = 'onAuthCodeBtEnableAction';
export function onAuthCodeBtEnableAction () {
    return {
        type: oauthCodeBtState.enable,
    }
}

