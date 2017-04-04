/**
 * Created by Ebates on 2017/4/3.
 * CouponDetailPage.js 优惠详情页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform, Image, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
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
import BaseParallaxListView from '../Comp/Base/BaseParallaxListView'
import BaseListComp from '../Comp/Base/BaseListComp'

export const window = Dimensions.get('window');


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

    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {

        Log.log('CouponDetailPage renderRow rowID=' + rowID);

        // showToast('PersonalPage.renderRow  ' + '\n' + 'this.props.status==' + this.props.status);

        return <View style={{height: 100, backgroundColor: Colors.getRandomColor()}}>

        </View>

    }

    /**
     * 外部自定义 ParallaxScrollView 要 绘制的 子控件
     * @returns {{}}
     */
    getParallaxRenderConfig() {
        let config = {};

        config.renderBackground = () => (
            <View key="background">
                <Image source={require('../Img/MyPageHeadrBack.jpg')}
                       style={{width: window.width, height: 120}}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.2)',
                    height: 120
                }}/>
            </View>
        );

        config.renderForeground = () => {
            return (
                <View key="parallax-header" style={ {
                    alignItems: 'center',
                    flex: 1,
                    flexDirection: 'column',
                    paddingTop: 100
                } }>
                    <Image style={ {
                        marginBottom: 10,
                        borderRadius: 120 / 2,
                        width: 120,
                        height: 120
                    }} source={
                        require('../Img/img_default_head.png')
                    }/>
                </View>

            );
        };

        config.renderStickyHeader = () => {
            return (
                <View key="sticky-header" style={{
                    height: GlobalStyles.statusBarAndNavBarH,
                    // width: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
                    // backgroundColor: Colors.red
                }}>

                </View>

                // {/*<BaseNavigationBar*/}
                //     {/*style={ {backgroundColor: Colors.transparent} }*/}
                //     {/*statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}*/}
                //     {/*titleTextView={null}*/}
                //     {/*leftButton={NavBarButton.getMerchantDetailPageBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}*/}
                //     {/*title='优惠详情'*/}
                //     {/*rightButton={NavBarButton.getMerchantDetailRightBt(() => baseOnBackPress(navigator, this.backAndroidEventListener))}*/}
                //     {/*hide={false}/>*/}

                // <View style={{flex: 1}}>
                //     <View style={ GlobalStyles.statusBarStyle}>
                //         <StatusBar style={[GlobalStyles.statusBarStyle, {
                //             backgroundColor: Colors.appUnifiedBackColor,
                //             networkActivityIndicatorVisible: true,
                //             barStyle: 'light-content'
                //         }]}/>
                //     </View>
                //     <View key="sticky-header" style={styles.stickySection}>
                //         <Text style={styles.stickySectionText}>
                //             {this.props.pubNum}
                //         </Text>
                //     </View>
                // </View>
            );
        };

        //     (
        //
        //     <View style={{flex: 1}}>
        //         <View style={ /*styles.statusBar*/ GlobalStyles.statusBarStyle}>
        //             <StatusBar style={[GlobalStyles.statusBarStyle, {
        //                 backgroundColor: Colors.appUnifiedBackColor,
        //                 networkActivityIndicatorVisible: true,
        //                 barStyle: 'light-content'
        //             }]}/>
        //         </View>
        //         <View key="sticky-header" style={styles.stickySection}>
        //             <Text style={styles.stickySectionText}>
        //                 {this.props.status === LogStatus.LogIn ? this.props.userData.nickname : '我的'}
        //             </Text>
        //         </View>
        //     </View>
        // );

        // config.renderFixedHeader = () => (
        //     <View key="fixed-header" style={styles.fixedSection}>
        //         <Text style={styles.fixedSectionText}
        //               onPress={() => this.refs.ListView.scrollTo({x: 0, y: 0, animated: true})}>
        //             Scroll to top
        //         </Text>
        //     </View>
        // );
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