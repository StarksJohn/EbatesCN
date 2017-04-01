/**
 * Created by Ebates on 17/2/27.
 * AllCouponPageGridViewReducer 全部优惠 页 筛选控件menu的 reducer
 */
import *as BizApi from '../../NetWork/API/BizApi'
import *as BaseGridViewActions from '../Actions/BaseGridViewActions'


import InitialState from '../InitialState/BaseGridViewInitialState'

const initialState = new InitialState()
    .setIn(['ApiName'], BizApi.AllCouponPageApi.ApiName);


export default function AllCouponPageGridViewReducer(state = initialState, action) {
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
