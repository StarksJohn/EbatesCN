/**
 * Created by Ebates on 16/12/28.
 */
import *as BizApi from '../../NetWork/API/BizApi'

export const  showImgOauthInput='showImgOauthInput';
export function showImgOauthInputAction() {
    return {
        type:showImgOauthInput,
        ApiName:BizApi.LogInApi.ApiName,
    }
}

export const  hideImgOauthInput='hideImgOauthInput';
export function hideImgOauthInputAction() {
    return {
        type:hideImgOauthInput,
        ApiName:BizApi.LogInApi.ApiName,

    }
}
