/**
 * Created by Ebates on 16/12/22.
 */
import InitialState from '../InitialState/QuickLogInitialState'
import *as quickLogAction from '../Actions/QuickLogAction'

const initialState = new InitialState();

export default function quickLogReducer (state = initialState, action){
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type){
        case  quickLogAction.oauthCodeBtState.enable:
        {
            let nextState = state
                .setIn(['oauthCodeBtState'], quickLogAction.oauthCodeBtState.enable)
            return nextState
        }
        break;

        case  quickLogAction.oauthCodeBtState.unable:
        {
            let nextState = state
                .setIn(['oauthCodeBtState'], quickLogAction.oauthCodeBtState.unable)
            return nextState
        }
            break;
    }
        /**
     * ## Default
     */
    return state
}