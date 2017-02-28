/**
 * Created by Ebates on 17/2/22.
 * ForgetPassEmailOkPage
 * 忘记密码邮件发送成功  页面
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Platform,Image} from 'react-native';
import {connect} from 'react-redux'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import RegisterPage from './RegisterPage'

export default class ForgetPassEmailOkPage extends Component {
    constructor(props) {
        super(props);

        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.SearchResultPage
            });
        }

    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    onRegisterBt() {
        this.props.navigator.push({
            component: RegisterPage,
            name: gRouteName.RegisterPage,
        });
    }

    render() {
        const {navigator} = this.props;

        let navigationBar = BizViews.renderBaseNavigationBar(null, NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener,gRouteName.LogInPage)), null, null, '重置您的密码', {
            color: Colors.BizCommonBlack,
            fontSize: 17
        });

        let str='请到'+this.props.route.email+'查阅找回密码邮件,从邮件重设您的密码';

        return (
            <View style={{flex: 1, backgroundColor: Colors.BizCommonGrayBack,}}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                <Image source={require('../Img/common_bkg_mail.png')} style={{marginTop: 60, alignSelf:'center'}}/>
                <Text style={{
                    marginTop: 21, fontSize: 15, color: Colors.BizCommonBlack,alignSelf:'center',
                    //backgroundColor:Colors.getRandomColor()
                }}>邮件已发送成功!</Text>
                <Text style={{
                    marginTop: 13, fontSize: 12, color: '#888888',alignSelf:'center', width:GlobalStyles.window.width-100,textAlign:'center',
                    lineHeight:14,
                    //backgroundColor:Colors.getRandomColor()
                }}>{str}</Text>
                <Text style={{
                    marginTop: 20, fontSize: 12, color: '#555555',alignSelf:'center',textAlign:'center',
                    //lineHeight:14,
                    //backgroundColor:Colors.getRandomColor()
                }}>还没有Ebates.cn账号?
                    <Text style={{
                         color: '#36A642',
                        //backgroundColor:Colors.getRandomColor()
                    }}
                          onPress={ () => this.onRegisterBt()}
                    > 立即注册
                    </Text>
                </Text>
            </View>
        );
    }

}

