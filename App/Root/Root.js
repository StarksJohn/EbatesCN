import React, {Component, Alert} from 'react';
import {Provider} from 'react-redux';
import configureStore from '../Redux/Store';
import SplashPage from '../Pages/SplashPage';
import RootNavigator from './RootNavigator';
// import MainPageContainer from '../containers/MainPageContainer';//根据平台自动加载 MainPageContainer.ios.js 或
// MainPageContainer.android.js
// import {DEBUG, RDEBUG} from '../constants/GlobalConst';
// import Storage from '../db/CommonDB/Storage'
import GlobalVar from '../Global/GlobalVar'

const store = configureStore();//唯一的State树

/**
 * 包装 根 组件 RootPage ,用于 redux
 */
class Root extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isShowSplash: true,
        };
    }


    render() {
        if (this.state.isShowSplash) {
            return <SplashPage onAnimEnd={() => this.setState({isShowSplash: false})}/>;
        } else {
            return (
                //Provider: 把store和视图绑定在了一起,包装根组件
                <Provider store={store}>
                    <RootNavigator />
                </Provider>
            );
        }
    }

}


export default Root;
