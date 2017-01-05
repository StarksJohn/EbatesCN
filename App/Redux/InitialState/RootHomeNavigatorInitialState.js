/**
 * Created by Ebates on 16/12/22.
 * 跟组件的 主页 一级页面的 根nav的 初始状态
 */
'use strict'
const {Record} = require('immutable') //导入  Immutable.js 的 Record API
import RootPagesContainer from '../Container/RootPagesContainer'
// import LogInPage from '../../Pages/LogInPage'


var InitialState = Record({

    initialRoute: {
        component: RootPagesContainer,
        name: gRouteName.RootPagesContainer//'RootPagesContainer'
    }

})
export default InitialState