/**
 * Created by Ebates on 16/12/22.
 * AllMerchantPageInitialState
 * AllMerchantPageReducer 的 初始 Immutable 状态, 参考 snowflake 项目 的 authInitialState,
 */
'use strict'
const {Record, fromJS} = require('immutable') //导入  Immutable.js 的 Record API
import *as BaseGridViewActions from '../Actions/BaseGridViewActions'


let InitialState = Record({
    ApiName:'',
    state:BaseGridViewActions.BaseGridViewStates.fetchOk,
});
export default InitialState