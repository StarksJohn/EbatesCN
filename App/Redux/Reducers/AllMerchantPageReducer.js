/**
 * Created by Ebates on 17/2/27.
 * AllMerchantPageReducer 全部商家页  reducer, 管理 删选关键词
 */
import *as BizApi from '../../NetWork/API/BizApi'

import InitialState from '../InitialState/AllMerchantPageInitialState'
import *as AllMerchantPageActions from '../Actions/AllMerchantPageActions'

const initialState = new InitialState()
    .setIn(['ApiName'], BizApi.AllMerchantPageApi.ApiName);


export default function AllMerchantPageReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        // case AllMerchantPageActions.fetchCategoryListSuccess:
        // {
        //     let nextState = state
        //         .setIn(['$CategoryListDataArray'], action.dataArr);
        //
        //     return nextState
        // }
        //     break;
    }

    /**
     * ## Default
     */
    return state;
}
