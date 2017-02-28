/**
 * Created by Ebates on 16/12/22.
 * quickLogPageReducer的 初始 Immutable 状态, 参考 snowflake 项目 的 authInitialState,
 */
'use strict'
const {Record} = require('immutable') //导入  Immutable.js 的 Record API
import *as quickLogAction from '../Actions/QuickLogAction'


let InitialState = Record({
    oauthCodeBtState: new (Record(
        {
            // quickLogAction.oauthCodeBtState.unable
            id:quickLogAction.oauthCodeBtState.unable.id,
            backColor:quickLogAction.oauthCodeBtState.unable.backColor,
            disabled:quickLogAction.oauthCodeBtState.unable.disabled,
            title:quickLogAction.oauthCodeBtState.unable.disabled.title
        }
    ))(),//,
    loginBtBtState: quickLogAction.loginBtBtState.unable
})
export default InitialState