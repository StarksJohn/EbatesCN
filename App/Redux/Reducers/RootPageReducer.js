/**
 * 跨平台 根页面的 reducer
 */

import * as TYPES from '../Actions/RootPageAction';
import {AllContainers} from '../Container/AllPageContainers';


const initialState = {
  tab:  AllContainers[TYPES.arrBottomTabInfo[0]].tabBarName//
};

/**
 * 跨平台 根组件需要的state
 * @param state
 * @param action
 * @returns {*}
 */
export default function RootPageReducer(state=initialState, action) {
  switch (action.type) {
    case TYPES.Switch_bottomTab:
      return {
        ...state,
        tab: action.tab,
      };
    default:
      return state;
  }
}
