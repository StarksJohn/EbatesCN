/**
 * Created by Ebates on 17/3/14.
 * CouponDetailPageModalReducer.js
 * 优惠详情页 弹出层 的 reducer
 */
const {Record, fromJS,} = require('immutable') //导入  Immutable.js 的 Record API

import InitialState from '../InitialState/BaseModalInitialState'
import *as CouponDetailPageApi from '../../NetWork/API/CouponDetailPageApi'
import *as BaseModalActions from '../Actions/BaseModalActions'

const initialState = new InitialState()
    .setIn(['ApiName'], CouponDetailPageApi.CouponDetailPageModalApi.ApiName);


export default function CouponDetailPageModalReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseModalActions.changeModelContainerVisiable: {

            let _nextState = state
                .setIn(['isModalContainerVisible'], action.isVisiable);
                // .setIn(['isModelVisible'], action.isVisiable?true:false);

            // if (action.isVisiable){//modal 父节点 显示的话, modal 也显示
            //  _nextState = state
            //         .setIn(['isModelVisible'], true);
            // }

            return _nextState;
        }
            break;
        case BaseModalActions.changeModalVisiable: {

            let _nextState  = state
                .setIn(['isModelVisible'], action.isVisiable);

            return _nextState;
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}