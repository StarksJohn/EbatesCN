/**
 * Created by Ebates on 17/2/27.
 * AllMerchantPageFilterListShipsGridViewReducer 全部商家页 筛选控件menu的 reducer
 */
import *as BizApi from '../../NetWork/API/BizApi'
import *as BaseGridViewActions from '../Actions/BaseGridViewActions'
import Colors from '../../Utils/Colors'


// import InitialState from '../InitialState/AllMerchantPageInitialState'
import InitialState from '../InitialState/BaseGridViewInitialState'

const initialState = new InitialState()
    .setIn(['ApiName'], BizApi.AllMerchantPageFilterDropDownListApi.shipsApiName)
    // .setIn(['unSelectBorderColor'], 'rgba(210, 210, 210, 1)')
    // .setIn(['selectBorderColor'], Colors.appUnifiedBackColor)
    // .setIn(['curBorderColor'], 'rgba(210, 210, 210, 1)');


export default function AllMerchantPageFilterListShipsGridViewReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseGridViewActions.ChangeBaseGridViewStatesAction: {
            let nextState = state
                .setIn(['state'], action.newState)
                .setIn(['dataArray'], action.dataArr);

            return nextState
        }
            break;
        case BaseGridViewActions.ChangeBaseGridViewItemborderColorAction: {
            let nextState = state
                .setIn(['curBorderColor'], action.newBorderColor);

            return nextState
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}
