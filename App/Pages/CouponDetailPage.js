/**
 * Created by Ebates on 2017/4/3.
 * CouponDetailPage.js 优惠详情页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform, Image, Dimensions, Animated, TouchableOpacity,InteractionManager} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import BaseNavigationBar, {styles, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import *as StringOauth from '../Utils/StringUtils/StringOauth'
import MerchantDetailPageMarkGridViewContainer from '../Redux/Container/MerchantDetailPageMarkGridViewContainer'
import BaseTitleBt from '../Comp/Base/BaseTitleBt'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import *as MerchantDetailPageActions from '../Redux/Actions/MerchantDetailPageActions'
import *as BizCouponListCell from '../Comp/BizCells/BizCouponListCell'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import BaseBt from '../Comp/Base/BaseBt'
import *as BizApi from '../NetWork/API/BizApi'
import TransferWebViewPage from './TransferWebViewPage'
import BaseParallaxListView, {
    STICKY_HEADER_HEIGHT,
    window,
    AVATAR_SIZE
} from '../Comp/Base/BaseParallaxListView'
import BaseListComp from '../Comp/Base/BaseListComp'
import {BlurView} from 'react-native-blur'
import BaseIoniconsBt from '../Comp/Base/BaseIoniconsBt'
import *as BizRemainingTimeView from '../Comp/BizCommonComp/BizRemainingTimeView'
import Ionicons from 'react-native-vector-icons/Ionicons';
import LogInPage from './LogInPage'
// import *as EventListener from '../Utils/EventListener/EventListener'
import *as CouponDetailPageActions from '../Redux/Actions/CouponDetailPageActions'
import CouponDetailPageModalContainer from '../Redux/Container/CouponDetailPageModalContainer'
import *as BaseModalActions from '../Redux/Actions/BaseModalActions'
import *as CouponDetailPageApi from '../NetWork/API/CouponDetailPageApi'
import MerchantDetailPage from './MerchantDetailPage'
import BasePoplist from '../Comp/Base/BasePoplist'
import AllCouponsPage from './AllCouponsPage'
import SearchPage from './SearchPage'
import *as RootNavigator from '../Root/RootNavigator'
import {arrBottomTabInfo, switchBottomTabAction} from '../Redux/Actions/RootPageAction';
import *as AllPageContainers from '../Redux/Container/AllPageContainers'


export class CouponDetailPage extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.CouponDetailPage
            });
        }

        this.setState({
                isVisibleRebateDescriptionModel: false
            }
        )
    }

    componentDidMount() {
        // Log.log('CouponDetailPage componentDidMount this.props.route.pageData='+Log.log(this.props.route.pageData));
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {

        Log.log('CouponDetailPage renderRow rowID=' + rowID);
        const {navigator, route, baseReducer, dispatch} = this.props;
        let pageData = baseReducer.AdditionalObj ? baseReducer.AdditionalObj : route.pageData

        switch (rowID) {
            case '0': {
                let title = StringOauth.isNull(pageData.translated_highlight) ? '[' + pageData.merchant.now_rate + ']' : '[' + pageData.translated_highlight + '+' + pageData.merchant.now_rate + ']';

                return <View style={{
                    height: 44, flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', marginTop: 0,
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    {/*标题*/}
                    <Text style={{
                        marginLeft: 15, marginTop: 0, fontSize: 15, color: 'rgba(255, 115,' +
                        ' 12, 1)', textAlign: "center", //lineHeight: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1}
                    >{title}</Text>
                    <Image source={ {uri: pageData.merchant.image} } style={{
                        marginLeft: 0, marginRight: 0,
                        width: 140, height: 30,
                        alignSelf: 'center', resizeMode: 'contain',
                        //borderColor: Colors.getRandomColor(),
                        //borderWidth: 0.5,
                        //backgroundColor: Colors.getRandomColor()
                    }}/>
                    { BizViews.renderShadowLine({
                        position: 'absolute',
                        bottom: 0.0,
                        left: 15,
                        right: 15,
                        height: 0.5,
                        borderWidth: 0.0,
                        shadowOffset: {width: 0.0, height: 0.0},
                        backgroundColor: '#E4E4E4'
                    })}
                </View>
            }
                break;
            case '1': {
                // pageData.translated_name = '优惠信息优惠信息优惠信息优惠信息优惠信息优惠信息优惠信息优惠信息优惠信息'
                let codeTitle = '优惠码:' + pageData.code;
                let transfers = '已有' + pageData.merchant.transfers + '人使用';

                return <View style={{
                    flex: 1,
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    {/*优惠信息*/}
                    <Text style={{
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 15,
                        fontSize: 14,
                        color: Colors.BizCommonBlack,
                        textAlign: "left",
                        lineHeight: 18,
                        //backgroundColor: Colors.getRandomColor()
                    }}
                    >{pageData.translated_name}</Text>
                    {/*优惠码*/}
                    {
                        pageData.code ? <BaseTitleBt
                                //key={rowData}
                                btStyle={{
                                    width: 140,
                                    height: 32,
                                    alignItems: 'center',
                                    marginLeft: 15,
                                    marginTop: 10,
                                    justifyContent: 'center',
                                    borderWidth: 0.5,
                                    borderColor: 'rgba(67, 187, 78, 1)',
                                    borderRadius: 4,
                                    backgroundColor: Colors.white,
                                }}
                                onPress={ () => {
                                    //this.onShopping();
                                } }
                                textStyle={{
                                    fontSize: 12,
                                    color: 'rgba(54, 166, 66, 1)', marginLeft: 0,
                                    //backgroundColor: Colors.getRandomColor()
                                }}
                                title={codeTitle}
                                disabled={false}
                            >
                            </BaseTitleBt> : null
                    }

                    {/*底部 包含 倒计时的 容器view*/}
                    <View style={{
                        marginTop: 15, marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between',
                        //backgroundColor:Colors.getRandomColor()
                    }}>
                        {/*倒计时icon+倒计时text的背景view*/}
                        <View style={{
                            //flex:1.5,
                            flexDirection: 'row', height: 15, justifyContent: 'flex-start',
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            {/*倒计时icon*/}
                            <Image source={require('../Img/common_list_icon_time.png')}
                                   style={{
                                       width: 14, height: 14, marginLeft: 15,
                                       //backgroundColor:Colors.getRandomColor()
                                   }}/>
                            {/*倒计时时间*/}
                            {BizRemainingTimeView.renderBizRemainingTimeView(pageData.now, pageData.expired_at, {color: Colors.red}, {color: Colors.red}, {color: Colors.red}, {color: Colors.red}, {color: Colors.red})}

                        </View>
                        {/*已有xx人使用*/}
                        <Text style={{
                            marginRight: 15, marginTop: 0, fontSize: 12, color: '#888888', textAlign: "center",
                            //ackgroundColor: Colors.getRandomColor()
                        }}
                        >{transfers}</Text>
                    </View>
                    { BizViews.renderShadowLine({
                        //position: 'absolute', bottom:0.0, left:15, right:15,
                        marginTop: 15,
                        marginLeft: 15,
                        marginRight: 15,
                        height: 0.5,
                        borderWidth: 0.0,
                        shadowOffset: {width: 0.0, height: 0.0},
                        backgroundColor: '#E4E4E4'
                    })}
                    {/*restrictions 横线以下的 内容*/}
                    <Text style={{
                        fontSize: 12,
                        color: '#555555',
                        marginTop: 15,
                        marginLeft: 15,
                        marginRight: 15,
                        marginBottom: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {pageData.restrictions}
                    </Text>
                </View>
            }
                break;
            case '2'://商家介绍
            {
                return <View style={{
                    flex: 0, paddingTop: 10, //alignItems: 'center',
                    justifyContent: 'center', paddingBottom: 10, backgroundColor: Colors.BizCommonGrayBack
                }}>
                    <View style={{flex: 1, backgroundColor: Colors.white,}}>
                        <Text style={{
                            fontSize: 15, color: Colors.blackText, marginTop: 15, marginLeft: 15,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            商家介绍
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            color: '#555555',
                            marginTop: 10,
                            marginLeft: 15,
                            marginRight: 15,
                            marginBottom: 15,
                            lineHeight: 19,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            {pageData.merchant.description}
                        </Text>
                    </View>
                </View>
            }
                break;
            case '3'://返利说明 cell
            {
                return <BaseBt style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: GlobalStyles.AllMerchantPageDropDownListCellH,
                    alignItems: 'center',
                    backgroundColor: Colors.white
                }}
                               activeOpacity={0.6}
                               onPress={ () => {

                                   //显示 BaseModal 控件里的 父节点和 子节点
                                   dispatch(BaseModalActions.changeModelContainerVisiableAction(CouponDetailPageApi.CouponDetailPageModalApi.ApiName, true));
                                   dispatch(BaseModalActions.changeModalVisiableAction(CouponDetailPageApi.CouponDetailPageModalApi.ApiName, true));

                               } }
                >
                    <Text style={{
                        fontSize: 15,
                        color: Colors.blackText,
                        marginTop: 0,
                        marginLeft: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        返利说明
                    </Text>
                    {/*右箭头*/}
                    <Ionicons
                        name='ios-arrow-forward'
                        size={25} color='#E4E4E4' style={{
                        marginRight: 15,
                        backgroundColor: Colors.transparent
                    }}/>

                    { BizViews.renderShadowLine({
                        position: 'absolute', bottom: 0.0, left: 15, right: 0,
                        height: 0.5,
                        borderWidth: 0.0,
                        shadowOffset: {width: 0.0, height: 0.0},
                        backgroundColor: '#E4E4E4'
                    })}
                </BaseBt>
            }
                break;
            case '4'://商家其它优惠 cell
            {
                return <BaseBt style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: GlobalStyles.AllMerchantPageDropDownListCellH,
                    alignItems: 'center',
                    backgroundColor: Colors.white
                }}
                               activeOpacity={0.6}
                               onPress={ () => {
                                   //onPress(rowData);

                                   this.props.navigator.push({
                                       component: MerchantDetailPage,
                                       name: gRouteName.MerchantDetailPage,
                                       merchantData: pageData.merchant,
                                   });
                               } }
                >
                    <Text style={{
                        fontSize: 15,
                        color: Colors.blackText,
                        marginTop: 0,
                        marginLeft: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        商家其它优惠
                    </Text>
                    {/*右箭头*/}
                    <Ionicons
                        name='ios-arrow-forward'
                        size={25} color='#E4E4E4' style={{
                        marginRight: 15,
                        backgroundColor: Colors.transparent
                    }}/>

                    { BizViews.renderShadowLine({
                        position: 'absolute', bottom: 0.0, left: 15, right: 0,
                        height: 0.5,
                        borderWidth: 0.0,
                        shadowOffset: {width: 0.0, height: 0.0},
                        backgroundColor: '#E4E4E4'
                    })}
                </BaseBt>
            }
                break;
        }


    }

    /**
     * 外部自定义 ParallaxScrollView 要 绘制的 子控件
     * @returns {{}}
     */
    getParallaxRenderConfig() {
        let config = {};
        const {navigator, route, baseReducer} = this.props;
        let pageData = baseReducer.AdditionalObj ? baseReducer.AdditionalObj : route.pageData

        let BackgroundH = 120;//背景模糊图高,值越大, 列表下拉时, 0号cell和 背景图之间的 间距就越小
        let couponIconH = 75;//优惠图标高

        config.parallaxHeaderHeight = BackgroundH + STICKY_HEADER_HEIGHT;

        let uri = pageData.image ? pageData.image : pageData.merchant.image;

        let BlurViewProps = Platform.OS === 'ios' ? {
                blurType: "light",
                blurAmount: 5
            } : {
                viewRef: this.state.viewRef,
                downsampleFactor: 10,
                overlayColor: 'rgba(255,255,255,.1)'
            };

        config.renderBackground = () => (
            <View key="background" style={{paddingTop: 60}}>
                <Image source={ /*require('../Img/MyPageHeadrBack.jpg')*/ {uri: uri} }
                       style={{
                           width: window.width, height: BackgroundH + STICKY_HEADER_HEIGHT,
                           position: "absolute", top: 0, left: 0, right: 0
                       }}
                       resizeMode="cover">
                    {/*开了模糊,真机也卡的一逼*/}
                    {/*<BlurView {...BlurViewProps} style={{*/}
                    {/*position: "absolute",*/}
                    {/*left: 0,*/}
                    {/*right: 0,*/}
                    {/*top: 0,*/}
                    {/*width:window.width,*/}
                    {/*height: BackgroundH+STICKY_HEADER_HEIGHT,*/}
                    {/*}}/>*/}
                </Image>
                <View style={{
                    position: 'absolute',
                    top: STICKY_HEADER_HEIGHT - STICKY_HEADER_HEIGHT,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.2)',
                    height: BackgroundH + STICKY_HEADER_HEIGHT
                }}/>
            </View>
        );

        config.renderForeground = () => {
            return (
                <View key="parallax-header" style={ {
                    flex: 1,//能让前景层 完全 占满 renderBackground 画出的 控件.
                    alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', paddingTop: STICKY_HEADER_HEIGHT + 10
                    //backgroundColor:Colors.getRandomColor()
                } }>
                    <Image style={ {
                        marginBottom: 10,
                        borderRadius: 3,
                        width: couponIconH,
                        height: couponIconH
                    }} source={
                        /*require('../Img/img_default_head.png')*/
                        {uri: uri}
                    }/>
                </View>

            );
        };

        config.renderStickyHeader = () => {
            return (
                <View style={{
                    position: 'absolute',
                    top: gScreen.navBarPaddingTop,
                    left: 40,
                    right: 40,
                    height: STICKY_HEADER_HEIGHT - gScreen.navBarPaddingTop,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.transparent
                }}>
                    {<Text style={[styles.defaultTitleStyle, GlobalStyles.navBarTitleTextStyle, {color: Colors.white}]}
                           numberOfLines={1}
                    >
                        优惠详情
                    </Text>}
                </View>
                // null
                // <BaseNavigationBar
                //     style={ {backgroundColor: Colors.transparent} }
                //     statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                //     titleTextView={null}
                //     leftButton={NavBarButton.getMerchantDetailPageBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                //     title='优惠详情'
                //     rightButton={NavBarButton.getMerchantDetailRightBt(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                //     titleTextStyle={[GlobalStyles.navBarTitleTextStyle, {color:Colors.white},]}
                //     hide={false}/>

                // <View key="sticky-header" style={{
                //     height: GlobalStyles.statusBarAndNavBarH,
                //     // width: 300,
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //     //paddingTop: (Platform.OS === 'ios') ? 20 : 0,
                //     backgroundColor: Colors.getRandomColor()
                // }}>
                //
                // </View>
            );
        };

        config.renderFixedHeader = () => (
            <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: STICKY_HEADER_HEIGHT,
                backgroundColor: Colors.transparent
            }}>
                <BaseIoniconsBt
                    btStyle={{
                        position: 'absolute', left: 10, top: 28, width: 28,
                        height: 28,
                        borderRadius: 28, //marginLeft: 10,
                        backgroundColor: Colors.white
                    }}
                    iconStyle={{name: 'ios-arrow-back', iconSize: 22, iconColor: Colors.BizCommonBlack}}
                    onPress={() => baseOnBackPress(navigator, this.backAndroidEventListener)}
                />
                <BaseIoniconsBt
                    btStyle={{
                        width: 28,
                        height: 28, position: 'absolute', right: 10, top: 28, //marginRight: 10,
                        borderRadius: 28,
                        backgroundColor: Colors.white
                    }}
                    iconStyle={{name: 'ios-more', iconSize: 20, iconColor: Colors.black}}
                    onPress={() => this.BasePoplistRef.show()}
                />
            </View>

            // <BaseNavigationBar
            //     style={ {backgroundColor: Colors.white,position:'absolute',top:0, left:0, right:0, bottom:0} }
            //     statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
            //     titleTextView={null}
            //     leftButton={NavBarButton.getMerchantDetailPageBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
            //     title='优惠详情'
            //     titleTextStyle={[GlobalStyles.navBarTitleTextStyle, {},]}
            //     rightButton={NavBarButton.getMerchantDetailRightBt(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
            //     hide={false}/>
        );
        return config;
    }

    renderFooterBar() {
        return <View style={{
            flexDirection: 'row', position: 'absolute', left: 0,
            right: 0, bottom: 0, height: 50, width: GlobalStyles.window.width,
            backgroundColor: 'rgba(250, 250, 250, 1)'
        }}>
            <BaseBt
                style={{
                    width: (GlobalStyles.window.width - 265), height: 50, alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor: Colors.getRandomColor(),
                }}
                onPress={ () => {
                    //this.onShare();
                } }
            >
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    //backgroundColor:Colors.getRandomColor()
                }}>
                    <Image source={ require('../Img/common_navigation_share.png') } style={{
                        //position:'absolute',left:0, right: 0,top:0, bottom: 0,
                        width: 17, height: 17,
                        alignSelf: 'center',
                    }}>
                    </Image>
                    <Text style={{
                        fontSize: 14, color: 'rgba(136, 136, 136, 1)', marginLeft: 5,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        分享
                    </Text>
                </View>
            </BaseBt>
            <BaseTitleBt
                //key={rowData}
                btStyle={{
                    width: 265, height: 50, alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(243, 124, 34, 1)',
                }}
                onPress={ () => {
                    this.onShopping();
                } }
                textStyle={{
                    fontSize: 15,
                    color: Colors.white, marginLeft: 0,
                    //backgroundColor: Colors.getRandomColor()
                }}
                title='去购物, 拿返利'
                disabled={false}
            >
            </BaseTitleBt>

        </View>

    }

    onShopping() {
        const {navigator, route, baseReducer} = this.props;
        let pageData = baseReducer.AdditionalObj ? baseReducer.AdditionalObj : route.pageData;

        gUserDB.isLogin().then(
            (b) => {//已登录
                this.props.navigator.push({
                    component: TransferWebViewPage,
                    name: gRouteName.TransferWebViewPage,
                    merchantData: pageData.merchant
                });
            },
            (e) => {//非登录状态

                gPopBackToRouteAfteRegisterOrLoginSuceess = gRouteName.CouponDetailPage;
                gAutoPushToRouteAfteRegisterOrLoginSuceess = gRouteName.TransferWebViewPage;

                this.props.navigator.push({
                    component: LogInPage,
                    name: gRouteName.LogInPage//'

                });
            }
        ).catch((error) => {
        })


    }

    render() {
        const {navigator, route, baseReducer, dispatch} = this.props;

        let self = this;
        let pageData = baseReducer.AdditionalObj ? baseReducer.AdditionalObj : route.pageData

        return (
            <View style={{flex: 1, width: gScreen.width, backgroundColor: Colors.BizCommonGrayBack}}>
                < BaseParallaxListView
                    {...this.props}
                    customContainer={{height: gScreen.height - 60, flex: 0, paddingTop: 0,}}
                    renderRow={
                        this.renderRow
                    }
                    {
                        ...this.getParallaxRenderConfig()
                    }

                />
                {this.renderFooterBar()}
                <CouponDetailPageModalContainer
                    renderModalContent={
                        () => {
                            return <View style={{
                                backgroundColor: Colors.white,
                                width: 295,
                                paddingTop: 0, paddingLeft: 0, alignSelf: 'center',
                                //justifyContent: 'center',
                                //alignItems: 'center',
                                borderRadius: 8,
                                //borderColor: 'rgba(0, 0, 0, 0.1)',
                            }}>
                                <Text style={{
                                    textAlign: 'left', marginTop: 25,
                                    marginLeft: 15, fontSize: 15,
                                    // backgroundColor: Colors.getRandomColor()
                                }}>返利说明</Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#555555',
                                    marginTop: 15,
                                    marginLeft: 20,
                                    marginRight: 15,
                                    marginBottom: 20, lineHeight: 20,
                                    //backgroundColor: Colors.getRandomColor()
                                }}>
                                    {/*就是 商家详情页 的 返利条件*/}
                                    {pageData.merchant.restrictions
                                        //='*期望带我去的无群打网球的我的我的完全大青蛙打网球打网球订位'+'\n'+'*wefewf绯闻绯闻威风额外分为额外额外'+'\n'+'*dwdqwdqwdqwdqw废弃物分期付额废弃 '
                                    }
                                </Text>
                                <BaseIoniconsBt
                                    btStyle={{
                                        position: 'absolute', top: 5, right: 0, width: 35,
                                        height: 35,
                                        //backgroundColor: Colors.getRandomColor()
                                    }}
                                    iconStyle={{name: 'ios-close', iconSize: 35, iconColor: Colors.BizCommonBlack}}
                                    onPress={() => {
                                        dispatch(BaseModalActions.changeModalVisiableAction(CouponDetailPageApi.CouponDetailPageModalApi.ApiName, false))
                                    }}
                                />
                                {/*<TouchableOpacity onPress={*/}
                                {/*()=>{//关闭 BaseModal 的 子节点*/}
                                {/*dispatch(BaseModalActions.changeModalVisiableAction(baseReducer.ApiName,false));*/}
                                {/*}*/}
                                {/*}>*/}
                                {/*<Text>'Close'</Text>*/}
                                {/*</TouchableOpacity>*/}
                            </View>
                        }
                    }
                />
                <BasePoplist
                    ref={r => self.BasePoplistRef = r}
                    containerStyle={{top: gScreen.navBarHeight - 10}}
                    dataArr={[{id: 0, title: '首页'}, {id: 1, title: '优惠券'}, {id: 2, title: '搜索'}, {
                        id: 3,
                        title: '我的账户'
                    }]}
                    renderRow={
                        (rowData, callBack) => {
                            return (
                                <TouchableOpacity
                                    key={rowData.id}
                                    activeOpacity={0.75}
                                    style={{
                                        height: 40, width: 100,justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: 20,//borderRadius: 4,
                                        backgroundColor: Colors.transparent
                                    }}
                                    onPress={() => {
                                        callBack();//为了 close 弹出列表 控件

                                        if (rowData.id==0){

                                            //pop 到 一级页面的 跟组件
                                            RootNavigator.popToDesignatedPage(this.props.navigator,gRouteName.RootPagesContainer);

                                            InteractionManager.runAfterInteractions(() => {
                                                //实现 nav pop  完成后才回调 log 语句
                                                Log.log('CouponDetailPage popToRootPagesContainer');

                                                //主动切换 一级页面 跟组件的 tabbar
                                                dispatch(switchBottomTabAction(AllPageContainers.AllContainers.HomePageContainer.tabBarName))
                                            })

                                        }
                                        else if (rowData.id==1){
                                            this.props.navigator.push({
                                                component: AllCouponsPage,
                                                name: gRouteName.AllCouponsPage,
                                            });
                                        }else if(rowData.id==2){
                                            this.props.navigator.push({
                                                component: SearchPage,
                                                name: gRouteName.SearchPage,
                                                isInTwoLevelPage: true,
                                            });
                                        }else if(rowData.id==3){
                                            //pop 到 一级页面的 跟组件
                                            RootNavigator.popToDesignatedPage(this.props.navigator,gRouteName.RootPagesContainer);

                                            InteractionManager.runAfterInteractions(() => {
                                                //实现 nav pop  完成后才回调 log 语句

                                                //主动切换 一级页面 跟组件的 tabbar
                                                dispatch(switchBottomTabAction(AllPageContainers.AllContainers.PersonalPageContainer.tabBarName))
                                            })
                                        }
                                    }}
                                >
                                    <Text style={{
                                        color: Colors.textGray, fontSize: 13, alignSelf: 'flex-start',
                                        //backgroundColor:Colors.getRandomColor()
                                    }}>{rowData.title}</Text>
                                    {BizViews.renderShadowLine({
                                        position: 'absolute',
                                        bottom: 0.0,
                                        left: 10,
                                        right: 10,
                                        height: 0.5,
                                        borderWidth: 0.0,
                                        shadowOffset: {width: 0.0, height: 0.0},
                                        backgroundColor: 'rgba(95, 95, 95, 1)'
                                    })}
                                </TouchableOpacity>
                            )
                        }
                    }
                />

            </View>
        );
    }
}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {CouponDetailPageListReducer}=state;
    return {baseReducer: CouponDetailPageListReducer};
}
export default connect(mapStateToProps)(CouponDetailPage);