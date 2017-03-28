/**
 * Created by Ebates on 16/12/27.
 * BizDropDownMenuAndListReducer
 * 通用的 包含 Menu和 下拉列表 控件 的 reducer
 */
import {
    ListView,
} from 'react-native';
const {List, fromJS} = require('immutable') //导入  Immutable.js 的 Record API

import InitialState,{defaultH} from '../InitialState/BizDropDownMenuAndListInit'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BizDropDownMenuAndListActions from '../Actions/BizDropDownMenuAndListActions'


const initialState = new InitialState()/*通用列表的初始UI状态*/
/*搜索结果页 优惠 列表的 特殊状态*/
    .setIn(['ApiName'], BizApi.BizDropDownMenuAndListApi.ApiName)

export default function BizDropDownMenuAndListReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BizDropDownMenuAndListActions.changeDropDownListH:
        {
            let _nextState = state
                .setIn(['DropDownListHeight'], action.H)

            return _nextState;
        }
        break;
        case BizDropDownMenuAndListActions.resetDropDownListH:
        {
            let _nextState = state
                .setIn(['DropDownListHeight'],defaultH)

            return _nextState;
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}