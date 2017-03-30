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
    // unSelectBorderColor:'',//'rgba(210, 210, 210, 1)',//未选中时的 边框颜色,
    // selectBorderColor:null,//Colors.appUnifiedBackColor,//选中后的 边框颜色
    // curBorderColor:null,//'rgba(210, 210, 210, 1)',//当前显示的 边框颜色
    isSelect:false,
});
export default InitialState