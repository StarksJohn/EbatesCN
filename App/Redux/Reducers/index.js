import {combineReducers} from 'redux';
// import mainPageReducerIOS from './mainPageReducer.ios';
// import mainPageReducerAndroid from './mainPageReducer.android';
import RootPageReducer from './RootPageReducer';
import HomePageReducer from './HomePageReducer'

export default combineReducers({
    // mainPageReducerIOS,
    // mainPageReducerAndroid,
    RootPageReducer,HomePageReducer
});
