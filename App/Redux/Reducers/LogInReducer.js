/**
 * Created by Ebates on 16/12/28.
 */
import InitialState from '../InitialState/LogInInitialState'
import *as LogInActions from '../Actions/LogInActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as ImgOauthCodeActions from '../Actions/ImgOauthCodeActions'

const initialState = new InitialState()
    .setIn(['ApiName'], BizApi.LogInApi.ApiName);


export default function LogInReducer (state = initialState, action){
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type){
        case LogInActions.showImgOauthInput:
        {
            let nextState = state
                .setIn(['isShowImgOauthInput'], true);
            return nextState
        }
            break;
        case LogInActions.hideImgOauthInput:
        {
            let nextState = state
                .setIn(['isShowImgOauthInput'], false);
            return nextState
        }
            break;
        case ImgOauthCodeActions.changeOauthCodeImg:
        {
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