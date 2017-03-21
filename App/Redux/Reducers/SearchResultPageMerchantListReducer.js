/**
 * Created by Ebates on 16/12/27.
 *
 * 搜索结果页 商家 列表的 reducer
 */
import {
    ListView,
} from 'react-native';
import InitialState, {
    InitListState,
    ListToLoadingState,
    ListSuccesState,
    ListFailureState,
    ListWillUnmount
} from '../InitialState/ListInitialState'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
const {List, fromJS} = require('immutable') //导入  Immutable.js 的 Record API


const initialState = new InitialState()/*通用列表的初始UI状态*/
/*搜索结果页 商家 列表的 特殊状态*/
    .setIn(['ApiName'], BizApi.SearchResultPageMerchantListAPI.ApiName)
    .setIn(['isRenderRefreshControl'], false)
    .setIn(['tabLabel'], BizApi.SearchResultPageMerchantListAPI.tabLabel)
    ;

export default function SearchResultPageMerchantListReducer(state = initialState, action) {
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
            return ListSuccesState(state, action);

        }
            break;

        case BaseListActions.BaseListStatus.NODATA: {

            let _nextState = state
                .setIn(['status'], action.type)
                .setIn(['opt'], action.opt);

            return _nextState;
        }
            break;

        case BaseListActions.BaseListStatus.FAILURE: {

            return ListFailureState(state, action);
        }
            break;
        case BaseListActions.BaseListStatus.WillUnmount: {

            return ListWillUnmount(state, action);
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}