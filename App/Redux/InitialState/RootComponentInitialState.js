/**
 * Created by Ebates on 16/12/22.
 * 跟组件的 初始 Immutable 状态, 参考 snowflake 项目 的 authInitialState,
 */
'use strict'
const {Record} = require('immutable') //导入  Immutable.js 的 Record API
import RootHomeNavigatorContainer from '../Container/RootHomeNavigatorContainer'
import RooRecommendFriendNavContainer from '../Container/RooRecommendFriendNavContainer'

/**
 * 根页面左图里的 nav
 * @type {{RootHomeNavigatorContainer: *}}
 */
export const rootNavs={
    RootHomeNavigatorContainer:RootHomeNavigatorContainer,
    RootRecommendFriendNavContainer:RooRecommendFriendNavContainer,
}

let InitialState = Record({

    curNav:rootNavs.RootHomeNavigatorContainer,//跟页面 默认的 nav

})
export default InitialState