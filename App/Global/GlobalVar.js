/**
 * Created by Ebates on 16/12/2.
 * 全局变量, 此文件 只需 被import 一次
 */

import Log from '../Utils/Log'
global.Log = Log;

import {showToast} from '../Comp/BizCommonComp/BizToast';
global.showToast = showToast;

import {routeName} from './GlobalConst'
global.gRouteName = routeName;

// import *as UserDB from '../db/UserDB'
// global.UserSchema=UserDB.UserSchema.tableName;//用户表名
//
// import *as BizNewSingletonRealmDB from '../db/BizDB/BizNewSingletonRealmDB'
// global.CollectedListSchema=BizNewSingletonRealmDB.CollectedListSchema.name
//
// import *as MapUtils from '../utils/MapUtils'
// global.MapUtils=MapUtils;

