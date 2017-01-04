/**
 * Created by Ebates on 16/12/27.
 */
import InitialState from '../InitialState/RootComponentInitialState'
const initialState = new InitialState();
import *as RootComponentActions from '../../Redux/Actions/RootComponentActions'

export default function RootComponentReducer (state = initialState, action){
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type){
        case RootComponentActions.changeNavAction:{
            let nextState = state
                .setIn(['curNav'], action.newNav);
            return nextState
        }
        break;
    }

    /**
     * ## Default
     */
    return state;
}