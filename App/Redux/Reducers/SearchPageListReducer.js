/**
 * Created by Ebates on 16/12/27.
 */
import InitialState from '../InitialState/ListInitialState'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'

const initialState = new InitialState()/*通用列表的初始UI状态*/
/*搜索页列表的 特殊状态*/
    .setIn(['ApiName'], BizApi.SearchPageListApi.ApiName)
    .setIn(['isRenderRefreshControl'], false)
    .setIn(['isRenderFooterView'], false);


export default function SearchPageListReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseListActions.BaseListStatus.SUCCESS: {
            let allContent = action.opt === BaseListActions.BaseListFetchDataType.MORE ? [...state.dataArray, ...action.newData] : action.newData;

            let nextState = state
                .setIn(['dataArray'], allContent)
                .setIn(['dataSource'], state.dataSource.cloneWithRows(allContent))
                .setIn(['status'], BaseListActions.BaseListStatus.SUCCESS)
                .setIn(['opt'], action.opt);

            return nextState
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}