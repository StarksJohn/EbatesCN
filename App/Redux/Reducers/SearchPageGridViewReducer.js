/**
 * Created by Ebates on 17/3/9.
 * SearchPageGridViewReducer
 */
import InitialState from '../InitialState/BaseGridViewInitialState'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BaseGridViewActions from '../../Redux/Actions/BaseGridViewActions'

const initialState = new InitialState()
    .setIn(['ApiName'], BizApi.SearchPageListApi.ApiName);

export default function SearchPageGridViewReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseGridViewActions.ChangeBaseGridViewStatesAction:
        {
            let nextState = state
                .setIn(['state'], action.newState)
                .setIn(['dataArray'], action.dataArr);

            return nextState
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}