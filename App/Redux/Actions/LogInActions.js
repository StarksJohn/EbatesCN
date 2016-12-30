/**
 * Created by Ebates on 16/12/28.
 */

export const  showImgOauthInput='showImgOauthInput';
export function showImgOauthInputAction() {
    return {
        type:showImgOauthInput,
    }
}

export const  hideImgOauthInput='hideImgOauthInput';
export function hideImgOauthInputAction() {
    return {
        type:hideImgOauthInput,
    }
}

/**
 * 改变图片验证码
 * @type {string}
 */
export const changeOauthCodeImg='changeOauthCodeImg';
export function changeOauthCodeImgAction(uri) {
    return {
        type:changeOauthCodeImg,
        uri:uri
    }
}