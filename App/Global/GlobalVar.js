/**
 * Created by Ebates on 16/12/2.
 * 全局变量, 此文件 只需 被import 一次
 */

import Log from '../Utils/Log'
global.Log = Log;

import {showToast} from '../Comp/BizCommonComp/BizToast';
global.BizShowToast = showToast;

import {routeName} from './GlobalConst'
global.gRouteName = routeName;

//注册|登录 成功后,pop到 进入注册| 登录页面 之前的最后一个 页面
global.gPopBackToRouteAfteRegisterSuceess='';

import  UserDB from '../DB/BizDB/UserDB'
global.gUserDB=UserDB;//用户数据库

import *as BizStorage from '../DB/BizDB/BizCommonDB/BizStorage'
global.gBizStorage=BizStorage;//业务逻辑通用 数据库api

//
// import *as BizNewSingletonRealmDB from '../db/BizDB/BizNewSingletonRealmDB'
// global.CollectedListSchema=BizNewSingletonRealmDB.CollectedListSchema.name
//
// import *as MapUtils from '../utils/MapUtils'
// global.MapUtils=MapUtils;

