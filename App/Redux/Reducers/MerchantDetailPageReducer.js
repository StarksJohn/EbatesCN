/**
 * Created by Ebates on 17/3/14.
 * MerchantDetailPageReducer
 */
const {Record, fromJS,} = require('immutable') //导入  Immutable.js 的 Record API

import InitialState, {
    InitListState,
    ListToLoadingState,
    ListSuccesState,
    ListFailureState,
    ListRemoveOneItem
} from '../InitialState/ListInitialState'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as MerchantDetailPageActions from '../Actions/MerchantDetailPageActions'

// class MerchantDetailPageInitState extends Record({isSelectCouponsForMerchantBt: false}) {
//     // constructor(props) {
//     //     super(props);
//     // }
// }


const initialState = new InitialState().setIn(['ApiName'], BizApi.MerchantDetailPageApi.ApiName)
    .setIn(['isRenderRefreshControl'], false)
    .setIn(['isRenderFooterView'], true)
    .setIn(['AdditionalObj'], {isSelectCouponsForMerchantBt: true})

//     {
//     ...new InitialState().setIn(['ApiName'], BizApi.MerchantDetailPageApi.ApiName)
//         .setIn(['isRenderRefreshControl'], false)
//         .setIn(['isRenderFooterView'], true), ...new MerchantDetailPageInitState()
// };


export default function MerchantDetailPageReducer(state = initialState, action) {
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
        case MerchantDetailPageActions.ChangeIsSelectCouponsForMerchantBt:{
            let temp$dataArray = state.getIn(['$dataArray']);

            if (temp$dataArray) {
                temp$dataArray = temp$dataArray.set(1,{key:'优惠及折扣cell'});
            }

            let _nextState = state
                .setIn(['$dataArray'], temp$dataArray)
                .setIn(['dataSource'], state.dataSource.cloneWithRows(temp$dataArray.toJS()))
                .setIn(['AdditionalObj'], {isSelectCouponsForMerchantBt: action.data});

            return _nextState;
        }
        break;
    }

    /**
     * ## Default
     */
    return state;
}