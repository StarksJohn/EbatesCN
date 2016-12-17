import * as TYPES from '../Actions/LogRegisterPageActions';

const initialState = {
  selectedTabIndex: 0,
    scrollTbvMenuTitles: []

};

//初始化首页的状态
export default function LogRegisterPageReducer(state=initialState, action) {
  switch (action.type) {
    case TYPES.GET_TITLE_BAR_TAB:
      return {
        ...state,
          scrollTbvMenuTitles: action.menuTitles,
      };
    default:
      return state;
  }
}