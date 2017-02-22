/**
 * Created by Ebates on 16/12/20.
 * 验证本地输入的表单
 */
import *as StringOauth from '../StringUtils/StringOauth'


/**
 * 验证email
 * @param email
 * @returns {boolean}
 */
export function oauthEmail(email){
    return email!=''&& StringOauth.contain(email,'@') && !StringOauth.isContainChinese(email);

}

export function oauthPass(pass){
    return StringOauth.getStrLen(pass)>=6 &&  !StringOauth.isContainChinese(pass) ;

}

/**
 * 验证 图片验证码 字数, 包含 数字和字母,不包含 汉字
 * @param pass
 * @returns {boolean}
 */
export function oauthImgCodePass(pass){
    return StringOauth.getStrLen(pass)>0 &&  !StringOauth.isContainChinese(pass) ;

}

export function oauthPhone(text){
    return StringOauth.getStrLen(text)==11 && StringOauth.isAllNum(text)
}

/**
 * 检测手机验证码,只能是 数字
 * @param text
 * @returns {boolean}
 */
export function oauthCode(text){
    return StringOauth.getStrLen(text)==4 && StringOauth.isAllNum(text)
}
