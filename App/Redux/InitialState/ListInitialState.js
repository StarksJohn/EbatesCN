/**
 * Created by Ebates on 16/12/22.
 * ListInitialState
 * 通用列表的  初始 Immutable 状态, 参考 snowflake 项目 的 authInitialState,
 */
'use strict'
const {Record} = require('immutable') //导入  Immutable.js 的 Record API

import {
    ListView,
} from 'react-native';
import *as BaseListActions from '../Actions/BaseListActions'


var InitialState = Record({
    status: BaseListActions.BaseListStatus.INITIALIZE,
    dataArray: [], //已经拿到的数据
    dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    isRefreshing: false, //是否正在 下拉刷新状态
    couldLoadMore: false, //是否能加载下页
    ApiName: null, //区分一个action 由哪个reducer 接收, 但是 某个控件发action时 不好带上这个ApiName
    isRenderRefreshControl:true,// 是否画 下拉刷新 控件
    isRenderFooterView:true,// 是否画列表底部 的 加载更多| 加载完毕 控件
    opt: BaseListActions.BaseListFetchDataType.INITIALIZE,//请求接口的方式
    tabLabel:'',//如果 列表用于 react-native-scrollable-tab-view 的 child, 此属性就用于 react-native-scrollable-tab-view
})
export default InitialState
