/**
 注册 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Image, Platform} from 'react-native';
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
import LogInPage from './LogInPage'
import *as RegisterRelevantActions from '../Redux/Actions/RegisterRelevantActions'
import {connect} from 'react-redux'
import WebViewPage from './WebViewPage'
import BaseBlackTranslucentCoverView from '../Comp/Base/BaseBlackTranslucentCoverView'
import BizRegigsterSucessBt from '../Comp/BizCommonComp/BizRegigsterSucessBt'
import SMSTimer from '../Utils/SMSTimer'
import *as RootNavigator from '../Root/RootNavigator'
import *as BizInputViews from '../Comp/BizCommonComp/BizInputViews'
import *as ImgOauthCodeAPI from '../NetWork/API/ImgOauthCodeAPI'

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
        RootNavigator.popToDesignatedPage(this.props.navigator, global.gPopBackToRouteAfteRegisterSuceess);
    }

    onRegisterPress() {
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
        this.props.dispatch(RegisterRelevantActions.changeOauthCodeImgAction(ImgOauthCodeAPI.imgOauthCodeAPI()));

    }

    stopTimer() {
        this.timer && this.timer.deallocInterval();
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
                    {BizInputViews.emailInputView({},
                        (event) => this.updateEmail(event.nativeEvent.text)
                    )}
                    {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                    {/*密码*/}
                    {BizInputViews.passInputView({},
                        (event) => this.updatePassword(event.nativeEvent.text)
                    )}
                    {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                    {/*验证码*/}
                    {BizInputViews.imgOauthCodeInputView(
                        {},
                        (event) => this.updateImgOauthCode(event.nativeEvent.text),
                        this.props.RegisterReducer.oauthCodeImgUri,
                        ()=>this.getOauthCodeImg()
                    )
                    }
                    {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                    {/*邀请码*/}
                    {BizInputViews.InviteCodeInputView({},
                        (event) => this.updateInviteCode(event.nativeEvent.text)
                    )}
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

