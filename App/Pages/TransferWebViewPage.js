/**
 * 跳转的webview页面 TransferWebViewPage
 * Created by iWgang on 16/05/22.
 * https://github.com/iwgang/GankCamp-React-Native
 */
import React, {Component, PropTypes} from 'react';
import {View, WebView, Platform, BackAndroid, InteractionManager, ScrollView, Image, Text} from 'react-native';
import {connect} from 'react-redux';
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import Colors from '../Utils/Colors';
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import GlobalStyles from '../Global/GlobalStyles'
import BaseListComp from '../Comp/Base/BaseListComp'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import BaseDashLine from '../Comp/Base/BaseDashLine'
import SMSTimer from '../Utils/SMSTimer'
import *as BizApi from '../NetWork/API/BizApi'
import *as BizLoadingView from '../Comp/BizCommonComp/BizLoadingView'


const WEBVIEW_REF = 'webview';


export class TransferWebViewPage extends Component {

    // static defaultProps = {
    //     hideTitleBar: false,
    // };

    // static propTypes = {
    //     isHideTitleBar: PropTypes.bool, // 是否隐藏标题栏
    // };

    constructor(props, context) {
        super(props, context);

        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => {
                    return this.onBackPress();
                },
                hardwareBackPressListenerName: 'WebViewPage'
            });
        }

        this.isWebViewonLoad=false;//webview是否加载成功
        this.state = {
            isShareModal: false, //
            canGoBack: false,//webview页面内跳转
            loadEnd: false,
            url: this.props.route.url,
            CountDown: 1,
            isCountDownOver: false,//倒计时是否完毕
            isClickApiSuccess: false,//click 接口是否成功
            navTitle: '正在载入...',
        };

        this.timer = new SMSTimer({
            timerNums: this.state.CountDown,
            callBack: (time) => {
                Log.log('time===' + time);
                // this.CountDown=time;

                if (time > 0) {
                    this.setState({
                        CountDown: time
                    })
                }
                else {
                    this.setState({
                        isCountDownOver: true
                    })
                }
            }
        });
        this.timer.start();

    }

    componentDidMount() {
        // this.backAndroidComp.addEventListener();

        BizApi.ClickApi.fetchClickData(this.props.route.merchantData.id).then(
            (responseData) => {
                this.setState({
                    url: responseData.transferUrl,//'http://www.jianshu.com/',//'https://www.baidu.com/',//responseData.transferUrl,//'http://www.lcode.org/react-native/', 'http://www.58.com'
                    isClickApiSuccess: true,
                    // navTitle: this.props.route.merchantData.name
                })
            }
        ).catch(
            (error) => {

                Log.log('TransferWebViewPage componentDidMount error');

            }
        );
    }

    componentWillUnmount() {
        // this.backAndroidComp.removeEventListener();

    }

    renderLoading() {
        // return <CommonLoadView loadState="ing"/>;
        // return   BizLoadingView.showBizLoadingView('加载中....');
    }

    onNavigationStateChange = (navState) => {
        // this.canGoBack = navState.canGoBack;
        // canGoBack = navState.canGoBack;

        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    }

    //按Home键
    onBackPress() {
        if (this.state.canGoBack) {
            this.refs[WEBVIEW_REF].goBack();//webview的 页面回退
            return false;
        } else {
            // this.props.navigator.pop();//app 页面回退
            // Log.log('app 页面回退');
            baseOnBackPress(this.props.navigator)
        }
        return true;

    }

    onPress() {
        // showToast('onPress')

        // this.setState({renderShareView: true});

    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        Log.log('TransferWebViewPage renderRow rowID=' + rowID);

        return <View style={{
            flex: 1, //height:GlobalStyles.window.height-GlobalStyles.statusBarAndNavBarH,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: Colors.getRandomColor()
        }}>
            <View style={{
                width: 300, height: 100,
                backgroundColor: Colors.getRandomColor()
            }}>

            </View>
        </View>
    }

    renderTransferView() {
        const {navigator, route} = this.props;

        let strCountDown = '将在' + this.state.CountDown + '秒后带你去';
        let str = '完成订单后, 你可以获得' + route.merchantData.now_rate + '.';

        return <View style={{
            flex: 0, height: GlobalStyles.window.height - GlobalStyles.statusBarAndNavBarH,
            alignItems: 'center', justifyContent: 'center',
            //backgroundColor: Colors.white
        }}>
            <ScrollView showsVerticalScrollIndicator={false} centerContent={true}
            >
                <View style={{
                    width: GlobalStyles.window_width - 20,
                    height: 340,
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    alignItems: 'center', paddingLeft: 25, paddingRight: 25,
                    backgroundColor: Colors.white
                }}>
                    <View style={{
                        width: GlobalStyles.window_width - 20, height: 2, backgroundColor: 'rgba(245,' +
                        ' 166, 35, 1)',
                    }}>
                    </View>
                    <Image source={ require('../Img/common_icon_logo.png') } style={{
                        //position:'absolute',left:0, right: 0,top:0, bottom: 0,
                        width: 70, height: 25, marginTop: 20,
                        //alignSelf: 'center', //resizeMode: 'contain',
                        //borderColor: Colors.getRandomColor(), borderWidth: 0.5,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                    </Image>
                    <Text style={{
                        fontSize: 15, color: 'rgba(136,' +
                        ' 136, 136 1)', marginTop: 15, //marginLeft: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {strCountDown}
                    </Text>
                    <Text style={{
                        fontSize: 17, color: Colors.BizCommonBlack, marginTop: 10, fontWeight: 'bold'
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {route.merchantData.name}
                    </Text>
                    <Text style={{
                        fontSize: 20, color: Colors.orange, marginTop: 10, fontWeight: 'bold'
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {route.merchantData.now_rate}
                    </Text>
                    <Text style={{
                        fontSize: 13, color: 'rgba(85, 85, 85, 1)', marginTop: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {str}
                    </Text>
                    <Text style={{
                        fontSize: 13, color: 'rgba(85, 85, 85, 1)', marginTop: 5,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        您的返利将在1-7天内加至你的Ebates账户.
                    </Text>
                    <View style={{
                        marginTop: 15,
                        width: 295,
                        paddingTop: 8,
                        paddingBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(249,' +
                        ' 249, 249, 1)'
                    }}>
                        <Text style={{
                            fontSize: 12, color: 'rgba(136, 136, 136, 1)', marginTop: 5,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            Tip: 不要在您购物的时候删除cookie
                        </Text>
                    </View>
                    <BaseDashLine customContainerStyle={{marginTop: 20, width: 295}} customDashItemStyle={{
                        height: 1,
                        width: 3,
                        marginRight: 2,
                        //flex: 1,
                        backgroundColor: '#ddd',
                    }}/>
                    <Text style={{
                        fontSize: 12, color: 'rgba(136, 136, 136, 1)', marginTop: 20,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        注意: 使用任何非Ebates提供的优惠代码(包括商家提供的)都可能会让您无法拿到返利.
                    </Text>
                </View>

            </ScrollView>

        </View>
    }

    renderWebview() {
        return <WebView
            ref={WEBVIEW_REF}
            automaticallyAdjustContentInsets={false}
            style={{flex: 1}}
            source={{uri: this.state.url, method: 'GET'}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState//声明此属性,在WebView的 getInitialState 里就会有初始值
            scalesPageToFit={false}
            decelerationRate="normal"
            onLoad={() => {
                Log.log(' TransferWebViewPage renderWebview onLoad')
                this.isWebViewonLoad=true;
            }
            }
            onLoadStart={() => {
                {/*this.setState({loadEnd: true})*/
                }
                Log.log(' TransferWebViewPage renderWebview onLoadStart')
                {/*BizLoadingView.showBizLoadingView('加载中....')*/
                }
            }}
            onLoadEnd={() => {
                {/*this.setState({loadEnd: true})*/
                }
                Log.log(' TransferWebViewPage renderWebview onLoadEnd')
                {/*BizLoadingView.closeBizLoadingView()*/
                }
            }}
            onShouldStartLoadWithRequest={() => {
                const shouldStartLoad = true;
                return shouldStartLoad;
            }}
            onError={() => {
                Log.log(' TransferWebViewPage renderWebview onError')
                this.isWebViewonLoad=false;

            }}
            // startInLoadingState={true}
            //renderError={() => <CommonLoadView loadState="error" onRetry={() => this.refs.webView.reload()}/>}
            onNavigationStateChange={this.onNavigationStateChange}
            renderLoading={this.renderLoading}
        />
    }

    renderTitleTextView() {
        const {navigator, route} = this.props;

        return <View style={{
            alignItems:'center' ,
            //backgroundColor: Colors.getRandomColor()
        }}>
            <Text style={{
                fontSize: 15, color: Colors.BizCommonBlack, marginTop: 0, marginLeft: 0,
                //backgroundColor: Colors.getRandomColor()
            }}>
                {route.merchantData.name}
            </Text>
            <Text style={{
                fontSize: 14, color: Colors.orange, marginTop: 0, marginLeft: 0,
                //backgroundColor: Colors.getRandomColor()
            }}>
                {route.merchantData.now_rate}
            </Text>
        </View>
    }

    render() {
        const {navigator, route} = this.props;

        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.white} }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                title={this.state.navTitle}
                titleTextStyle={{color: Colors.black, fontSize: 17}}
                titleTextView={this.state.isClickApiSuccess&&this.state.isCountDownOver&& this.isWebViewonLoad?this.renderTitleTextView():null}
                leftButton={NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                hide={false}/>;

        return (
            <View style={{flex: 1, backgroundColor: 'rgba(242, 242, 242, 1)'}}>
                {navigationBar}
                {BizViews.renderShadowLine({})}

                {/*跳转view*/}
                {
                    this.state.isCountDownOver && this.state.isClickApiSuccess ? this.renderWebview() : this.renderTransferView()
                }

            </View>
        );
    }


}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {TransferWebViewPageReducer}=state;
    return {baseReducer: TransferWebViewPageReducer};
}
export default connect(mapStateToProps)(TransferWebViewPage);