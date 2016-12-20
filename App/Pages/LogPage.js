/**
 登录 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Image} from 'react-native';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/BackAndroidEventListener'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import BaseTitleBt from '../Comp/Base/BaseTitleBt'
import {baseSpeLine} from '../Comp/Base/BaseSpeLine'

/**
 *  展示组件
 */
export default class LogRegisterPage extends Component {

    constructor(props) {
        super(props);
        this.backAndroidEventListener = new BackAndroidEventListener({...props, backPress: (e)=>this.onBackPress()});
        this.email = '';
        this.password = '';
        this.inviteCode = '';//邀请码
    }

    componentDidMount() {

        const {dispatch} = this.props;
        this.backAndroidEventListener.addEventListener();

    }

    componentWillUnmount() {
        this.backAndroidEventListener.removeEventListener();
    }

    /*
     左上角点击
     */
    onBackPress() {
        this.props.navigator.pop();//app 页面回退
        return true;
    }

    //进 注册页
    gotoRegisterPage(){
        ShowToast('gotoRegisterPage');
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

    onLoginPress() {

    }

    onRegisterPress() {

    }

    //快捷登录
    onQuickLoginPress() {

    }

    //忘记密码
    onForgetPassPress() {
        ShowToast('onForgetPassPress');

    }

    /*邮箱输入框的容器view*/
    emailInputView() {
        return (
            <View style={styles.InputItemContainer}>
                <View style={styles.IpputItemLeftView}>
                    <Text style={styles.IpputItemLeftText}>邮箱</Text>
                </View>
                <View style={styles.InputItemRightView}>
                    <TextInput
                        style={styles.textInput}
                        autoFocus={true}
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
            <View style={[styles.InputItemContainer, {marginTop: 0}]}>
                <View style={styles.IpputItemLeftView}>
                    <Text style={styles.IpputItemLeftText}>密码</Text>
                </View>
                <View style={styles.InputItemRightView}>
                    <TextInput
                        style={styles.textInput}
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
            <View style={[styles.InputItemContainer, {marginTop: -1}]}>
                <View style={styles.IpputItemLeftView}>
                    <Text style={styles.IpputItemLeftText}>邀请码</Text>
                </View>
                <View style={styles.InputItemRightView}>
                    <TextInput
                        style={styles.textInput}
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
     ShowToast('onPressServiceProvision')
    }

    renderLoginRegisterView(i, v) {
        switch (i) {
            case 0: {//登录viiew
                return (
                    // 登录注册view的 容器view
                    <View
                        key={i}
                        tabLabel={v}/*有几个tabLabel,决定有几个tab*/
                        style={styles.renderLoginRegisterView}
                    >
                        {/*邮箱输入框的容器view*/}
                        {this.emailInputView()}
                        {/*密码输入框的容器view*/}
                        {this.passInputView()}
                        {/*按钮和忘记密码的容器view*/}
                        <View
                            style={{paddingLeft: 20, paddingRight: 20}}
                        >
                            <BaseTitleBt
                                btStyle={{
                                    borderRadius: 3, height: 40, alignItems: 'center',
                                    justifyContent: 'center', backgroundColor: Colors.appUnifiedBackColor, marginTop: 15
                                }}
                                selectColor={Colors.blackTranslucent}
                                onPress={()=>this.onLoginPress()}
                                textStyle={{
                                    fontSize: 18,
                                    fontFamily: 'Gill Sans',
                                    color: Colors.white,
                                }}
                                title='登录'
                            >
                            </BaseTitleBt>
                            <BaseTitleBt
                                btStyle={{
                                    marginTop: 10,
                                    borderRadius: 3,
                                    height: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: Colors.white,
                                    borderColor: Colors.borderColor,
                                    borderWidth: 1,
                                }}
                                selectColor={Colors.blackTranslucent}
                                onPress={()=>this.onQuickLoginPress()}
                                textStyle={{
                                    fontSize: 18,
                                    fontFamily: 'Gill Sans',
                                    color: Colors.appUnifiedBackColor,
                                }}
                                title='手机号快捷登录'
                            >
                            </BaseTitleBt>
                            {/*忘记密码容器view*/}
                            <View
                                style={{
                                    height: 40, marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                {baseSpeLine({flex: 1})}
                                <BaseTitleBt
                                    btStyle={{
                                        flex: 1,
                                        height: 40, alignItems: 'center',
                                        justifyContent: 'center', backgroundColor: 'rgba(242, 244, 244, 1)',
                                    }}
                                    //selectColor={Colors.blackTranslucent}
                                    onPress={()=>this.onForgetPassPress()}
                                    textStyle={{
                                        fontSize: 14,
                                        fontFamily: 'Gill Sans',
                                        color: Colors.textGray,
                                    }}
                                    title='忘记密码'
                                >
                                </BaseTitleBt>
                                {baseSpeLine({flex: 1})}
                            </View>
                        </View>

                    </View>
                );
            }
                break;
            case 1: {//注册view
                let str='注册即同意  ';
                return (
                    <View
                        key={i}
                        tabLabel={v}/*有几个tabLabel,决定有几个tab*/
                        style={styles.renderLoginRegisterView}
                    >
                        {/*邮箱输入框的容器view*/}
                        {this.emailInputView()}
                        {/*密码输入框的容器view*/}
                        {this.passInputView()}
                        {this.InviteCodeInputView()}
                        {/*服务条款容器view*/}
                        <View style={{
                            height: 40,
                            paddingLeft: 55,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            <Text style={{
                                color: Colors.textGray,
                                fontSize: 13,
                                //backgroundColor: Colors.getRandomColor()
                            }}>
                                {str}
                            </Text>
                            <Text style={{
                                color: Colors.appUnifiedBackColor,
                                fontSize: 13,
                                //backgroundColor: Colors.getRandomColor()
                            }}
                                  onPress={
                                      ()=>this.onPressServiceProvision()
                                  }
                            >
                                Ebates.cn服务条款
                            </Text>
                        </View>
                        {/*view*/}
                        <View
                            style={{paddingLeft: 15, paddingRight: 15}}
                        >
                            <BaseTitleBt
                                btStyle={{
                                    borderRadius: 3, height: 40, alignItems: 'center',
                                    justifyContent: 'center', backgroundColor: Colors.appUnifiedBackColor
                                }}
                                selectColor={Colors.blackTranslucent}
                                onPress={()=>this.onRegisterPress()}
                                textStyle={{
                                    fontSize: 18,
                                    fontFamily: 'Gill Sans',
                                    color: Colors.white,
                                }}
                                title='免费注册赠$5'
                            >
                            </BaseTitleBt>
                        </View>
                    </View>
                );
            }
                break;
        }
    }

    render() {
        const {LogRegisterPageReducer, navigator} = this.props;

        var statusBar = {//外部自定义statusBar的属性
            backgroundColor: Colors.white,
            networkActivityIndicatorVisible: true,
            barStyle: 'dark-content'
        };
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

        let str='返利高 商家全 折扣大 提现快';
        let ebatesView =
            <View style={{alignItems:'center',
                //backgroundColor: Colors.getRandomColor()
            }}>
                <Image source={require('../Img/common_icon_logo@2x.png')} style={{marginTop:20}}/>
                <Text style={{marginTop:10, fontSize:18,fontWeight:'bold', color:'rgba(255, 115,' +
                    ' 12, 1)',
                    //backgroundColor:Colors.getRandomColor()
                }}>最好的海淘返利网站</Text>
                <Text style={{marginTop:3, fontSize:12, color:'rgba(136, 136, 136, 1)'}}>{str}</Text>
            </View>

        // let content = <ScrollableTabView
        //     //page={0}
        //     renderTabBar={() =>
        //         <DefaultTabBar
        //             tabStyle={{paddingBottom: 0 /*为了 text 上下居中*/}}
        //             style={{height: 40 /*外部改变DefaultTabBar的高度 */}}
        //             underlineHeight={2}
        //             textStyle={{fontSize: 15 /*, color:Colors.black*/}}
        //             activeTextColor={Colors.appUnifiedBackColor}
        //         />
        //     }
        //     tabBarBackgroundColor='rgba(237, 237, 237, 1)'/*"#fcfcfc"*/ //整个tabbar的背景色
        //     tabBarUnderlineColor={Colors.appUnifiedBackColor}
        //     tabBarActiveTextColor={Colors.appUnifiedBackColor}
        //     tabBarInactiveTextColor={Colors.black}//"#aaaaaa"
        // >
        //
        //     {/*{*/}
        //         {/*LogRegisterPageReducer.scrollTbvMenuTitles.map((v, i) => {*/}
        //             {/*return this.renderLoginRegisterView(i, v);*/}
        //         {/*})*/}
        //     {/*}*/}
        //
        //
        // </ScrollableTabView>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {ebatesView}
                {/*邮箱输入框的容器view*/}
                {this.emailInputView()}
                {baseSpeLine({marginLeft:15, marginRight:15, marginTop:-1})}
                {this.passInputView()}
                {baseSpeLine({marginLeft:15, marginRight:15, marginTop:-1})}
                <BaseTitleBt
                    btStyle={{
                        borderRadius: 4, height: 44, alignItems: 'center',
                        marginLeft: 15,marginRight:15,justifyContent: 'center', backgroundColor: Colors.appUnifiedBackColor, marginTop: 15
                    }}
                    selectColor={Colors.blackTranslucent}
                    onPress={()=>this.onLoginPress()}
                    textStyle={{
                        fontSize: 15,
                        //fontFamily: 'Gill Sans',
                        color: Colors.white,
                    }}
                    title='登录'
                >
                </BaseTitleBt>
                <BaseTitleBt
                    btStyle={{
                        borderRadius: 4, borderWidth: 0.5,borderColor:'rgba(214, 214, 214, 1)', height: 44, alignItems: 'center',
                        marginLeft: 15,marginRight:15,justifyContent: 'center', backgroundColor: Colors.white, marginTop: 15
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
                <View style={{marginTop:20,flexDirection:'row', justifyContent:'flex-end', marginRight:15,
                    //backgroundColor:Colors.getRandomColor()
                }}>
                    <Text style={{color:'rgba(54, 166, 66, 1)', fontSize:12}}
                          onPress={()=>{this.onForgetPassPress()}}
                    >忘记密码</Text>
                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    renderLoginRegisterView: {flex: 1, backgroundColor: 'rgba(242, 244, 244, 1)'},
    //输入框的容器view
    InputItemContainer: {
        marginTop: 40,
        height: 44,
        flexDirection: 'row',
        paddingLeft: 15, paddingRight: 15,
        //borderColor: Colors.borderColor, borderWidth: 1,
        //backgroundColor: Colors.getRandomColor()//'rgba(252, 254, 254, 1)'
    },
    //输入框容器里的左图
    IpputItemLeftView: {
        // flex: 1,
        paddingRight: 30,
        justifyContent: 'center', alignItems: 'flex-start',
         height: 44,
        // backgroundColor: Colors.getRandomColor()
    },
    //输入框左图里的text
    IpputItemLeftText: {},
    //输入框容器里的右图
    InputItemRightView: {flex: 4, height: 40 /*, backgroundColor: Colors.getRandomColor()*/},
    textInput: {
        marginTop: 3,//因 input的内容偏高,此处为了下移点, 和 input左边的 邮箱,密码2个Text 对齐
        height: 40,
        fontSize: 15,
        // alignItems: 'center',
        color: Colors.textGray,
        // backgroundColor: Colors.getRandomColor()
    },


});

