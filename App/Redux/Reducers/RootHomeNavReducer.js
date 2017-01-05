/**
 * Created by Ebates on 16/12/27.
 * 跟组件的 主页 一级页面的 根nav的 Reducer
 */
import InitialState from '../InitialState/RootHomeNavigatorInitialState'
const initialState = new InitialState();

export default function RootHomeNavReducer (state = initialState, action){
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    // switch (action.type){
    //     case RootComponentActions.changeNavAction:{
    //         let nextState = state
    //             .setIn(['curNav'], action.newNav);
    //         return nextState
    //     }
    //     break;
    // }

    /**
     * ## Default
     */
    return state;
}