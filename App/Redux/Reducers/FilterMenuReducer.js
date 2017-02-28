/**
 * Created by Ebates on 17/2/27.
 * FilterMenuReducer 全部商家页 筛选控件menu的 reducer
 */
import InitialState from '../InitialState/FilterMenuInitialState'
const initialState = new InitialState();

export default function FilterMenuReducer(state = initialState, action) {
    // if (state.ApiName && state.ApiName != action.ApiName) {
    //     return state;
    // }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    // switch (action.type) {
    //     case ForgetPassPageActions.ForgetPassPageInitStateActions: {
    //         let nextState = initialState
    //         //.setIn(['goOnBtState'], ForgetPassPageActions.goOnBtStates.unable);
    //         return nextState
    //     }
    //         break;
    //     case ForgetPassPageActions.changeGoOnBtStates: {
    //         let nextState = state
    //             .setIn(['goOnBtState'], action.newState);
    //         return nextState
    //     }
    //         break;
    //     case ImgOauthCodeActions.changeOauthCodeImg: {
    //         let nextState = state
    //             .setIn(['oauthCodeImgUri'], action.uri);
    //         return nextState
    //     }
    //         break;
    // }

    /**
     * ## Default
     */
    return state;
}
