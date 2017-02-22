/**
 * Created by Ebates on 16/12/27.
 * ForgetPassPageReducer
 */
import InitialState from '../InitialState/ForgetPassPageInitialState'
import *as ForgetPassPageActions from '../Actions/ForgetPassPageActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as ImgOauthCodeActions from '../Actions/ImgOauthCodeActions'


const initialState = new InitialState()
    .setIn(['ApiName'], BizApi.ForgetPassPageApi.ApiName);


export default function ForgetPassPageReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case ForgetPassPageActions.ForgetPassPageInitStateActions: {
            let nextState = initialState
                //.setIn(['goOnBtState'], ForgetPassPageActions.goOnBtStates.unable);
            return nextState
        }
            break;
        case ForgetPassPageActions.changeGoOnBtStates: {
            let nextState = state
                .setIn(['goOnBtState'], action.newState);
            return nextState
        }
            break;
        case ImgOauthCodeActions.changeOauthCodeImg: {
            let nextState = state
                .setIn(['oauthCodeImgUri'], action.uri);
            return nextState
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}