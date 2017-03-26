/**
 * Created by Ebates on 17/2/27.
 * AllMerchantPageGridViewReducer 全部商家页 筛选控件menu的 reducer
 */
import *as BizApi from '../../NetWork/API/BizApi'
import *as BaseGridViewActions from '../Actions/BaseGridViewActions'


// import InitialState from '../InitialState/AllMerchantPageInitialState'
import InitialState from '../InitialState/BaseGridViewInitialState'

const initialState = new InitialState()
    .setIn(['ApiName'], BizApi.AllMerchantPageApi.ApiName);


export default function AllMerchantPageGridViewReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseGridViewActions.ChangeBaseGridViewStatesAction:
        {
            let nextState = state
                .setIn(['state'], action.newState)
                .setIn(['dataArray'], action.dataArr);

            return nextState
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}
