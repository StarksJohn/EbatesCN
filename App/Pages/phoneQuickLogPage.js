/**
 * Created by Ebates on 16/12/21.
 * 手机号快速登陆页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/BackAndroidEventListener'
import GlobalStyles from '../Global/GlobalStyles'

export default class LogRegisterPage extends Component{
    constructor(props) {
        super(props);
        // this.backAndroidEventListener = new BackAndroidEventListener({...props, backPress: (e)=>this.onBackPress()});
        this.phone = '';
        this.oauthCode = '';//验证码
    }

    componentDidMount() {

        // this.backAndroidEventListener.addEventListener();

    }

    componentWillUnmount() {
        // this.backAndroidEventListener.removeEventListener();
    }

    render(){
        const { navigator} = this.props;
        var statusBar = GlobalStyles.twoLevelPageStatusBarProps;
        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton(()=>this.onBackPress())}
                rightButton={NavBarButton.newUserRegister(()=>this.gotoRegisterPage())}
                title='登录'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black, fontSize:17}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;
    }
}
