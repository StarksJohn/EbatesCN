import {combineReducers} from 'redux';
import RootPageReducer from './RootPageReducer';
import HomePageReducer from './HomePageReducer'
import quickLogReducer from './QuickLogReducer'

export default combineReducers({
    RootPageReducer,HomePageReducer,quickLogReducer
});
