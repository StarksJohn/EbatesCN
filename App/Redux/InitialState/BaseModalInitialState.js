/**
 * Created by Ebates on 16/12/22.
 * BaseModalInitialState.js
 * 通用的
 */
'use strict'

const {Record, fromJS} = require('immutable') //导入  Immutable.js 的 Record API


let InitialState = Record({
    isModalContainerVisible:false,//modal的 父节点 是否显示
    isModelVisible:false,//modal 本身是否显示
    ApiName:''
});
export default InitialState