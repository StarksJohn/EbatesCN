/**
 * Created by Ebates on 16/12/22.
 * quickLogPageReducer的 初始 Immutable 状态, 参考 snowflake 项目 的 authInitialState,
 */
'use strict'
const {Record} = require('immutable') //导入  Immutable.js 的 Record API
import *as RegisterRelevantActions from '../Actions/RegisterRelevantActions'


let InitialState = Record({
    registerBtState: RegisterRelevantActions.registerBtStates.enable,
    isShowRegisterSucessbt:false,
    oauthCodeImgUri:'',//图片验证码的默认uri
    ApiName: '', //

})
export default InitialState