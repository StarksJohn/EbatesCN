/**
 个人主页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import BizLogBt from '../Comp/BizCommonComp/BizLogBt'
import LogInPage from './LogInPage'

/**
 *  展示组件
 */
class HomePage extends Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     isLogin: false,
        // };
    }

    componentDidMount() {

        const {dispatch} = this.props;
        // dispatch(getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据
    }

    componentWillUnmount() {
    }

    onLogin() {
        gUserDB.isLogin().then(
            (b) => {//已登录
                // this.setState({
                //     isLogin: false
                // });
            },
            (e) => {//非登录状态
                // this.setState({
                //     isLogin: false
                // })

                gPopBackToRouteAfteRegisterOrLoginSuceess = gRouteName.RootPagesContainer;

                this.props.navigator.push({
                    component: LogInPage,
                    name: gRouteName.LogInPage//'

                });
            }
        ).catch((error) => {
            Log.log('TokenAPI getTokenWhenAppOpen error= ' + error);
        });
    }

    render() {
        const {HomePageReducer, navigator} = this.props;

        let navigationBar = BizViews.renderBaseNavigationBar(null, null /*NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))*/, null, null, '我的账户', {});

        return (
            <View style={styles.container}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                <View style={{
                    alignItems: 'center',
                    backgroundColor: Colors.white
                }}>
                    {BizViews.ebatesViews()}
                    {BizLogBt(() => this.onLogin(), {
                        backgroundColor: Colors.appUnifiedBackColor,
                        disabled: false,
                        title: '登录/注册',
                        btStyle: {
                            marginTop: 16, width: 230, height: 44, marginLeft: 0,
                            marginRight: 0, marginBottom: 20
                        }
                    })}
                </View>

            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        backgroundColor: Colors.BizCommonGrayBack,
    },
});

export default HomePage;
