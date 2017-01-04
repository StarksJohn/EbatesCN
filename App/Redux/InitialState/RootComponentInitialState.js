/**
 * Created by Ebates on 16/12/22.
 * 跟组件的 初始 Immutable 状态, 参考 snowflake 项目 的 authInitialState,
 */
'use strict'
const {Record} = require('immutable') //导入  Immutable.js 的 Record API
import RootNavigator from '../../Root/RootNavigator'
// import LogInPage from '../../Pages/LogInPage'


var InitialState = Record({
    // homeNav:RootNavigator,
    // RecommendFriendsNav:LogInPage,// 推荐好友

    curNav:RootNavigator,//跟页面 默认的 nav

})
export default InitialState