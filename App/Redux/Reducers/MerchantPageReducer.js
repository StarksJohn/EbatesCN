/**
 * Created by Ebates on 17/2/17.
 * MerchantPageReducer
 */
import InitialState,{InitListState,ListToLoadingState,ListSuccesState} from '../InitialState/ListInitialState'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
const {List, fromJS} = require('immutable') //导入  Immutable.js 的 Record API
const initialState = new InitialState()/*通用列表的初始UI状态*/
/*商家页列表的 特殊状态*/
    .setIn(['ApiName'], BizApi.MerchantPageApi.ApiName)
    .setIn(['isRenderRefreshControl'], false)
    .setIn(['isRenderFooterView'], true);

export default function MerchantPageReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseListActions.BaseListStatus.INITIALIZE: {//此控件第一次 componentDidMount 挂载时 回调

            return InitListState(state,action);
        }
            break;
        case BaseListActions.BaseListStatus.Loading: {//正在 加载网络 状态
            return ListToLoadingState(state,action);
        }
            break;
        case BaseListActions.BaseListStatus.SUCCESS: {

            return ListSuccesState(state,action);

        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}