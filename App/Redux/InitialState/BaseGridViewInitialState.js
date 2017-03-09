/**
 * Created by Ebates on 16/12/22.
 * BaseGridViewInitialState
 */
'use strict'

const {Record, fromJS} = require('immutable') //导入  Immutable.js 的 Record API
import *as BaseGridViewActions from '../Actions/BaseGridViewActions'


let InitialState = Record({
   state:BaseGridViewActions.BaseGridViewStates.Loading,
    dataArray:[],//数据源
    ApiName:'',
});
export default InitialState