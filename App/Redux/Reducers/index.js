import {combineReducers} from 'redux';
import RootPageReducer from './RootPageReducer';
import HomePageReducer from './HomePageReducer'
import quickLogReducer from './QuickLogReducer'
import RegisterReducer from './RegisterReducer'
import LogInReducer from './LogInReducer'
import RootComponentReducer from './RootComponentReducer'
import RootHomeNavReducer from './RootHomeNavReducer'
import RootRecommendFriendNavReducer from './RootRecommendFriendNavReducer'

export default combineReducers({
    RootPageReducer,HomePageReducer,quickLogReducer,RegisterReducer,LogInReducer,RootComponentReducer,RootHomeNavReducer,RootRecommendFriendNavReducer
});
