/**
 登录注册 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
// import {getTitleBarTab} from '../actions/titleBarTab';
// import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
// import RecommendedFoodListContanier from '../containers/RecommendedFoodListContanier';
// import CollectedListContainer from '../containers/CollectedListContainer';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/BackAndroidEventListener'
import *as LogRegisterPageActions from '../Redux/Actions/LogRegisterPageActions'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
// import helloJs from '../../node_modules/hellojs/dist/hello.all.js'
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import {
//     Hoshi,
// } from 'react-native-textinput-effects';
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

    }

    componentDidMount() {

        const {dispatch} = this.props;
        // dispatch(getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据
        this.backAndroidEventListener.addEventListener();
        dispatch(LogRegisterPageActions.getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据

    }

    componentWillUnmount() {
        // BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
        this.backAndroidEventListener.removeEventListener();

        // this.context.removeBackButtonListener(this.onBackButton);
    }

    /*
     左上角点击
     */
    onBackPress() {
        this.props.navigator.pop();//app 页面回退
        return true;
    }

    updateEmail(text) {
        this.email = text;
        Log.log('this.email==' + this.email);
    }

    updatePassword(text) {
        this.password = text;
        Log.log('this.email==' + this.password);
    }

    //输入框失去焦点时回调
    onBlur() {
        Log.log('onBlur this.email==' + this.email);
        Log.log('onBlur this.password==' + this.password);

    }

    onLoginPress(){

    }

    //快捷登录
    onQuickLoginPress(){

    }

    //忘记密码
    onForgetPassPress(){

    }

    renderLoginRegisterView(i, v) {
        switch (i) {
            case 0: {//登录viiew
                return (
                    <View
                        key={i}
                        tabLabel={v}/*有几个tabLabel,决定有几个tab*/
                        style={styles.renderLoginRegisterView}
                    >
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
                        <View style={[styles.InputItemContainer, {marginTop: -1}]}>
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
                        {/*按钮和忘记密码的容器view*/}
                        <View
                            style={{paddingLeft:20, paddingRight: 20}}
                        >
                            <BaseTitleBt
                                btStyle={{
                                    borderRadius: 3, height: 40,alignItems: 'center',
                                    justifyContent: 'center', backgroundColor:Colors.appUnifiedBackColor, marginTop:15
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
                                    marginTop: 10, borderRadius: 3, height: 40,alignItems: 'center',
                                    justifyContent: 'center', backgroundColor:Colors.white,borderColor: Colors.borderColor, borderWidth: 1,
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
                                style={{height:40, marginTop:10,flexDirection:'row' ,justifyContent:'flex-start',
                                    alignItems:'center'}}
                            >
                                {baseSpeLine({flex:1})}
                                <BaseTitleBt
                                    btStyle={{flex:1,
                                        height: 40,alignItems: 'center',
                                        justifyContent: 'center',backgroundColor:'rgba(242, 244, 244, 1)',
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
                                {baseSpeLine({flex:1})}
                            </View>
                        </View>

                    </View>
                );
            }
                break;
            case 1: {//注册view
                return (
                    <View
                        key={i}
                        tabLabel={v}/*有几个tabLabel,决定有几个tab*/
                        style={{flex: 1, backgroundColor: Colors.getRandomColor()}}
                    >

                    </View>
                );
            }
                break;
        }
    }

    render() {
        const {LogRegisterPageReducer, navigator} = this.props;

        var statusBar = {//外部自定义statusBar的属性
            backgroundColor: Colors.appUnifiedBackColor,
            networkActivityIndicatorVisible: true,
            barStyle: 'dark-content'
        };
        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton(()=>this.onBackPress())}
                title='登录/注册'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;

        let ebatesView =
            <View style={{height: 140, backgroundColor: 'rgba(221, 221, 221, 1)'}}>

            </View>

        let content = <ScrollableTabView
            //page={0}
            renderTabBar={() =>
                <DefaultTabBar
                    tabStyle={{paddingBottom: 0 /*为了 text 上下居中*/}}
                    style={{height: 40 /*外部改变DefaultTabBar的高度 */}}
                    underlineHeight={2}
                    textStyle={{fontSize: 15 /*, color:Colors.black*/}}
                    activeTextColor={Colors.appUnifiedBackColor}
                />
            }
            tabBarBackgroundColor='rgba(237, 237, 237, 1)'/*"#fcfcfc"*/ //整个tabbar的背景色
            tabBarUnderlineColor={Colors.appUnifiedBackColor}
            tabBarActiveTextColor={Colors.appUnifiedBackColor}
            tabBarInactiveTextColor={Colors.black}//"#aaaaaa"
        >

            {
                LogRegisterPageReducer.scrollTbvMenuTitles.map((v, i) => {
                    return this.renderLoginRegisterView(i, v);
                })
            }


        </ScrollableTabView>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {ebatesView}
                {content}
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
        marginTop: 10,
        height: 40,
        flexDirection: 'row',
        borderColor: Colors.borderColor, borderWidth: 1,
        backgroundColor: 'rgba(252, 254, 254, 1)'
    },
    //输入框容器里的左图
    IpputItemLeftView: {
        flex: 1, justifyContent: 'center', alignItems: 'flex-end',
        paddingRight: 10, height: 40,
        // backgroundColor: Colors.getRandomColor()
    },
    //输入框左图里的text
    IpputItemLeftText: {},
    //输入框容器里的右图
    InputItemRightView: {flex: 4, height: 40 /*, backgroundColor: Colors.getRandomColor()*/},
    textInput: {
        height: 40,
        fontSize: 15,
        // alignItems: 'center',
        color: Colors.textGray,
        // backgroundColor: Colors.getRandomColor()
    },


});

