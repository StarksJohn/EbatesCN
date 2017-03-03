/**
 * Created by Ebates on 16/12/27.
 */
import InitialState from '../InitialState/RegisterInitialState'
import *as RegisterRelevantActions from '../Actions/RegisterRelevantActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as ImgOauthCodeActions from '../Actions/ImgOauthCodeActions'


const initialState = new InitialState()
.setIn(['ApiName'], BizApi.RegisterPageApi.ApiName);


export default function RegisterReducer (state = initialState, action){
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

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
        case ImgOauthCodeActions.changeOauthCodeImg:
        {
            let nextState = state
                .setIn(['oauthCodeImgUri'], action.uri)
                // .setIn(['randomParaForRerenderImgOauthCode'], action.randomParaForRerenderImgOauthCode);
            return nextState
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}