/**
 注册 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Image} from 'react-native';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/BackAndroidEventListener'
// import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import BaseTitleBt from '../Comp/Base/BaseTitleBt'
import {baseSpeLine} from '../Comp/Base/BaseSpeLine'
import *as OauthForm from '../Utils/LogRegisterUtils/OauthForm'
import GlobalStyles from '../Global/GlobalStyles'
import phoneQuickLogPage from './phoneQuickLogPage'
import BizLogBt from '../Comp/BizCommonComp/BizLogBt'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import LogPage from './LogPage'

/**
 *  展示组件
 */
export default class RegisterPage extends Component {

    constructor(props) {
        super(props);
        this.backAndroidEventListener = new BackAndroidEventListener({
            ...props,
            backPress: /*(e)=>this.onBackPress()*/ (e)=>baseOnBackPress(this.props.navigator)
        });
        this.email = '';
        this.password = '';
        this.inviteCode = '';//邀请码
    }

    componentDidMount() {

        this.backAndroidEventListener.addEventListener();

    }

    componentWillUnmount() {
        this.backAndroidEventListener.removeEventListener();
    }

    //进 登录 页
    gotoLogPage() {
        showToast('gotoLogPage');
        this.props.navigator.push({
            component: LogPage
        });
    }

    updateEmail(text) {
        this.email = text;
        Log.log('this.email==' + this.email);
    }

    updatePassword(text) {
        this.password = text;
        Log.log('this.email==' + this.password);
    }

    updateInviteCode(text) {
        this.inviteCode = text;
        Log.log('this.inviteCode==' + this.inviteCode);
    }

    //输入框失去焦点时回调
    onBlur() {
        Log.log('onBlur this.email==' + this.email);
        Log.log('onBlur this.password==' + this.password);

    }

    onRegisterPress() {
        if (!OauthForm.oauthEmail(this.email)) {
            showToast('邮箱地址不正确');
            return;
        }
        if (!OauthForm.oauthPass(this.password)) {
            showToast('密码至少6位字符或数字');
            return;
        }

        showToast('onRegisterPress ok ');

    }

    /*邮箱输入框的容器view*/
    emailInputView() {
        return (
            <View style={[GlobalStyles.InputItemContainer,{marginTop: 40}]}>
                <View style={GlobalStyles.IpputItemLeftView}>
                    <Text style={styles.IpputItemLeftText}>邮箱</Text>
                </View>
                <View style={GlobalStyles.InputItemRightView}>
                    <TextInput
                        style={GlobalStyles.textInput}
                        autoFocus={false}
                        placeholder='输入邮箱地址'
                        onChange={(event) => this.updateEmail(
                            event.nativeEvent.text
                        )}
                        onBlur={() => this.onBlur()}
                        underlineColorAndroid={'transparent'}
                    />
                </View>

            </View>
        );
    }

    /*密码输入框的容器view*/
    passInputView() {
        return (
            <View style={[GlobalStyles.InputItemContainer]}>
                <View style={GlobalStyles.IpputItemLeftView}>
                    <Text style={styles.IpputItemLeftText}>密码</Text>
                </View>
                <View style={GlobalStyles.InputItemRightView}>
                    <TextInput
                        style={GlobalStyles.textInput}
                        placeholder='输入至少6位字符或数字'
                        onChange={(event) => this.updatePassword(
                            event.nativeEvent.text
                        )}
                        onBlur={() => this.onBlur()}
                        underlineColorAndroid={Colors.transparent}
                    />
                </View>
            </View>
        );
    }

    //邀请码输入view
    InviteCodeInputView() {
        return (
            <View style={[GlobalStyles.InputItemContainer]}>
                <View style={[GlobalStyles.IpputItemLeftView,{paddingRight:16}]}>
                    <Text style={styles.IpputItemLeftText}>邀请码</Text>
                </View>
                <View style={GlobalStyles.InputItemRightView}>
                    <TextInput
                        style={GlobalStyles.textInput}
                        placeholder='输入好友邀请码 (选填)'
                        onChange={(event) => this.updateInviteCode(
                            event.nativeEvent.text
                        )}
                        onBlur={() => this.onBlur()}
                        underlineColorAndroid={Colors.transparent}
                    />
                </View>
            </View>
        );
    }

    // 点服务条款
    onPressServiceProvision() {
        showToast('onPressServiceProvision')//https://www.ebates.cn/help/terms
    }

    render() {
        const {navigator} = this.props;

        var statusBar = GlobalStyles.twoLevelPageStatusBarProps;

        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton( ()=>baseOnBackPress(navigator) )}
                rightButton={NavBarButton.newUserRegister(()=>this.gotoLogPage(),{title:'已有账号,去登录'})}
                title='注册'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black, fontSize: 17}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;
        let str = '注册即同意  ';

        return (
            <View style={styles.container}>
                {navigationBar}
                {BizViews.ebatesViews()}
                {/*邮箱输入框的容器view*/}
                {this.emailInputView()}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                {this.passInputView()}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                {this.InviteCodeInputView()}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                <View style={{
                    height: 40,
                    paddingLeft: 55,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    <Text style={{
                        color: 'rgba(85, 85, 85, 1)',
                        fontSize: 13,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {str}
                    </Text>
                    <Text style={{
                        color: 'rgba(54, 166, 66, 1)',
                        fontSize: 12,
                        //backgroundColor: Colors.getRandomColor()
                    }}
                          onPress={
                              ()=>this.onPressServiceProvision()
                          }
                    >
                        Ebates.cn服务条款
                    </Text>
                </View>
                {BizLogBt(()=>this.onRegisterPress(), {backgroundColor:Colors.appUnifiedBackColor,disabled:false,title:'免费注册赠$5'})}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    //输入框左图里的text
    IpputItemLeftText: {},


});

