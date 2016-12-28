/**
 * 统一WebView页面
 * Created by iWgang on 16/05/22.
 * https://github.com/iwgang/GankCamp-React-Native
 */
import React, {Component, PropTypes} from 'react';
import {View, WebView, Platform, BackAndroid, InteractionManager} from 'react-native';
// import {NaviGoBack} from '../utils/CommonUtils';
// import ShareSDKDemo from '../utils/Share/ShareSDKDemo'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'

// import CommonLoadView from '../comp/Base/CommonLoadView';
// import ViewUtils from '../utils/ViewUtils'
import Colors from '../Utils/Colors';
// import BaseShareView from '../comp/Base/BaseShareView'
import BackAndroidEventListener from '../Utils/BackAndroidEventListener'

// const shareImg = require('../img/share.png');
// let toolbarActions = [
//     {title: '分享', icon: shareImg, show: 'always'}
// ];
// let canGoBack = false;//webview页面内跳转
const WEBVIEW_REF = 'webview';

export default class WebViewPage extends Component {

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
                backPress: (e)=> {
                    return this.onBackPress();
                },
                hardwareBackPressListenerName: 'WebViewPage'
            });
        }
        this.state = {
            isShareModal: false, //
            canGoBack: false,//webview页面内跳转
            loadEnd: false,
            url: this.props.route.url,
            // renderShareView: false,

        };
    }

    // _onBackButton() {
    //     if (this.canGoBack) {
    //         showToast('回调了 WebViewPage的 _onBackButton() ');
    //
    //         this.refs.webView.goBacgoBackk();
    //         return true;
    //     }
    //     return false;
    // }

    onActionSelected = ()=> {
        // this.setState({
        //     // isShareModal: true
        // });

        // const { navigator,route } = this.props;
        //
        // InteractionManager.runAfterInteractions(() => {
        //     navigator.push(
        //     {
        //         component: ShareSDKDemo,
        //         title: route.title,
        //         text: '',
        //         url: route.url,
        //     });
        // });
    }

    componentDidMount() {
        // this.backAndroidComp.addEventListener();

    }

    componentWillUnmount() {
        // this.backAndroidComp.removeEventListener();

    }

    renderLoading() {
        // return <CommonLoadView loadState="ing"/>;
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

    renderShareView() {
        const {navigator, route} = this.props;

        // return (
        //     <BaseShareView
        //         visible={this.state.renderShareView}
        //         cancel={()=> {
        //             this.setState({renderShareView: false})
        //         }}
        //         shareData={
        //         {
        //             RCTShareTitle: route.title,
        //             RCTShareText: route.title,
        //             RCTShareImages: null,
        //             RCTShareUrl: route.url
        //         }
        //         }
        //         isNeedShareAfterLogIn={true}
        //         {...this.props}
        //     />
        // )
    }

    render() {
        let titleBar;
        const {navigator, route} = this.props;

        // if (!this.props.hideTitleBar)
        {
            titleBar = (
                <BaseNavigationBar
                    navigator={navigator}
                    style={{backgroundColor: Colors.white}}
                    leftButton={NavBarButton.getBackButton(()=>baseOnBackPress(navigator,this.backAndroidEventListener))}
                    title={route.title}
                    titleTextStyle={{fontSize: 16,color: Colors.black}}
                    statusBarCustomStyle={
                    {
                        backgroundColor: Colors.appUnifiedBackColor,
                        networkActivityIndicatorVisible: true,
                        barStyle: 'light-content'
                    }
                    }
                />
            );
        }

        return (
            <View style={{flex: 1}}>
                {titleBar}
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={{flex: 1}}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState//声明此属性,在WebView的 getInitialState里就会有初始值
                    scalesPageToFit
                    decelerationRate="normal"
                    onLoadEnd={() => this.setState({loadEnd: true})}
                    onShouldStartLoadWithRequest={() => {
                        const shouldStartLoad = true;
                        return shouldStartLoad;
                    }}
                    // startInLoadingState={true}
                    //renderError={() => <CommonLoadView loadState="error" onRetry={() => this.refs.webView.reload()}/>}
                    onNavigationStateChange={this.onNavigationStateChange}
                    renderLoading={this.renderLoading}
                />
            </View>
        );
    }


}

// function select(store) {
//     return {
//         isCollect: store.collectStore.isCollect,
//     }
// }
//
// export default connect(select)(WebViewPage);