/**
 * Created by Ebates on 16/12/27.
 * SearchResultPageCouponListReducer
 * 搜索结果页 优惠 列表的 reducer
 */
import {
    ListView,
} from 'react-native';
import InitialState, {
    InitListState,
    ListToLoadingState,
    ListSuccesState,
    ListWillUnmount
} from '../InitialState/ListInitialState'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
const {List, fromJS} = require('immutable') //导入  Immutable.js 的 Record API


const initialState = new InitialState()/*通用列表的初始UI状态*/
/*搜索结果页 优惠 列表的 特殊状态*/
    .setIn(['ApiName'], BizApi.SearchResultPageCouponListAPI.ApiName)
    .setIn(['isRenderRefreshControl'], false)
    .setIn(['tabLabel'], BizApi.SearchResultPageCouponListAPI.tabLabel);

export default function SearchResultPageCouponListReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseListActions.BaseListStatus.INITIALIZE: {//此控件第一次 componentDidMount 挂载时 回调

            return InitListState(state, action);
        }
            break;
        case BaseListActions.BaseListStatus.Loading: {//正在 加载网络 状态
            return ListToLoadingState(state, action);
        }
            break;
        case BaseListActions.BaseListStatus.SUCCESS: {

            let {newContentArray, couldLoadMore}= action.newData;

            let temp$dataArray = ListSuccesState(state, action, newContentArray);

            let nextState = state
                .setIn(['$dataArray'], temp$dataArray)
                .setIn(['dataSource'], state.dataSource.cloneWithRows(temp$dataArray.toJS()))
                .setIn(['status'], BaseListActions.BaseListStatus.SUCCESS)
                .setIn(['couldLoadMore'], couldLoadMore)
                .setIn(['opt'], action.opt)
                .setIn(['isRefreshing'], false);

            return nextState;
        }
            break;

        case BaseListActions.BaseListStatus.NODATA: {

            let _nextState = state
                .setIn(['status'], action.type)
                .setIn(['opt'], action.opt);

            return _nextState;
        }
            break;
        case BaseListActions.BaseListStatus.WillUnmount: {

            BizApi.SearchResultPageCouponListAPI.componentDidMount = false;
            return ListWillUnmount(state);
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}