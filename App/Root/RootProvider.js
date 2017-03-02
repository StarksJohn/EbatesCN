import React, {Component, Alert} from 'react';
import {Provider} from 'react-redux';
import GlobalVar from '../Global/GlobalVar'
import configureStore from '../Redux/Store';
import SplashPage from '../Pages/SplashPage';
import RootComponent from './RootComponent'


const store = configureStore();//唯一的State树

/**
 * 包装 根 组件  ,用于 redux
 */
class RootProvider extends Component {

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
                    <RootComponent />

                </Provider>
            );
        }
    }

}


export default RootProvider;
