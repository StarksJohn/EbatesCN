/**
 * Created by Ebates on 17/2/22.
 * ForgetPassPage
 * 忘记密码,  重置密码 页面
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Platform} from 'react-native';
import {connect} from 'react-redux'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import *as BizInputViews from '../Comp/BizCommonComp/BizInputViews'
import {baseSpeLine} from '../Comp/Base/BaseSpeLine'
import *as ForgetPassPageActions from '../Redux/Actions/ForgetPassPageActions'
import *as ImgOauthCodeActions from '../Redux/Actions/ImgOauthCodeActions'
import *as ImgOauthCodeAPI from '../NetWork/API/ImgOauthCodeAPI'
import *as BizApi from '../NetWork/API/BizApi'
import BizLogBt from '../Comp/BizCommonComp/BizLogBt'
import *as OauthForm from '../Utils/LogRegisterUtils/OauthForm'
import ForgetPassEmailOkPage from './ForgetPassEmailOkPage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import *as BizLoadingView from '../Comp/BizCommonComp/BizLoadingView'

export class ForgetPassPage extends Component {
    constructor(props) {
        super(props);

        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.ForgetPassPage
            });
        }

        this.email = '';
        this.imgOauthCode = '';
        this.props.dispatch(ForgetPassPageActions.ForgetPassPageInitStateActions(BizApi.ForgetPassPageApi.ApiName));
        this.props.dispatch(ForgetPassPageActions.changeGoOnBtStatesActions(false, BizApi.ForgetPassPageApi.ApiName));

        this.getOauthCodeImg();

    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    updateEmail(text) {

        const {dispatch} = this.props;
        this.email = text;
        Log.log('this.email==' + this.email);

        //emial格式和验证码字数验证成功
        if (OauthForm.oauthEmail(this.email) && OauthForm.oauthImgCodePass(this.imgOauthCode)) {
            dispatch(ForgetPassPageActions.changeGoOnBtStatesActions(true, BizApi.ForgetPassPageApi.ApiName));
        } else {
            dispatch(ForgetPassPageActions.changeGoOnBtStatesActions(false, BizApi.ForgetPassPageApi.ApiName));
        }
    }

    updateImgOauthCode(text) {
        const {dispatch} = this.props;

        this.imgOauthCode = text;
        Log.log('this.imgOauthCode==' + this.imgOauthCode);

        //emial格式和验证码字数验证成功
        if (OauthForm.oauthEmail(this.email) && OauthForm.oauthImgCodePass(this.imgOauthCode)) {
            dispatch(ForgetPassPageActions.changeGoOnBtStatesActions(true, BizApi.ForgetPassPageApi.ApiName));
        } else {
            dispatch(ForgetPassPageActions.changeGoOnBtStatesActions(false, BizApi.ForgetPassPageApi.ApiName));
        }
    }

    //获取验证码图片 接口
    getOauthCodeImg() {
        this.props.dispatch(ImgOauthCodeActions.changeOauthCodeImgAction('www.baidu.com'/*为了
             让点击图片验证码按钮后立即刷新菊花,随便请求一个url*/,
            BizApi.ForgetPassPageApi.ApiName));

        BizApi.ImgOauthCodeAPI.requestCaptcha().then(
            (url) => {
                // BizLoadingView.closeBizLoadingView();
                this.props.dispatch(ImgOauthCodeActions.changeOauthCodeImgAction(url, BizApi.ForgetPassPageApi.ApiName));
            }
        );
    }

    goOnPress() {
        this.email=this.email.trim();
        this.imgOauthCode=this.imgOauthCode.trim();

        if (!OauthForm.oauthEmail(this.email)) {
            BizShowToast('邮箱地址不正确');
            return;
        }
        if (!OauthForm.oauthImgCodePass(this.imgOauthCode)) {
            BizShowToast('请输入正确的验证码');
            return;
        }

        BizApi.ForgetPassPageApi.forgetPassword(
            {
                email: this.email,
                captcha: this.imgOauthCode,
                captchaUuid: BizApi.ImgOauthCodeAPI.data.captchaUuid
            }
        ).then(
            (responseData) => {
                this.props.navigator.push({
                    component: ForgetPassEmailOkPage,
                    name: gRouteName.ForgetPassEmailOkPage,
                    email: this.email
                });
            }
        ).catch((error) => {
            
        })


    }

    render() {
        const {navigator} = this.props;

        let navigationBar = BizViews.renderBaseNavigationBar(null, NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener)), null, null, '重置您的密码', {
            color: Colors.BizCommonBlack,
            fontSize: 17
        });

        let keyboardAwareScrollView = <KeyboardAwareScrollView
            ref={(r) => {
                this.keyboardAwareScrollViewRef = r;
            }} keyboardDismissMode="interactive"
            scrollEnabled={false}
            keyboardShouldPersistTaps={true}
            getTextInputRefs={() => {
                return [this.emailInputViewRef, this.imgOauthCodeInputViewRef];
            }}
            style={{
                //backgroundColor: Colors.getRandomColor()
            }}
        >
            <Text style={{
                color: 'rgba(85, 85, 85, 1)', fontSize: 12, marginLeft: 15, marginTop: 23,
                //backgroundColor: Colors.getRandomColor()
            }}>
                请输入你需要找回登录密码的账号邮箱
            </Text>
            {/*邮箱输入框的容器view*/}
            {BizInputViews.emailInputView({marginTop: 10},
                (event) => this.updateEmail(event.nativeEvent.text),
                () => {
                    //主动让光标下移
                    this.imgOauthCodeInputViewRef.focus();
                    this.keyboardAwareScrollViewRef._scrollToFocusedTextInput();
                },
                (r) => {
                    this.emailInputViewRef = r;
                },'邮箱','输入邮箱地址'
            )}
            {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -0.5})}
            {/*验证码*/}
            {BizInputViews.imgOauthCodeInputView(
                {height: 55},
                (event) => this.updateImgOauthCode(event.nativeEvent.text),
                this.props.ForgetPassPageReducer.oauthCodeImgUri,
                () => this.getOauthCodeImg(),
                (r) => {
                    this.imgOauthCodeInputViewRef = r;
                }
            )
            }
            {BizLogBt(() => this.goOnPress(), {
                backgroundColor: this.props.ForgetPassPageReducer.goOnBtState.backColor,
                disabled: this.props.ForgetPassPageReducer.goOnBtState.disabled,
                title: '继续',
                //btStyle: {marginTop: 0}
            })}
        </KeyboardAwareScrollView>;

        return (
            <View style={{flex: 1, backgroundColor: Colors.BizCommonGrayBack}}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                {keyboardAwareScrollView}
            </View>
        );
    }

}

function mapStateToProps(state) {

    // 把 state里的 homePageReducer 注入到 this.props里
    const {ForgetPassPageReducer}=state;
    return {ForgetPassPageReducer};
}

export default connect(mapStateToProps)(ForgetPassPage)

