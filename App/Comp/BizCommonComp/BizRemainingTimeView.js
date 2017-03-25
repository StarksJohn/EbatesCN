/**
 * Created by Ebates on 2017/3/25.
 * BizRemainingTimeView 项目里业务逻辑需要的 显示不同类型的 剩余时间的 控件
 */
import React, {Component, PropTypes} from 'react';
import {
    View, Text, Image
} from 'react-native';

import *as DateUtils from '../../Utils/DateUtils'
import BizCountDownView from './BizCountDownView'
import *as StringOauth from '../../Utils/StringUtils/StringOauth'

/**
 * 画项目里的 过期时间 控件
 * @param startDate // '2017-03-22T00:00:00+00:00' UTC格式
 * @param endDate //'2017-03-22T00:00:00+00:00' UTC格式
 * @param hoursStyle
 * @param minsStyle
 * @param secsStyle
 * @param firstColonStyle
 * @param secondColonStyle
 * @param onEnd
 * @returns {XML}
 */
export function renderBizRemainingTimeView(startDate, endDate, hoursStyle, minsStyle, secsStyle, firstColonStyle, secondColonStyle, onEnd) {
    startDate='';//服务器发来的 startDate 没用
    let remainTime = DateUtils.CountDownUtil(startDate, endDate);
    if (remainTime.d <= 0) {
        if (remainTime.RemainingTime==0){//结束时间在 开始时间之前
            Log.log('BizRemainingTimeView renderBizRemainingTimeView 结束时间在 开始时间之前')
            return (
                <Text style={{//flex:1,
                    marginLeft: 5, marginTop: 0, fontSize: 12, color: 'rgba(136, 136,' +
                    ' 136, 1)', textAlign: "right", alignSelf: 'center',
                    //backgroundColor: Colors.getRandomColor()
                }} numberOfLines={1}
                >
                    已过期
                </Text>
            );
        }else{
            return (
                <BizCountDownView
                    startDate={startDate}
                    endDate={endDate}
                    hoursStyle={hoursStyle}
                    minsStyle={minsStyle}
                    secsStyle={secsStyle}
                    firstColonStyle={firstColonStyle}
                    secondColonStyle={secondColonStyle}
                    onEnd={
                        ()=>{
                            if (onEnd){
                                onEnd();
                            }
                        }
                    }
                />
            );
        }

    } else if (remainTime.d > 0 && remainTime.d < 30) {
        let str = remainTime.d + '天后过期'
        return (
            <Text style={{//flex:1,
                marginLeft: 5, marginTop: 0, fontSize: 12, color: 'rgba(136, 136,' +
                ' 136, 1)', textAlign: "right", alignSelf: 'center',
                //backgroundColor: Colors.getRandomColor()
            }} numberOfLines={1}
            >
                {str}
            </Text>
        );
    } else if (remainTime.d >= 30) {
        let temp = new Date(endDate);

        // Log.log(StringOauth.anyThingToString(DateUtils.leadingZeros(temp.getMonth())));
        // Log.log(StringOauth.anyThingToString(DateUtils.leadingZeros(temp.getDate())));
        // Log.log(StringOauth.anyThingToString(DateUtils.leadingZeros(temp.getFullYear())));

        let str = DateUtils.leadingZeros(temp.getMonth() + 1) + '/' + DateUtils.leadingZeros(temp.getDate()) + '/' + DateUtils.leadingZeros(temp.getFullYear()) + '后过期';
        return (
            <Text style={{//flex:1,
                marginLeft: 5, marginTop: 0, fontSize: 12, color: 'rgba(136, 136,' +
                ' 136, 1)', textAlign: "right", alignSelf: 'center',
                //backgroundColor: Colors.getRandomColor()
            }} numberOfLines={1}
            >
                {str}
            </Text>
        );
    }
}