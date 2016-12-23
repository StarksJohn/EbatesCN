/**
 * Created by Ebates on 16/12/22.
 */
import InitialState from '../InitialState/QuickLogInitialState'

const initialState = new InitialState();

export default function quickLogReducer (state = initialState, action){
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }


    /**
     * ## Default
     */
    return state
}