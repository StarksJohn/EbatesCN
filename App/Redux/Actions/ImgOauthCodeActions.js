/**
 * Created by Ebates on 17/2/22.
 *  ImgOauthCodeActions
 * 图片验证码控件相关的 actions
 */



export const changeOauthCodeImg='changeOauthCodeImg';
/**
 * 改变图片验证码
 * @param uri
 * @param apiName 哪个api 需要改变其 图片验证码, 如 注册页 和 修改密码 页面 都可能 发此action
 * @returns {{type: string, uri: *, ApiName: *}}
 */
export function changeOauthCodeImgAction(uri,apiName) {
    return {
        type:changeOauthCodeImg,
        uri:uri,
        ApiName:apiName,
    }
}