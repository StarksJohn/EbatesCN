/**
 * Created by Ebates on 2017/4/3.
 * CouponDetailPage.js 优惠详情页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform, Image, Dimensions,Animated} from 'react-native';
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
import BaseParallaxListView,{
    STICKY_HEADER_HEIGHT,
    window,
    AVATAR_SIZE
} from '../Comp/Base/BaseParallaxListView'
import BaseListComp from '../Comp/Base/BaseListComp'
import {BlurView} from 'react-native-blur'
import BaseIoniconsBt from '../Comp/Base/BaseIoniconsBt'



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

        // this.state = {
        //     isSelectCouponsForMerchantBt: true//是否选中了 优惠及折扣按钮
        // }
    }

    componentDidMount() {
        // Log.log('CouponDetailPage componentDidMount this.props.route.pageData='+Log.log(this.props.route.pageData));
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {

        Log.log('CouponDetailPage renderRow rowID=' + rowID);

        // showToast('PersonalPage.renderRow  ' + '\n' + 'this.props.status==' + this.props.status);

        return <View style={{height: 100, marginTop:0,backgroundColor: Colors.getRandomColor()}}>

        </View>

    }

    /**
     * 外部自定义 ParallaxScrollView 要 绘制的 子控件
     * @returns {{}}
     */
    getParallaxRenderConfig() {
        let config = {};
        const {navigator,route} = this.props;

        let BackgroundH=120;//背景模糊图高,值越大, 列表下拉时, 0号cell和 背景图之间的 间距就越小
        let couponIconH=75;//优惠图标高

        config.parallaxHeaderHeight=BackgroundH+STICKY_HEADER_HEIGHT;

        let uri=route.pageData.image?route.pageData.image:route.pageData.merchant.image;

        let BlurViewProps=Platform.OS === 'ios' ? {
                blurType: "light",
                blurAmount: 5
            } : {
                viewRef: this.state.viewRef,
                downsampleFactor: 10,
                overlayColor: 'rgba(255,255,255,.1)'
            };

        config.renderBackground = () => (
            <View key="background" style={{paddingTop:STICKY_HEADER_HEIGHT-STICKY_HEADER_HEIGHT}}>
                <Image source={ /*require('../Img/MyPageHeadrBack.jpg')*/ {uri: uri} }
                       style={{width: window.width, height: BackgroundH+STICKY_HEADER_HEIGHT}}
                       resizeMode="cover">
                    <BlurView {...BlurViewProps} style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        width:window.width,
                        height: BackgroundH+STICKY_HEADER_HEIGHT,
                    }}/>
                </Image>
                <View style={{
                    position: 'absolute',
                    top: STICKY_HEADER_HEIGHT-STICKY_HEADER_HEIGHT,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.2)',
                    height: BackgroundH+STICKY_HEADER_HEIGHT
                }}/>
            </View>
        );

        config.renderForeground = () => {
            return (
                <View key="parallax-header" style={ {flex: 1,//能让前景层 完全 占满 renderBackground 画出的 控件.
                    alignItems: 'center', justifyContent:'center' ,
                    flexDirection: 'column',paddingTop:STICKY_HEADER_HEIGHT+10
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
                <View style={{position:'absolute',top:gScreen.navBarPaddingTop,left:40, right:40, height:STICKY_HEADER_HEIGHT-gScreen.navBarPaddingTop,
                    alignItems: 'center',
                    justifyContent:'center',backgroundColor:Colors.transparent
                }}>
                    {<Text style={[styles.defaultTitleStyle, GlobalStyles.navBarTitleTextStyle, {color:Colors.white}]}
                           numberOfLines={1}
                    >
                        全部优惠
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
            <View style={{position:'absolute',top:0,left:0, right:0, height:STICKY_HEADER_HEIGHT,
                backgroundColor:Colors.transparent
            }}>
                <BaseIoniconsBt
                    btStyle={{
                        position: 'absolute',left:10, top:28,width: 28,
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
                        height: 28,position: 'absolute', right: 10,top:28, //marginRight: 10,
                        borderRadius: 28,
                        backgroundColor: Colors.white
                    }}
                    iconStyle={{name: 'ios-more', iconSize: 20, iconColor: Colors.black}}
                    onPress={() => baseOnBackPress(navigator, this.backAndroidEventListener)}
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


    render() {
        const {navigator} = this.props;

        // let navigationBar =
        //     <BaseNavigationBar
        //         style={ {backgroundColor: Colors.transparent} }
        //         statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
        //         titleTextView={null}
        //         leftButton={NavBarButton.getMerchantDetailPageBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
        //         title='优惠详情'
        //         rightButton={NavBarButton.getMerchantDetailRightBt(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
        //         hide={false}/>;

        // return (
        //     <BaseListComp
        //         initialListSize={10}
        //         scrollRenderAheadDistance={300}
        //         renderRow={
        //             this.renderRow
        //         }
        //         renderScrollComponent={
        //             (props) => {
        //                 Log.log('CouponDetailPage ScrollComponent ')
        //                 return (
        //                     < BaseParallaxListView
        //
        //                         {
        //                             ...this.getParallaxRenderConfig()
        //                         }
        //
        //                     />
        //
        //                 );
        //
        //             }
        //         }
        //         {...this.props }
        //
        //
        //     />
        // );

        return (
            <View style={{flex: 1, backgroundColor: Colors.white}}>
                < BaseParallaxListView
                    {...this.props}
                    renderRow={
                        this.renderRow
                    }
                    {
                        ...this.getParallaxRenderConfig()
                    }

                />
            </View>
        );
    }
}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {CouponDetailPageReducer}=state;
    return {baseReducer: CouponDetailPageReducer};
}
export default connect(mapStateToProps)(CouponDetailPage);