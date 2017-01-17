/**
 登录 页
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

/**
 *  展示组件
 */
export class LogInPage extends Component {

    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e)=> baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: 'LogPage'
            });
        }

        this.email = '';
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

    onSubmit() {
        Log.log('LogInPage onSubmit' );
    }

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
        if (!OauthForm.oauthEmail(this.email)) {
            showToast('邮箱地址不正确');
            return;
        }
        if (!OauthForm.oauthPass(this.password)) {
            showToast('密码至少6位字符或数字');
            return;
        }

        if ((this.props.LogInReducer.isShowImgOauthInput && !OauthForm.oauthImgCodePass(this.imgOauthCode))) {
            showToast('请输入正确的验证码');
            return;
        }

        // showToast('onLoginPress ok ');
        this.passErrorCount++;
        if (this.passErrorCount == 3) {
            this.props.dispatch(LogInActions.showImgOauthInputAction());
            this.getOauthCodeImg();
        }
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
    }

    //获取验证码图片 接口
    getOauthCodeImg() {
        this.props.dispatch(LogInActions.changeOauthCodeImgAction(ImgOauthCodeAPI.imgOauthCodeAPI()));
    }

    render() {
        const {navigator} = this.props;

        var statusBar = GlobalStyles.statusBarDefaultProps;

        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton(()=> {
                    return baseOnBackPress(navigator, this.backAndroidEventListener);
                })}
                rightButton={NavBarButton.newUserRegister(()=>this.gotoRegisterPage(), {title: '新用户注册'})}
                title='登录'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black, fontSize: 17}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {BizViews.ebatesViews()}
                {/*邮箱输入框的容器view*/}
                {BizInputViews.emailInputView({},
                    (event) => this.updateEmail(event.nativeEvent.text),
                    () => this.onSubmit(),
                )}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                {/*密码*/}
                {BizInputViews.passInputView({},
                    (event) => this.updatePassword(event.nativeEvent.text)
                )}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                {/*验证码*/}
                {this.props.LogInReducer.isShowImgOauthInput ?
                    BizInputViews.imgOauthCodeInputView(
                        {},
                        (event) => this.updateImgOauthCode(event.nativeEvent.text),
                        this.props.LogInReducer.oauthCodeImgUri,
                        ()=>this.getOauthCodeImg()
                    ) : null
                }
                {this.props.LogInReducer.isShowImgOauthInput ?
                    baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1}) : null}
                {BizLogBt(()=>this.onLoginPress(), {
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
                    selectColor={Colors.blackTranslucent}
                    onPress={()=>this.onQuickLoginPress()}
                    textStyle={{
                        fontSize: 15,
                        //fontFamily: 'Gill Sans',
                        color: 'rgba(64, 64, 64, 1)',
                    }}
                    title='手机快捷登录'
                >
                </BaseTitleBt>
                {/*右下角Text的容器view*/}
                <View style={{
                    marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 15,
                    //backgroundColor:Colors.getRandomColor()
                }}>
                    <Text style={{color: 'rgba(54, 166, 66, 1)', fontSize: 12}}
                          onPress={()=> {
                              this.onForgetPassPress()
                          }}
                    >忘记密码</Text>
                </View>
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
