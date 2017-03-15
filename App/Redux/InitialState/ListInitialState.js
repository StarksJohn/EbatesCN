/**
 * Created by Ebates on 16/12/22.
 * ListInitialState
 * 通用列表的  初始 Immutable 状态, 参考 snowflake 项目 的 authInitialState,
 */
'use strict'
const {Record, fromJS,} = require('immutable') //导入  Immutable.js 的 Record API
import {
    ListView,
} from 'react-native';
import *as BaseListActions from '../Actions/BaseListActions'


let InitialState = Record({
    status: BaseListActions.BaseListStatus.INITIALIZE,
    componentDidMount: false, //控件是否被 挂载
    dataArray: [], //已经拿到的数据,慢慢被 $dataArray 代替
    $dataArray: fromJS([]), //已经拿到的数据,immutable.List 数据类型  , 里边放 model, toJS()可转成JS 数组
    dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    isRefreshing: false, //是否正在 下拉刷新状态
    couldLoadMore: false, //是否能加载下页
    ApiName: null, //区分一个action 由哪个reducer 接收, 但是 某个控件发action时 不好带上这个ApiName
    isRenderRefreshControl: true,// 是否画 下拉刷新 控件
    isRenderFooterView: true,// 是否画列表底部 的 加载更多| 加载完毕 控件
    opt: BaseListActions.BaseListFetchDataType.INITIALIZE,//请求接口的方式
    tabLabel: '',//如果 列表用于 react-native-scrollable-tab-view 的 child, 此属性就用于 react-native-scrollable-tab-view
    meta: {//列表接口一般都会返回的字段,用于翻页
        "pagination": {
            "total": 0,
            "count": 0,
            "per_page": 10,
            "current_page": 0,
            "total_pages": 0,
            "links": {
                "next": 0,
                "previous": 0
            }
        }
    },
    AdditionalObj: null,//附加对象,供外部赋值
});
export default InitialState;

/**
 * 通用的 初始化 列表的 state, 在 控件第一次 componentDidMount 挂载时 回调
 * @param state
 * @constructor
 */
export function InitListState(state, action) {
    let temp$dataArray = state.getIn(['$dataArray']);
    if (temp$dataArray.toJS().length > 0) {
        temp$dataArray = temp$dataArray.clear();
    }

    let _nextState = state
        .setIn(['$dataArray'], temp$dataArray)
        .setIn(['dataSource'], state.dataSource.cloneWithRows(temp$dataArray.toJS()))
        .setIn(['status'], action.type)
        .setIn(['couldLoadMore'], false)
        .setIn(['opt'], action.opt)
        .setIn(['componentDidMount'], true)
        .setIn(['isRefreshing'], false)
        .remove('meta');

    return _nextState;
}

/**
 * 通用的 listview 转化为 Loading 状态
 * @param state
 * @param action
 * @returns {Cursor}
 * @constructor
 */
export function ListToLoadingState(state, action) {
    let _nextState = state
            .setIn(['status'], action.type)
            .setIn(['couldLoadMore'], action.opt == BaseListActions.BaseListFetchDataType.INITIALIZE/*第一次获取列表数据时,显示footerView*/)
            .setIn(['opt'], action.opt)
            .setIn(['isRefreshing'], action.opt == BaseListActions.BaseListFetchDataType.REFRESH)
        ;
    return _nextState;
}

/**
 * 通用的 处理 成功状态 的 数据
 * @constructor
 */
export function ListSuccesState(state, action) {

    let {newContentArray, meta/*服务器返回的 字段*/}= action.newData;

    let temp$dataArray = state.getIn(['$dataArray']);

    if (temp$dataArray) {
        if (action.opt == BaseListActions.BaseListFetchDataType.REFRESH) {
            temp$dataArray = temp$dataArray.clear();
        }
        //新获取到的数据添加到数组 结尾
        newContentArray.map(
            (v, i) => {
                // temp$dataArray = temp$dataArray.push(v);
                temp$dataArray = temp$dataArray.set(temp$dataArray.size, v);

            }
        );
    }

    let nextState = state
        .setIn(['$dataArray'], temp$dataArray)
        .setIn(['dataSource'], state.dataSource.cloneWithRows(temp$dataArray.toJS()))
        .setIn(['status'], BaseListActions.BaseListStatus.SUCCESS)
        .setIn(['couldLoadMore'], meta ? meta.pagination.current_page < meta.pagination.total_pages : action.newData.couldLoadMore)
        .setIn(['opt'], action.opt)
        .setIn(['isRefreshing'], false)
        .setIn(['meta'], meta);

    return nextState;

}

/**
 * 通用列表的 网络异常 状态
 * @returns {Cursor}
 * @constructor
 */
export function ListFailureState(state, action) {
    let _nextState = state
        .setIn(['status'], action.type)
        .setIn(['opt'], action.opt)
        .setIn(['couldLoadMore'], false)
        .setIn(['isRefreshing'], false);

    return _nextState;
}

/**
 * 列表即将被 从 DOM 移除
 * @param state
 * @param action
 * @returns {Map<K, V>|List<T>|Cursor|*}
 * @constructor
 */
export function ListWillUnmount(state,action) {

    let temp$dataArray = state.getIn(['$dataArray']);
    if (temp$dataArray.toJS().length > 0) {
        temp$dataArray = temp$dataArray.clear();
    }

    let _nextState = state
        .setIn(['$dataArray'], temp$dataArray)
        .setIn(['dataSource'], state.dataSource.cloneWithRows(temp$dataArray.toJS()))
        .setIn(['status'], action.type)
        .setIn(['couldLoadMore'], false)
        .setIn(['opt'], action.opt)
        .setIn(['componentDidMount'], false)
        .setIn(['isRefreshing'], false)
        .remove('meta');

    return _nextState;
}

/**
 * 列表删除某条数据
 * @returns {Cursor}
 * @constructor
 */
export function ListRemoveOneItem(state, action) {
    let {index/*被删除元素在数组里的下标*/}= action.newData;

    let temp$dataArray = state.getIn(['$dataArray']);

    if (temp$dataArray) {
        temp$dataArray = temp$dataArray.delete(index);
    }

    let nextState = state
        .setIn(['$dataArray'], temp$dataArray)
        .setIn(['dataSource'], state.dataSource.cloneWithRows(temp$dataArray.toJS()))

    return nextState;
}
