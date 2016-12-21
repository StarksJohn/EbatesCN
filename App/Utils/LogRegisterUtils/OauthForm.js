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
