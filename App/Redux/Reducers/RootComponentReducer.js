/**
 * Created by Ebates on 16/12/27.
 */
import InitialState from '../InitialState/RootComponentInitialState'
const initialState = new InitialState();

export default function RootComponentReducer (state = initialState, action){
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    // switch (action.type){
    //     case RegisterRelevantActions.registerPageInitState:{
    //         let nextState = initialState;
    //         return nextState
    //     }
    //     break;
    // }

    /**
     * ## Default
     */
    return state;
}