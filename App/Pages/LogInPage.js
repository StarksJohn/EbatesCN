/**
 登录 页
 LogInPage
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
import RegisterPage from './RegisterPage'
import *as LogInActions from '../Redux/Actions/LogInActions'
import *as RootNavigator from '../Root/RootNavigator'
import *as BizInputViews from '../Comp/BizCommonComp/BizInputViews'
import *as ImgOauthCodeAPI from '../NetWork/API/ImgOauthCodeAPI'
import ForgetPassPage from './ForgetPassPage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import *as BizApi from '../NetWork/API/BizApi'
import *as ImgOauthCodeActions from '../Redux/Actions/ImgOauthCodeActions'
import *as BizLoadingView from '../Comp/BizCommonComp/BizLoadingView'
import *as RequestUtil from '../NetWork/RequestUtil'

/**
 *  展示组件
 */
export class LogInPage extends Component {

    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.LogInPage
            });
        }

        this.email = '';//也可输入 手机号
        this.password = '';
        this.imgOauthCode = '';//图片验证码
        this.props.dispatch(LogInActions.hideImgOauthInputAction());
        this.passErrorCount = 0;//服务器返回的密码错误次数
    }

    componentDidMount() {

        // this.backAndroidEventListener.addEventListener();

    }

    componentWillUnmount() {
        // super.componentWillUnmount();
        // this.backAndroidEventListener.removeEventListener();
    }

    /*
     左上角点击
     */
    // onBackPress() {
    //     this.props.navigator.pop();//app 页面回退
    //     return true;//作用: 避免安卓点Home键, 完全退出
    // }

    //进 注册页
    gotoRegisterPage() {

        if (!RootNavigator.popToDesignatedPage(this.props.navigator, global.gRouteName.RegisterPage)) {
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

    // onSubmit() {
    //     Log.log('LogInPage onSubmit');
    // }

    updatePassword(text) {
        this.password = text;
        Log.log('this.email==' + this.password);
    }

    updateImgOauthCode(text) {
        this.imgOauthCode = text;
        Log.log('this.imgOauthCode==' + this.imgOauthCode);
    }

    //输入框失去焦点时回调
    // onBlur() {
    //     Log.log('onBlur this.email==' + this.email);
    //     Log.log('onBlur this.password==' + this.password);
    //
    // }

    onLoginPress() {
        // if (!OauthForm.oauthEmail(this.email)) {
        //     BizShowToast('邮箱地址不正确');
        //     return;
        // }

        // BizLoadingView.showBizLoadingView('加载中....');
        // BizLoadingView.closeBizLoadingView();

        this.email = this.email.trim();
        this.password = this.password.trim();
        this.imgOauthCode = this.imgOauthCode.trim();

        if (!OauthForm.oauthPass(this.password)) {
            BizShowToast('密码至少6位字符或数字');
            return;
        }

        if ((this.props.LogInReducer.isShowImgOauthInput && !OauthForm.oauthImgCodePass(this.imgOauthCode))) {
            BizShowToast('请输入正确的验证码');
            return;
        }

        //主动隐藏键盘,避免 菊花被键盘盖住
        if (this.emailInputViewRef.isFocused()) {
            this.emailInputViewRef.blur();
        } else if (this.passInputViewRef.isFocused()) {
            this.passInputViewRef.blur();
        }

        BizApi.LogInApi.getAccessToken({identity: this.email, code: this.password,captchaUuid:BizApi.ImgOauthCodeAPI.data.captchaUuid,captcha:this.imgOauthCode}).then(
            (responseData) => {
                // Log.log('LogInPage onLoginPress responseData='+responseData);
                gUserDB.login({userID: this.email, password: this.password});
                RootNavigator.popToDesignatedPage(this.props.navigator, gPopBackToRouteAfteRegisterOrLoginSuceess);



            }
        ).catch((error) => {
            // BizShowToast(error.error.message);
            Log.log('LogInPage onLoginPress  error.error=' + Log.writeObjToJson(error.error))

            //服务器返回3次密码输入错误
            if (RequestUtil.parseErrorCode(error) === 11 || RequestUtil.parseErrorCode(error)=== 12||RequestUtil.parseErrorCode(error) === 13) {
                this.props.dispatch(LogInActions.showImgOauthInputAction());

                if (RequestUtil.parseErrorCode(error) === 11){//密码错误,请输入验证码
                    BizShowToast('密码错误,请输入验证码');
                }
               else if (RequestUtil.parseErrorCode(error)=== 12) {//验证码没输入,提示输入验证码
                    BizShowToast('请输入验证码');
                }
                else if (RequestUtil.parseErrorCode(error) === 13) {//验证码输入错误
                    BizShowToast('验证码错误');
                }

                this.getOauthCodeImg();
            } else if (RequestUtil.parseErrorCode(error) === 6) {//密码错误
                BizShowToast('密码输入错误');
            }else if (RequestUtil.parseErrorCode(error) === 14) {//
                BizShowToast('该手机未在网站上绑定过, 若您已有账号,请前往ebates.cn,登录并绑定您的手机号,若您还没有账号,请先注册');
            }
        });
    }

    //快捷登录
    onQuickLoginPress() {
        this.props.navigator.push({
            component: phoneQuickLogPage,
            name: gRouteName.RegisterPage//'

        });
    }

    //忘记密码
    onForgetPassPress() {
        // showToast('onForgetPassPress');
        this.props.navigator.push({
            component: ForgetPassPage,
            name: gRouteName.ForgetPassPage//'

        });
    }

    //获取验证码图片 接口
    getOauthCodeImg() {
        this.props.dispatch(ImgOauthCodeActions.changeOauthCodeImgAction('www.baidu.com'/*为了
             让点击图片验证码按钮后立即刷新菊花,随便请求一个url*/,
            BizApi.LogInApi.ApiName));

        BizApi.ImgOauthCodeAPI.requestCaptcha().then(
            (url) => {
                // BizLoadingView.closeBizLoadingView();

                this.props.dispatch(ImgOauthCodeActions.changeOauthCodeImgAction(url, BizApi.LogInApi.ApiName));
            }
        );
    }

    render() {
        const {navigator} = this.props;

        var statusBar = GlobalStyles.statusBarDefaultProps;

        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton(() => {
                    return baseOnBackPress(navigator, this.backAndroidEventListener);
                })}
                rightButton={NavBarButton.newUserRegister(() => this.gotoRegisterPage(), {title: '新用户注册'})}
                title='登录'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black, fontSize: 17}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;

        let keyboardAwareScrollView = <KeyboardAwareScrollView ref={(r) => {
            this.keyboardAwareScrollViewRef = r;
        }}
                                                               keyboardDismissMode="interactive"
                                                               keyboardShouldPersistTaps={true}
                                                               getTextInputRefs={() => {
                                                                   return [this.emailInputViewRef, this.passInputViewRef];
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
                    {/*this.onSubmit();*/
                    }
                },
                (r) => {
                    this.emailInputViewRef = r;
                }, '账号', '输入邮箱地址或手机号'
            )}
            {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -0.5})}
            {/*密码*/}
            {BizInputViews.passInputView({},
                (event) => this.updatePassword(event.nativeEvent.text),
                (r) => {
                    this.passInputViewRef = r;
                }
            )}
            {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -0.5})}
            {/*验证码*/}
            {this.props.LogInReducer.isShowImgOauthInput ?
                BizInputViews.imgOauthCodeInputView(
                    {},
                    (event) => this.updateImgOauthCode(event.nativeEvent.text),
                    this.props.LogInReducer.oauthCodeImgUri,
                    () => this.getOauthCodeImg(),
                    () => {
                    },
                ) : null
            }
            {this.props.LogInReducer.isShowImgOauthInput ?
                baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1}) : null}
            {BizLogBt(() => this.onLoginPress(), {
                backgroundColor: Colors.appUnifiedBackColor,
                disabled: false,
                title: '登录'
            })}
            {/*手机快捷登录*/}
            <BaseTitleBt
                btStyle={{
                    borderRadius: 4,
                    borderWidth: 0.5,
                    borderColor: 'rgba(214, 214, 214, 1)',
                    height: 44,
                    alignItems: 'center',
                    marginLeft: 15,
                    marginRight: 15,
                    justifyContent: 'center',
                    backgroundColor: Colors.white,
                    marginTop: 15
                }}
                onPress={() => this.onQuickLoginPress()}
                textStyle={{
                    fontSize: 15,
                    //fontFamily: 'Gill Sans',
                    color: 'rgba(64, 64, 64, 1)',
                }}
                title='手机快捷登录'
            >
            </BaseTitleBt>
            {/*右下角Text的容器view*/}
            <BaseTitleBt
                btStyle={{
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: 'rgba(214, 214, 214, 1)',
                    height: 40,
                    width: 50,
                    alignItems: 'center',
                    marginTop: 15,
                    marginRight: 15, marginLeft: GlobalStyles.window.width - 15 - 50, justifyContent: 'center',
                    //backgroundColor: Colors.getRandomColor(),
                }}
                onPress={() => this.onForgetPassPress()}
                textStyle={{
                    fontSize: 12,
                    //fontFamily: 'Gill Sans',
                    color: 'rgba(54, 166, 66, 1)',
                    fontWeight: 'bold',
                }}
                title='忘记密码'
            >
            </BaseTitleBt>
        </KeyboardAwareScrollView>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {keyboardAwareScrollView}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: Colors.white

    },
    //输入框左图里的text
    //IpputItemLeftText: {},


});

function mapStateToProps(state) {

    // 把 state里的 homePageReducer 注入到 this.props里
    const {LogInReducer}=state;
    return {LogInReducer};
}

export default connect(mapStateToProps)(LogInPage)
