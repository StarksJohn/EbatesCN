/**
 * Created by Ebates on 16/11/11.
 * 封装原生的 获取文件大小的函数, 因 realm 没找到 获取 default.realm 大小的API
 */
import React from 'react';
import {
    Platform
} from 'react-native';
// var FileSize = require('react-native').NativeModules.FileSize; //访问名为 FileSize 的 原生模块(IOS和安卓的原生模块都叫此名)
// import {showToast} from '../../comp/CommonComp';
// import {wrapApi} from '../../utils/TranslateNativeModules'
// import Log from '../../utils/Log'

// import { NativeModules } from 'react-native';
// var FileSize = NativeModules.FileSize;

/**
 * * 调原生的 获取文件大小的 API
 * @param filePath
 * @returns {*} str
 */
// const nativeGetSizeOfFile = wrapApi(FileSize.getSizeOfFile);
// export function getSizeOfFile(filePath) {
//     return nativeGetSizeOfFile(filePath)
// }
// export async function fileSize(filePath,callBack) {
//     try {
//         var result = await getSizeOfFile(filePath);
//         let value=bytesToSize(result['totalSize']);//value 为 string 类型
//         showToast('获取缓存成功,result==' + value);
//         // return value;
//         callBack(value);
//     } catch (e) {
//         // console.error(e);
//         showToast('fileSize,error==' + Log.writeObjToJson(e));
//     }
// }

/**
 * byte类型数据 转成 适合显示的类型的字符串
 * @param bytes
 * @returns {*}
 */
export function bytesToSize(bytes) {
    Log.log('bytes==='+bytes);
    if (bytes === 0) return '0 B';
    let k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}