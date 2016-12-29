/**
 * Created by Ebates on 16/12/27.
 */
import InitialState from '../InitialState/RegisterInitialState'
import *as RegisterRelevantActions from '../Actions/RegisterRelevantActions'
const initialState = new InitialState();

export default function RegisterReducer (state = initialState, action){
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type){
        case RegisterRelevantActions.registerPageInitState:{
            let nextState = initialState;
            return nextState
        }
        break;
        case RegisterRelevantActions.changeRegisterBtStates:
        {
            let nextState = state
            .setIn(['registerBtState'], action.newState);
            return nextState
        }
        break;
        case RegisterRelevantActions.showRegisterSucessbt:
        {
            let nextState = state
                .setIn(['isShowRegisterSucessbt'], true);
            return nextState
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}