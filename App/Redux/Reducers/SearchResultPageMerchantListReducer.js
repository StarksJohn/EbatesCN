/**
 * Created by Ebates on 16/12/27.
 *
 * 搜索结果页 商家 列表的 reducer
 */
import {
    ListView,
} from 'react-native';
import InitialState from '../InitialState/ListInitialState'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
const {List,fromJS} = require('immutable') //导入  Immutable.js 的 Record API


const initialState = new InitialState()/*通用列表的初始UI状态*/
/*搜索结果页 商家 列表的 特殊状态*/
    .setIn(['ApiName'], BizApi.SearchResultPageMerchantListAPI.ApiName)
    .setIn(['isRenderRefreshControl'], false)
    .setIn(['tabLabel'], BizApi.SearchResultPageMerchantListAPI.tabLabel);

export default function SearchResultPageMerchantListReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseListActions.BaseListStatus.SUCCESS: {

            let allContent =
                // action.opt === BaseListActions.BaseListFetchDataType.MORE ? loadMore(state.dataArray, action.newData) :
                    action.newData;

            let nextState = state
                .setIn(['dataArray'], allContent)
                .setIn(['dataSource'], state.dataSource.cloneWithRows(allContent))
                .setIn(['status'], BaseListActions.BaseListStatus.SUCCESS)
                .setIn(['opt'], action.opt);

            return nextState;
        }
            break;

        case BaseListActions.BaseListStatus.NODATA: {

            let _nextState=state
                // .setIn(['dataArray'], newdataArray)
                // .setIn(['dataSource'], state.dataSource.cloneWithRows(newdataArray))
                .setIn(['status'], action.type)
                .setIn(['opt'], action.opt);

            return _nextState;
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}