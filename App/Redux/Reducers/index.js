import {combineReducers} from 'redux';
import RootPageReducer from './RootPageReducer';
import HomePageReducer from './HomePageReducer'
import LogRegisterPageReducer from './LogRegisterPageReducer'

export default combineReducers({
    RootPageReducer,HomePageReducer,LogRegisterPageReducer
});
