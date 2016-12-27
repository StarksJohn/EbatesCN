import {combineReducers} from 'redux';
import RootPageReducer from './RootPageReducer';
import HomePageReducer from './HomePageReducer'
import quickLogReducer from './QuickLogReducer'
import RegisterReducer from './RegisterReducer'

export default combineReducers({
    RootPageReducer,HomePageReducer,quickLogReducer,RegisterReducer
});
