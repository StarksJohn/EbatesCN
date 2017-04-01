/**
 注册 页 RegisterPage
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Image, Platform} from 'react-native';
import {connect} from 'react-redux'
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
// import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import BaseTitleBt from '../Comp/Base/BaseTitleBt'
import {baseSpeLine} from '../Comp/Base/BaseSpeLine'
import *as OauthForm from '../Utils/LogRegisterUtils/OauthForm'
import GlobalStyles from '../Global/GlobalStyles'
import phoneQuickLogPage from './phoneQuickLogPage'
import BizLogBt from '../Comp/BizCommonComp/BizLogBt'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import *as RegisterRelevantActions from '../Redux/Actions/RegisterRelevantActions'
import WebViewPage from './WebViewPage'
import BaseBlackTranslucentCoverView from '../Comp/Base/BaseBlackTranslucentCoverView'
import BizRegigsterSucessBt from '../Comp/BizCommonComp/BizRegigsterSucessBt'
import SMSTimer from '../Utils/SMSTimer'
import *as RootNavigator from '../Root/RootNavigator'
import *as BizInputViews from '../Comp/BizCommonComp/BizInputViews'
import *as ImgOauthCodeAPI from '../NetWork/API/ImgOauthCodeAPI'
import *as BizApi from '../NetWork/API/BizApi'
import *as ImgOauthCodeActions from '../Redux/Actions/ImgOauthCodeActions'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import *as Math from '../Utils/Math'
import *as BizLoadingView from '../Comp/BizCommonComp/BizLoadingView'
import *as RequestUtil from '../NetWork/RequestUtil'

/**
 *  展示组件
 */
export class RegisterPage extends Component {

    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.RegisterPage
            });
        }
        this.email = '';
        this.password = '';
        this.imgOauthCode = '';//图片验证码
        this.inviteCode = '';//邀请码

        this.props.dispatch(RegisterRelevantActions.registerPageInitStateActions());
        this.getOauthCodeImg();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        Log.log('componentWillUnmount');
    }

    //进 登录 页
    gotoLogPage() {
        if (/*RootNavigator.routeNumsFromCurrentRoutes(this.props.navigator,global.gRouteName.LogInPage)==1*/
            !RootNavigator.popToDesignatedPage(this.props.navigator, global.gRouteName.LogInPage)) {
            // this.props.navigator.pop();
            this.props.navigator.push({
                component: RegisterPage,
                name: gRouteName.RegisterPage//'

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
    // onBlur() {
    //     Log.log('onBlur this.email==' + this.email);
    //     Log.log('onBlur this.password==' + this.password);
    //
    // }

    /**
     * 自动页面跳转回 注册登录页面之前的 页面
     */
    pageGotoAfterRegisterSucess() {
        BizLoadingView.closeBizLoadingView();

        RootNavigator.popToDesignatedPage(this.props.navigator, gPopBackToRouteAfteRegisterOrLoginSuceess);
    }

    onRegisterPress() {
        this.email=this.email.trim();
        this.password=this.password.trim();
        this.imgOauthCode=this.imgOauthCode.trim();
        this.inviteCode=this.inviteCode.trim();

        if (!OauthForm.oauthEmail(this.email)) {
            BizShowToast('邮箱地址不正确');
            return;
        }
        if (!OauthForm.oauthPass(this.password)) {
            BizShowToast('密码至少6位字符或数字');
            return;
        }

        if (!OauthForm.oauthImgCodePass(this.imgOauthCode)) {
            BizShowToast('请输入正确的验证码');
            return;
        }

        //主动隐藏键盘,避免 菊花被键盘盖住
        if (this.emailInputViewRef.isFocused()){
            this.emailInputViewRef.blur();
        }else if (this.passInputViewRef.isFocused()){
            this.passInputViewRef.blur();
        }else if (this.imgOauthCodeInputViewRef.isFocused()){
            this.imgOauthCodeInputViewRef.blur();
        }else if (this.InviteCodeInputViewRef.isFocused()){
            this.InviteCodeInputViewRef.blur();
        }

        BizApi.RegisterPageApi.registerUser({
            email: this.email,
            password: this.password,
            referee: this.inviteCode,
            captcha: this.imgOauthCode,
            captchaUuid: BizApi.ImgOauthCodeAPI.data.captchaUuid
        }).then(
            (responseData) => {
                Log.log('RegisterPage onRegisterPress 注册成功,开始 调登陆接口  responseData=' + Log.writeObjToJson(responseData));

                //注册成功,调登陆接口
                this.logIn();
            }
        ).catch((error) => {
            Log.log('RegisterPage onRegisterPress error=' + Log.writeObjToJson(error));
            if (RequestUtil.parseErrorCode(error) === 15) {//
                BizShowToast('该邮箱地址已被注册');
            }else if (RequestUtil.parseErrorCode(error) === 13) {//验证码输入错误
                BizShowToast('验证码错误');
                this.getOauthCodeImg();

            }
        })
    }

    logIn(){
        BizApi.LogInApi.getAccessToken({identity:this.email,code:this.password}).then(
            (responseData) => {
                Log.log('RegisterPage logIn 登录成功 responseData='+Log.writeObjToJson(responseData));
                gUserDB.login({userID:this.email,password:this.password});

                this.props.dispatch(RegisterRelevantActions.showRegisterSucessbtAction());

                this.timer = new SMSTimer({
                    timerNums: 5,
                    callBack: (time) => {
                        Log.log('time===' + time);
                        if (time == -1) {
                            this.pageGotoAfterRegisterSucess();
                        }
                    }
                }).start();
            }
        ).catch((error) => {
            // BizShowToast(error.error.message);
            Log.log('RegisterPage logIn  error.error='+Log.writeObjToJson(error.error))
        });
    }

    // 点服务条款
    onPressServiceProvision() {
        // showToast('onPressServiceProvision')//https://www.ebates.cn/help/terms
        this.props.navigator.push({
            component: WebViewPage,
            title: '服务条款',
            url: 'https://www.ebates.cn/help/terms',
            name: 'WebViewPage',
        });
    }

    //获取验证码图片 接口
    getOauthCodeImg() {
        this.props.dispatch(ImgOauthCodeActions.changeOauthCodeImgAction('www.baidu.com'/*为了
         让点击图片验证码按钮后立即刷新菊花,随便请求一个url*/,
         BizApi.RegisterPageApi.ApiName));

        BizApi.ImgOauthCodeAPI.requestCaptcha().then(
            (url) => {
                // BizLoadingView.closeBizLoadingView();

                this.props.dispatch(ImgOauthCodeActions.changeOauthCodeImgAction(url, BizApi.RegisterPageApi.ApiName));
            }
        );
    }

    stopTimer() {
        this.timer && this.timer.deallocInterval();
    }

    //话 注册成功蒙层 和 按钮
    renderRegisterSucessbt() {
        return (
            <BaseBlackTranslucentCoverView
                visible={this.props.RegisterReducer.isShowRegisterSucessbt}
                cancel={() => {

                }}
                {...this.props}>
                {BizRegigsterSucessBt(//主动点 按钮
                    () => {
                        this.stopTimer();
                        this.pageGotoAfterRegisterSucess()
                    }
                )}
            </BaseBlackTranslucentCoverView>
        )
    }

    updateImgOauthCode(text) {
        this.imgOauthCode = text;
        Log.log('this.imgOauthCode==' + this.imgOauthCode);
    }

    render() {
        const {navigator, dispath} = this.props;

        var statusBar = GlobalStyles.statusBarDefaultProps;

        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                rightButton={NavBarButton.newUserRegister(() => this.gotoLogPage(), {title: '已有账号,去登录'})}
                title='注册'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black, fontSize: 17}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;
        let str = '注册即同意  ';
        let keyboardAwareScrollView =
            <KeyboardAwareScrollView ref={(r) => {
                this.keyboardAwareScrollViewRef = r;
            }}
                                     keyboardDismissMode="interactive"
                                     keyboardShouldPersistTaps={true}
                                     getTextInputRefs={() => {
                                         return [this.emailInputViewRef, this.passInputViewRef, this.imgOauthCodeInputViewRef, this.InviteCodeInputViewRef];
                                     }}
                                     style={{
                                         //backgroundColor: Colors.getRandomColor()
                                     }}
            >
                {BizViews.ebatesViews()}
                {/*邮箱输入框的容器view*/}
                {BizInputViews.emailInputView({},
                    (event) => this.updateEmail(event.nativeEvent.text),
                    () => {
                        //主动让光标下移
                        this.passInputViewRef.focus();
                        this.keyboardAwareScrollViewRef._scrollToFocusedTextInput();
                    },
                    (r) => {
                        this.emailInputViewRef = r;
                    }, '邮箱', '输入邮箱地址'
                )}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -0.5})}
                {/*密码*/}
                {BizInputViews.passInputView({},
                    (event) => this.updatePassword(event.nativeEvent.text),
                    (r) => {
                        this.passInputViewRef = r;
                    },
                    () => {
                        //主动让光标下移
                        this.imgOauthCodeInputViewRef.focus();
                        this.keyboardAwareScrollViewRef._scrollToFocusedTextInput();
                    }
                )}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -0.5})}
                {/*验证码*/}
                {BizInputViews.imgOauthCodeInputView(
                    {},
                    (event) => this.updateImgOauthCode(event.nativeEvent.text),
                    this.props.RegisterReducer.oauthCodeImgUri,
                    () => this.getOauthCodeImg(),
                    (r) => {
                        this.imgOauthCodeInputViewRef = r;
                    },
                    () => {
                        //主动让光标下移
                        this.InviteCodeInputViewRef.focus();
                        this.keyboardAwareScrollViewRef._scrollToFocusedTextInput();
                    }
                )
                }
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -0.5})}
                {/*邀请码*/}
                {BizInputViews.InviteCodeInputView({},
                    (event) => this.updateInviteCode(event.nativeEvent.text),
                    (r) => {
                        this.InviteCodeInputViewRef = r;
                    }
                )}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -0.5})}
                {/*服务条款容器view*/}
                <View style={{
                    height: 65,
                    //paddingLeft: 55,
                    flexDirection: 'row',
                    //justifyContent: 'flex-start',
                    alignItems: 'center',
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    {BizViews.checkBox((isSelect) => {
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
                              () => this.onPressServiceProvision()
                          }
                    >
                        Ebates.cn服务条款
                    </Text>
                </View>
                {BizLogBt(() => this.onRegisterPress(), {
                    backgroundColor: this.props.RegisterReducer.registerBtState.backColor,
                    disabled: this.props.RegisterReducer.registerBtState.disabled,
                    title: '免费注册赠$5',
                    btStyle: {marginTop: 0, marginBottom: 20}
                })}
            </KeyboardAwareScrollView>;

        return (
            <View style={styles.container}>
                <View style={{}}>
                    {navigationBar}
                    {keyboardAwareScrollView}
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

