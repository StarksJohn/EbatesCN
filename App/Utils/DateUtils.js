/**
 * Created by Ebates on 17/3/22.
 * DateUtils
 * 日期格式转换
 */
import React, {Component, PropTypes} from 'react';
import {
    View, Text,
} from 'react-native';
import SMSTimer from './SMSTimer'
import CountDown from '../Comp/BizCommonComp/BizCountDownView'
import *as StringOauth from './StringUtils/StringOauth'


/**

 * @constructor
 */
/**
 * 业务逻辑需要,计算2个 UTC 字符串表示的日期的 差值
 * start end  : 都是 '2017-03-22T00:00:00+00:00' UTC格式
 * @returns {{d:number, h: number, m: number, s: number}} {天,时,分,秒}
 * @constructor
 */
export function CountDownUtil(start, end) {
    // let time= Date.parse('2017-04-07T00:00:00+00:00');

    // let now =    '2017-03-22T00:00:00+00:00';
    // let expire = '2017-03-23T00:00:00+00:00';
    // let dt = new Date(temper.replace(/-/,"/"));
    // ConvertDateFromString(temper);

    let temp = new Date();
    // Log.log('DateUtils CountDownUtil temp=' + temp);
    // start = new Date(temp.getUTCFullYear(), temp.getUTCMonth(), temp.getUTCDay(), temp.getUTCHours(), temp.getUTCMinutes(), temp.getUTCSeconds(), temp.getUTCMilliseconds()),
    //     Log.log('DateUtils CountDownUtil start=' + start);

    let startDate = null;
    if (StringOauth.isNull(start)) {
        startDate =temp
            // new Date(Date.UTC(temp.getUTCFullYear(),temp.getUTCMonth(),temp.getUTCDate(),temp.getUTCHours(),temp.getUTCMinutes(),temp.getUTCSeconds(),temp.getUTCMilliseconds()));//得到当前时区的时间正确
            //temp //得到当前时区的时间正确
            //Date.now();
            // new Date(temp.getUTCFullYear(), temp.getUTCMonth(), temp.getUTCDay(), temp.getUTCHours(), temp.getUTCMinutes(), temp.getUTCSeconds(), temp.getUTCMilliseconds())
            // new Date(
            //     new Date() - 8 * 60 * 60 * 1000
            // );//获取当前时区时间往前推8小时,也就是当前的UTC 时间
        Log.log('DateUtils CountDownUtil startDate=' + startDate);

    }else{
        startDate=new Date(start)
        Log.log('DateUtils CountDownUtil startDate=' + startDate);
    }

    // Log.log('new Date().getTime()=' + new Date().getTime());

    let endDate = new Date(end);//得到的是 传入的时间+8小时 后的时间,因为 服务器 发来 的都是 0时区的, 所以得到的 new Date() 也是当前时区的 时间
    Log.log('DateUtils CountDownUtil endDate=' + endDate);

    let leftDate = endDate - startDate;//减下来是个  Unix时间戳 形式的 数字
    Log.log('DateUtils CountDownUtil leftDate=' + leftDate);

    return millisecondsToTime(leftDate);

}

/**
 * 毫秒级别的 时间戳 转化成 {天,时,分,秒} 对象格式
 * @param milliseconds
 * @returns {{d: number, h: number, m: number, s: number, RemainingTime: number}}
 */
export function millisecondsToTime(milliseconds) {
    return {
        d: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
        h: Math.floor(milliseconds / (1000 * 60 * 60)) % 24,
        m: Math.floor(milliseconds / (1000 * 60)) % 60,
        s: Math.floor(milliseconds / 1000) % 60,
        RemainingTime:milliseconds/1000
    };
}

/**
 * 表示 时间 的数字如果是 个位数, 变成 0x 格式的 字符串
 * @param num
 * @param length
 * @returns {*}
 */
export function leadingZeros(num, length = null) {

    let length_ = length;
    let num_ = num;
    if (length_ === null) {
        length_ = 2;
    }
    num_ = String(num_);
    while (num_.length < length_) {
        num_ = '0' + num_;
    }
    return num_;
}