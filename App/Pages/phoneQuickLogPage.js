/**
 * Created by Ebates on 16/12/21.
 * 手机号快速登陆页
 *
 * 验证逻辑:一开始 , 手机号未输入 11位 前,2个按钮都不可点; 手机号输入正确位数后, 获取验证码 可点; 点击后, 按钮变灰并倒计时, 60秒内, 用户输入 正确位数的验证码,登陆按钮可点; 点击登录按钮时,检验 验证码是否过期,或者输错,满足其一, 提示 '请重新获取验证码'
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton,baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/BackAndroidEventListener'
import GlobalStyles from '../Global/GlobalStyles'
import {baseSpeLine} from '../Comp/Base/BaseSpeLine'
import BaseTitleBt from '../Comp/Base/BaseTitleBt'
import BizLogBt from '../Comp/BizCommonComp/BizLogBt'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


export default class phoneQuickLogPage extends Component{
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

    updatePhone(text) {
        this.phone = text;
        Log.log('this.phone==' + this.phone);
    }

    updateOauthCode(text) {
        this.oauthCode = text;
        Log.log('this.oauthCode==' + this.oauthCode);
    }

    onSendOauthCode() {

    }

    /**
     * 一开始默认不可点, 可点状态的条件: 用户输入了正确位数的验证码
     * 点击登陆按钮, 验证 验证码是否过期 和是否 输错,满足其一,就提示 '请重新获取验证码'
     */
    onLoginPress() {

    }

    /*手机号 输入框的容器view*/
    phoneInputView() {
        return (
            <View style={GlobalStyles.InputItemContainer}>
                <View style={GlobalStyles.IpputItemLeftView}>
                    <Text style={{}}>手机号</Text>
                </View>
                <View style={GlobalStyles.InputItemRightView}>
                    <TextInput
                        style={GlobalStyles.textInput}
                        autoFocus={false}
                        placeholder='输入手机号码'
                        onChange={(event) => this.updatePhone(
                            event.nativeEvent.text
                        )}
                        //onBlur={() => this.onBlur()}
                        underlineColorAndroid={'transparent'}
                    />
                </View>

            </View>
        );
    }

    /*验证码 输入框的容器view*/
    oauthCodeInputView() {
        return (
            <View style={GlobalStyles.InputItemContainer}>
                <View style={GlobalStyles.IpputItemLeftView}>
                    <Text style={{}}>验证码</Text>
                </View>
                <View style={GlobalStyles.InputItemRightView}>
                    <TextInput
                        style={GlobalStyles.textInput}
                        autoFocus={false}
                        placeholder='输入验证码'
                        onChange={(event) => this.updateOauthCode(
                            event.nativeEvent.text
                        )}
                        //onBlur={() => this.onBlur()}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
                {/*发送验证码按钮容器view*/}
                <View style={{flex:2, justifyContent:'center',alignItems: 'flex-end',
                    //backgroundColor:Colors.getRandomColor()
                }}>
                    <BaseTitleBt
                        btStyle={{
                            borderRadius: 4, width: 80 ,height: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(67, 187, 78, 0.5)'//Colors.appUnifiedBackColor,
                        }}
                        disabled={true}//参考 snowflake的LoginRender的 ItemCheckbox的 disabled的判断
                        onPress={()=>this.onSendOauthCode()}
                        textStyle={{
                            fontSize: 12,
                            //fontFamily: 'Gill Sans',
                            color: Colors.white,
                        }}
                        title='获取验证码'
                    >
                    </BaseTitleBt>
                </View>
            </View>
        );
    }

    render(){
        const { navigator} = this.props;
        var statusBar = GlobalStyles.twoLevelPageStatusBarProps;
        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton( ()=>baseOnBackPress(navigator) )}
                //rightButton={NavBarButton.newUserRegister(()=>this.gotoRegisterPage())}
                title='手机快捷登录'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black, fontSize:17}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;
        let bindingPhoneTextView=
            <View style={{paddingTop:20,paddingBottom:10, backgroundColor:'rgba(239, 239, 239, 1)'}}>
                <Text style={{marginLeft:15, marginRight:15,fontSize:12, lineHeight:18, color:'rgba(85, 85, 85, 1)'}}>目前只支持在网站上绑定手机号的用户快捷登录,未绑定过的用户请使用浏览器前往
                    <Text style={{color: Colors.appUnifiedBackColor}}>
                        Ebates.cn
                        <Text style={{color: 'rgba(85, 85, 85, 1)'}}>
                            绑定手机号
                        </Text>
                    </Text>
                </Text>
            </View>;

        return (
            <View style={{flex: 1,}}>
                {navigationBar}
                {bindingPhoneTextView}
                {this.phoneInputView()}
                {baseSpeLine({marginLeft: 15, marginRight: 15, marginTop: -1})}
                {this.oauthCodeInputView()}
                <View style={{flex:1, backgroundColor:'rgba(239, 239, 239, 1)'}}>
                    {BizLogBt(()=>this.onLoginPress())}
                </View>
            </View>
            );
    }
}

/**
 * 看 http://www.cnblogs.com/ZSG-DoBestMe/p/5280198.html,也可看笔记里的bindActionCreators
 * @param dispatch
 * @returns {{dispatchActions: *}}
 */
function mapDispatchToProps (dispatch) {
    return {
        /**
         * dispatchActions: 注入到 this.props 里 ,用于本控件统一发 action的对象,且被发送 的action 函数 不需要 被包在 dispatch() 内,
         */
        dispatchActions: bindActionCreators({  }, dispatch)
    }
}


function mapStateToProps (state) {
    // return {
    //     auth: state.auth,
    //     global: state.global
    // }

    // 把 state里的 homePageReducer 注入到 this.props里
    const {HomePageReducer}=state;
    return {HomePageReducer};
}

// export default connect( mapStateToProps , mapDispatchToProps)(phoneQuickLogPage)

