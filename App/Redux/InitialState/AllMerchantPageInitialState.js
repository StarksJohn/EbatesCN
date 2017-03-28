/**
 * Created by Ebates on 16/12/22.
 * AllMerchantPageInitialState
 * AllMerchantPageReducer 的 初始 Immutable 状态, 参考 snowflake 项目  https://github.com/bartonhammond/snowflake#notes  的 authInitialState,
 */
// 'use strict'
import React from 'react';
import {
    // StyleSheet,
    // View,
    // Text,
    // Image,
    // ListView,
    // TouchableOpacity,
    // InteractionManager,
    Animated,
} from 'react-native';

const {Record, fromJS} = require('immutable') //导入  Immutable.js 的 Record API
// import *as BaseGridViewActions from '../Actions/BaseGridViewActions'


let InitialState = Record({
    ApiName:'',
    searchKeys:'',//筛选的关键词
    isShowDropDownlist:false,//是否画 下拉列表
    DropDownListY: new Animated.Value(0),//下拉列表的 起始坐标
});
export default InitialState