/**
 * Created by Ebates on 16/11/18.
 * HttpCacheSizeAction.js
 * 获取 原生双平台的 缓存
 */

import * as CacheManager from 'react-native-http-cache';
import * as FileSize from '../../Utils/FileSize'

/**
 * 获取 缓存 数据 信息
 * @returns string
 */
export async function getHttpCacheSizeAction() {
    try {
        // console.log('filePath=='+filePath);
        let bytes = await CacheManager.getCacheSize();//bytes类型
        let value = FileSize.bytesToSize(bytes);//value 为 string 类型
        return value;
    } catch (e) {
        Log.log('getHttpCacheSizeAction(),error==' + Log.writeObjToJson(e));
    }
}

// export async function getHttpCacheSize(callback) {
//     try {
//         // console.log('filePath=='+filePath);
//         var bytes = await CacheManager.getCacheSize();//bytes类型
//         var value = FileSize.bytesToSize(bytes);//value 为 string 类型
//         // return value;
//         callback(value);
//     } catch (e) {
//         Log.log('getHttpCacheSizeAction(),error==' + Log.writeObjToJson(e));
//     }
// }

export const httpCacheSizeAction = 'httpCacheSizeAction';
/**
 * 发送 获取到的 缓存 信息 到 注册了 httpCacheSizeAction 的 reducer
 * @param cachedSize string
 * @returns {{type: string, cachedSize: *}}
 */
export function sendHttpCacheSizeAction(cachedSize,ApiName) {
    Log.log('HttpCacheSizeAction sendHttpCacheSizeAction cachedSize='+cachedSize);
    Log.log('HttpCacheSizeAction sendHttpCacheSizeAction ApiName='+ApiName);

    return {
        type: httpCacheSizeAction, cachedSize,ApiName
    };
}

// /**
//  * 清缓存action
//  * @type {string}
//  */
// export const clearCacheAction = 'clearCacheAction';
// export function sendClearCacheAction() {
//     return {
//         type: httpCacheSizeAction, cachedSize
//     }
//         ;
// }
/**
 * 清除HTTP缓存
 */
export async function clearCache() {
    try {
        // console.log('filePath=='+filePath);
        let b = await CacheManager.clearCache();//
        return b;
    } catch (e) {
        Log.log('clearCache(),error==' + Log.writeObjToJson(e));
    }
}
