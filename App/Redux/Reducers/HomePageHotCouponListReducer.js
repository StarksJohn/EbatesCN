/**
 * Created by Ebates on 17/3/14.
 * HomePageHotCouponListReducer 首页热门优惠列表
 */
const {Record, fromJS,} = require('immutable') //导入  Immutable.js 的 Record API

import InitialState, {
    InitListState,
    ListToLoadingState,
    ListSuccesState,
    ListFailureState,
    ListRemoveOneItem,ListWillUnmount,ListRemoveNumsItem,ListChangeOneItem,ListInsertOneItem
} from '../InitialState/ListInitialState'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
// import *as MerchantDetailPageActions from '../Actions/MerchantDetailPageActions'


const initialState = new InitialState()
    .setIn(['ApiName'], BizApi.HomePageHotCouponListApi.ApiName)
    .setIn(['isRenderRefreshControl'], false)
    .setIn(['isRenderFooterView'], true);


export default function HomePageHotCouponListReducer(state = initialState, action) {
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
        case BaseListActions.BaseListStatus.FAILURE: {

            return ListFailureState(state, action);
        }
            break;
        case BaseListActions.BaseListStatus.REMOVE: {

            return ListRemoveOneItem(state, action);
        }
            break;
        case BaseListActions.BaseListStatus.WillUnmount:{

            return ListWillUnmount(state,action);
        }

        case BaseListActions.BaseListStatus.RemoveNums: {

            return ListRemoveNumsItem(state, action);
        }
            break;
        case BaseListActions.BaseListStatus.ChangeOneItem: {

            return ListChangeOneItem(state, action);
        }
            break;
        case BaseListActions.BaseListStatus.InsertOneItem: {

            return ListInsertOneItem(state, action);
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}