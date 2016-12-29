/**
 注册 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Image, Platform} from 'react-native';
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
import LogInPage from './LogInPage'
import *as RegisterRelevantActions from '../Redux/Actions/RegisterRelevantActions'
import {connect} from 'react-redux'
import WebViewPage from './WebViewPage'
import BaseBlackTranslucentCoverView from '../Comp/Base/BaseBlackTranslucentCoverView'
import BizRegigsterSucessBt from '../Comp/BizCommonComp/BizRegigsterSucessBt'
import SMSTimer from '../Utils/SMSTimer'
import *as RootNavigator from '../Root/RootNavigator'

/**
 *  展示组件
 */
export class RegisterPage extends Component {

    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e)=> baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: 'RegisterPage'
            });
        }
        this.email = '';
        this.password = '';
        this.inviteCode = '';//邀请码

        this.props.dispatch(RegisterRelevantActions.registerPageInitStateActions());
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        // Log.log('componentWillUnmount');
    }

    //进 登录 页
    gotoLogPage() {

        if (RootNavigator.routeNumsFromCurrentRoutes(this.props.navigator,global.gRouteName.LogInPage)==1){
            this.props.navigator.pop();
        }else{
            this.props.navigator.push({
                component: LogInPage,
                name:gRouteName.LogInPage//'

            });
        }

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

    /**
     * 自动页面跳转回 注册登录页面之前的 页面
     */
    pageGotoAfterRegisterSucess() {
        RootNavigator.popToDesignatedPage(this.props.navigator,global.gRouteName.RootPagesContainer);
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

        this.props.dispatch(RegisterRelevantActions.showRegisterSucessbtAction());

        this.timer = new SMSTimer({
            timerNums: 5,
            callBack: (time)=> {
                Log.log('time===' + time);
                if (time == -1) {
                    this.pageGotoAfterRegisterSucess();
                }
            }
        }).start();
    }

    /*邮箱输入框的容器view*/
    emailInputView() {
        return (
            <View style={[GlobalStyles.InputItemContainer, {marginTop: 40}]}>
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
                <View style={[GlobalStyles.IpputItemLeftView, {paddingRight: 16}]}>
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
        this.props.navigator.push({
            component: WebViewPage,
            title: '服务条款',
            url: 'https://www.ebates.cn/help/terms',
            name: 'WebViewPage',
        });
    }

    stopTimer() {
        this.timer&&this.timer.deallocInterval();
    }

    //话 注册成功蒙层 和 按钮
    renderRegisterSucessbt() {
        return (
            <BaseBlackTranslucentCoverView
                visible={this.props.RegisterReducer.isShowRegisterSucessbt}
                cancel={()=> {

                }}
                {...this.props}>
                {BizRegigsterSucessBt(//主动点 按钮
                    ()=> {
                        this.stopTimer();
                        this.pageGotoAfterRegisterSucess()
                    }
                )}
            </BaseBlackTranslucentCoverView>
        )
    }

    render() {
        const {navigator, dispath} = this.props;

        var statusBar = GlobalStyles.twoLevelPageStatusBarProps;

        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton(()=>baseOnBackPress(navigator, this.backAndroidEventListener))}
                rightButton={NavBarButton.newUserRegister(()=>this.gotoLogPage(), {title: '已有账号,去登录'})}
                title='注册'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black, fontSize: 17}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;
        let str = '注册即同意  ';

        return (
            <View style={styles.container}>
                <View style={{}}>
                    {navigationBar}
                    {BizViews.ebatesViews()}
                    {/*邮箱输入框的容器view*/}
                    {this.emailInputView()}
                    {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                    {this.passInputView()}
                    {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                    {this.InviteCodeInputView()}
                    {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                    {/*服务条款容器view*/}
                    <View style={{
                        height: 65,
                        //paddingLeft: 55,
                        flexDirection: 'row',
                        //justifyContent: 'flex-start',
                        alignItems: 'center',
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {BizViews.checkBox((isSelect)=> {
                            Log.log('isSelect===' + isSelect);
                            this.props.dispatch(RegisterRelevantActions.changeRegisterBtStatesActions(isSelect))
                        })}
                        <Text style={{
                            color: 'rgba(85, 85, 85, 1)',
                            fontSize: 12, marginLeft: 10
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
                    {BizLogBt(()=>this.onRegisterPress(), {
                        backgroundColor: this.props.RegisterReducer.registerBtState.backColor,
                        disabled: this.props.RegisterReducer.registerBtState.disabled,
                        title: '免费注册赠$5',
                        btStyle: {marginTop: 0}
                    })}
                </View>
                {this.renderRegisterSucessbt()}


            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    //输入框左图里的text
    IpputItemLeftText: {},


});

function mapStateToProps(state) {

    // 把 state里的 homePageReducer 注入到 this.props里
    const {RegisterReducer}=state;
    return {RegisterReducer};
}

export default connect(mapStateToProps)(RegisterPage)

