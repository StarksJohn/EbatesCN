/**
 * Created by Ebates on 17/3/13.
 * 商家详情页 MerchantDetailPage
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform, Image} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import BaseListComp from '../Comp/Base/BaseListComp'
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

export class MerchantDetailPage extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.SearchResultPage
            });
        }

        // this.state = {
        //     isSelectCouponsForMerchantBt: true//是否选中了 优化及折扣按钮
        // }
    }

    componentDidMount() {

    }

    //点击 商家介绍 按钮
    onMerchantIntroduce() {

    }

    //点击 优惠及折扣 按钮
    onCouponsForMerchant() {

        if (this.props.baseReducer.AdditionalObj.isSelectCouponsForMerchantBt == false) {

            this.props.dispatch(BizApi.MerchantDetailPageApi.changeToCouponList(this.props))
            this.props.dispatch(MerchantDetailPageActions.changeIsRenderFooterViewAction(true, this.props.baseReducer.ApiName))

            this.props.dispatch(MerchantDetailPageActions.changeIsSelectCouponsForMerchantBt(true, this.props.baseReducer.ApiName))
        }

    }

    //点击 如何获得返利 按钮
    onHowtoGetTheRebate() {


        if (this.props.baseReducer.AdditionalObj.isSelectCouponsForMerchantBt) {
            this.props.dispatch(BizApi.MerchantDetailPageApi.changeToHowtoGetRebatesList(this.props))
            this.props.dispatch(MerchantDetailPageActions.changeIsRenderFooterViewAction(false, this.props.baseReducer.ApiName))

            this.props.dispatch(MerchantDetailPageActions.changeIsSelectCouponsForMerchantBt(false, this.props.baseReducer.ApiName))
        }

    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        Log.log('MerchantDetailPage renderRow rowID=' + rowID);

        if (rowID == '2' && this.props.baseReducer.$dataArray.size == 3) {//如何获得返利cell
            return <View style={{
                flex: 1, paddingBottom:15,backgroundColor: Colors.white
            }}>
                <Text style={{
                    fontSize: 15, color: '#555555', marginTop: 20, marginLeft: 15,
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    如何获得返利
                </Text>
                <View style={{
                    marginTop: 15, marginLeft: 15, width: GlobalStyles.window.width - 30, flexDirection: 'row',
                    //backgroundColor: Colors.getRandomColor()

                }}>
                    {BizViews.renderBadge({
                        width: 20, height: 20, borderRadius: 20,
                        backgroundColor: '#F1FAF3'
                    }, {fontSize: 12, color: '#36A642'},'1' )}
                    <Text style={{
                        fontSize: 13, color: '#555555', marginTop: 0, marginLeft: 10,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        点击一个Coupon或者点击按钮去购物,拿返利从Foot Locker上获取返利.
                    </Text>
                </View>
                <View style={{
                    marginTop: 15, marginLeft: 15, marginRight: 15,//width: GlobalStyles.window.width - 30,
                    flexDirection: 'row',
                    //backgroundColor: Colors.getRandomColor()

                }}>
                    {BizViews.renderBadge({
                        width: 20, height: 20, borderRadius: 20,
                        backgroundColor: '#F1FAF3'
                    }, {fontSize: 12, color: '#36A642'},'2' )}
                    <Text style={{
                        fontSize: 13, color: '#555555', marginTop: 0, marginLeft: 10,marginRight:15,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        完成您的订单. 如果您使用一个优惠券, 您的折扣将会在结账时生效.
                    </Text>
                </View>
                <View style={{
                    marginTop: 15, marginLeft: 15, marginRight: 15,//width: GlobalStyles.window.width - 30,
                    flexDirection: 'row',
                    //backgroundColor: Colors.getRandomColor()

                }}>
                    {BizViews.renderBadge({
                        width: 20, height: 20, borderRadius: 20,
                        backgroundColor: '#F1FAF3'
                    }, {fontSize: 12, color: '#36A642'},'3' )}
                    <Text style={{
                        fontSize: 13, color: '#555555', marginTop: 0, marginLeft: 10,marginRight:15,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        您的返利将在1-7天内加至您的Ebates.cn账户.
                    </Text>
                </View>
                <Text style={{
                    fontSize: 15, color: '#555555', marginTop: 15, marginLeft: 15,
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    返利条件
                </Text>
                <Text style={{
                    fontSize: 13, color: '#555555', marginTop: 15, marginLeft: 15, marginRight:15,
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    {rowData.key}
                </Text>
            </View>
        }
        switch (rowID) {
            case '0': {//顶部背景图一直往下倒 商家介绍 按钮都是 0号cell
                let now_rate = rowData.now_rate + ' ';
                let nums = '近两周' + rowData.transfers + '人拿到返利';
                return (
                    <View style={{
                        alignItems: 'center', backgroundColor: Colors.white
                    }}>

                        {/*顶部背景图*/}
                        <Image source={ require('../Img/merchant_bgk.png') } style={{
                            //position:'absolute',left:0, right: 0,top:0, bottom: 0,
                            width: GlobalStyles.window.width, height: 165,
                            alignSelf: 'center', //resizeMode: 'contain',
                            //borderColor: Colors.getRandomColor(), borderWidth: 0.5,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                        </Image>
                        {/*logo背景*/}
                        <View style={{
                            position: 'absolute',
                            top: 110,
                            left: GlobalStyles.window.width / 2 - 180 / 2,
                            width: 180,
                            height: 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: Colors.borderColor,
                            borderRadius: 4,
                            borderWidth: 0.5,
                            backgroundColor: Colors.white
                        }}>
                            <Image source={ {uri: rowData.image} } style={{
                                //position:'absolute',left:0, right: 0,top:0, bottom: 0,
                                width: 140, height: 30,
                                resizeMode: 'contain',
                                //borderColor: Colors.getRandomColor(), borderWidth: 0.5,
                                //backgroundColor: Colors.getRandomColor()
                            }}>
                            </Image>
                        </View>
                        {/*UI定的, 有标语的显示标语 没有的显示商家名*/}
                        <Text style={{
                            fontSize: 15, color: Colors.BizCommonBlack, marginTop: 30,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            { StringOauth.isNull(rowData.slogan) ? rowData.name : rowData.slogan}
                        </Text>
                        {/*如果你是VIP用户 我们有些商家针对VIP有特殊的返利,即 VIP专享, 没有VIP专享的就是普通的返利多少*/}
                        <Text style={{
                            marginTop: 10,
                            fontSize: 20,
                            color: Colors.orange,
                            //backgroundColor: Colors.getRandomColor()
                        }} numberOfLines={1} textAlign="center"
                        >{now_rate}
                            <Text style={{
                                fontSize: 12, marginLeft: 10, color: Colors.textGray,
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                                textDecorationColor: Colors.textGray,
                                //backgroundColor: Colors.getRandomColor()
                            }} textDecorationStyle="dashed" textDecorationColor={Colors
                                .getRandomColor()} textAlign="center"
                            >{rowData.wasRate}</Text>
                        </Text>
                        {/*近2周xx人...*/}
                        <Text style={{
                            fontSize: 12, color: 'rgba(136,' +
                            ' 136,' +
                            ' 136, 1)', marginTop: 10,
                            //backgroundColor: Colors.getRandomColor()
                        }} numberOfLines={1}
                        >{nums}</Text>
                        {/*标签背景*/}
                        <MerchantDetailPageMarkGridViewContainer
                            items={rowData.tags ? rowData.tags.data : [{name: "接受国卡"}, {name: '接受PayPal'}, {name: '支持直邮'}, /*{name: '联名卡推荐商家'}, {name: '接受支付宝'}, {name: '支持中文'}, {name: '最高返利保障'}*/]}
                        >
                        </MerchantDetailPageMarkGridViewContainer>
                        {/*商家介绍按钮*/}
                        <BaseTitleBt
                            //key={rowData}
                            btStyle={[{
                                width: GlobalStyles.window.width,
                                height: 44,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                //backgroundColor: Colors.getRandomColor(),
                            }]}
                            onPress={() => this.onMerchantIntroduce(rowData.description)}
                            textStyle={{
                                fontSize: 15,
                                color: 'rgba(85, 85, 85, 1)', marginLeft: 15,
                                //backgroundColor: Colors.getRandomColor()
                            }}
                            title='商家介绍'
                            disabled={false}
                        >
                            <FontAwesomeIcon name='angle-right' size={24} color='rgba(189, 189, 189, 1)'
                                             style={{marginRight: 15}}/>
                        </BaseTitleBt>
                    </View>
                );
            }
                break;
            case '1'://优惠及折扣cell
            {
                Log.log('画 优惠及折扣cell')
                let self = this;
                return (
                    <View style={{
                        flexDirection: 'row', width: GlobalStyles.window.width,
                        height: 44, marginTop: 10,//alignItems: 'center',
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        <BaseTitleBt
                            key={0}
                            ref={(r) => {
                                this.CouponsForMerchantBtRef = r;
                            }}
                            btStyle={[{
                                flex: 1, height: 44,
                                //borderRadius: 4, margin: 5, ,
                                alignItems: 'center',
                                justifyContent: 'center',
                                //backgroundColor: Colors.getRandomColor(),
                            }]}
                            onPress={() => this.onCouponsForMerchant()}
                            textStyle={{
                                fontSize: 14,
                                //fontWeight: 'bold',
                                color: self.props.baseReducer.AdditionalObj.isSelectCouponsForMerchantBt ? Colors.appUnifiedBackColor : Colors.allNavTitleColor,
                            }}
                            title='优惠及折扣'
                            disabled={false}
                        >
                            {/*横线*/}
                            <View style={{
                                width: 70,
                                height: 1,
                                marginTop: 5,
                                backgroundColor: self.props.baseReducer.AdditionalObj.isSelectCouponsForMerchantBt ? Colors.appUnifiedBackColor : Colors.transparent
                            }}>
                            </View>
                            {BizViews.renderShadowLine({position: 'absolute', bottom: 0.1, left: 0, right: 0})}
                        </BaseTitleBt>
                        <BaseTitleBt
                            key={1}
                            ref={(r) => {
                                this.HowtoGetTheRebateBt = r;
                            }}
                            btStyle={[{
                                flex: 1, height: 44,
                                //borderRadius: 4, margin: 5, height: 45,
                                alignItems: 'center',
                                justifyContent: 'center',
                                //backgroundColor: Colors.getRandomColor(),
                            }]}
                            onPress={() => this.onHowtoGetTheRebate()}
                            textStyle={{
                                fontSize: 14, //fontWeight: 'bold',
                                color: !self.props.baseReducer.AdditionalObj.isSelectCouponsForMerchantBt ? Colors.appUnifiedBackColor : Colors.allNavTitleColor,
                            }}
                            title='如何获得返利'
                            disabled={false}
                        >
                            {/*横线*/}
                            <View style={{
                                width: 85,
                                height: 1,
                                marginTop: 5,
                                backgroundColor: !self.props.baseReducer.AdditionalObj.isSelectCouponsForMerchantBt ? Colors.appUnifiedBackColor : Colors.transparent
                            }}>
                            </View>
                            {BizViews.renderShadowLine({position: 'absolute', bottom: 0.1, left: 0, right: 0})}
                        </BaseTitleBt>
                    </View>
                );

            }
                break;

            default://优惠cell
            {
                let paddingTop = 5;
                if (rowID == 2) {
                    paddingTop = 0;
                }
                return BizCouponListCell.RenderBizCouponListCell(rowData, sectionID, rowID, highlightRow, paddingTop, (rowData) => {
                    Log.log('CouponListComp renderRow callback rowData==' + rowData);
                });
            }
                break
        }
    }

    onShare() {

    }

    onCollect() {

    }

    onShopping() {
        this.props.navigator.push({
            component: TransferWebViewPage,
            name: gRouteName.TransferWebViewPage,
            merchantData:this.props.route.merchantData
        });
    }

    //画底部的bar
    renderFooterBar() {
        return <View style={{
            flexDirection: 'row', position: 'absolute', left: 0,
            right: 0, bottom: 0, height: 50, width: GlobalStyles.window.width,
            backgroundColor: 'rgba(250, 250, 250, 1)'
        }}>
            <BaseBt
                style={{
                    width: (GlobalStyles.window.width - 150) / 2, height: 50, alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor: Colors.getRandomColor(),
                }}
                onPress={ () => {
                    this.onShare();
                } }
            >
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    //backgroundColor:Colors.getRandomColor()
                }}>
                    <Image source={ require('../Img/common_bkg_error.png') } style={{
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
            <BaseBt
                style={{
                    width: (GlobalStyles.window.width - 150) / 2, height: 50, alignItems: 'center',
                    justifyContent: 'center',
                    //backgroundColor: Colors.getRandomColor(),
                }}
                onPress={ () => {
                    this.onCollect();
                } }
            >
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    //backgroundColor:Colors.getRandomColor()
                }}>
                    <FontAwesomeIcon name='star-o' size={17} color='rgba(189, 189, 189, 1)'/>

                    <Text style={{
                        fontSize: 14, color: 'rgba(136, 136, 136, 1)', marginLeft: 5,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        收藏
                    </Text>
                </View>
            </BaseBt>
            {/*顶部横线*/}
            {BizViews.renderShadowLine({
                position: 'absolute',
                top: 0.0,
                left: 0,
                right: 0,
                shadowColor: Colors.transparent,
                height: 0.1,
                borderWidth: .4
            })}
            <BaseTitleBt
                //key={rowData}
                btStyle={{
                    width: 150, height: 50, alignItems: 'center',
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

            {/*竖线*/}
            {BizViews.renderShadowLine({
                position: 'absolute',
                top: 0,
                left: (GlobalStyles.window.width - 150) / 2,
                bottom: 0, shadowColor: Colors.transparent,
                height: 50, width: 0.5, borderWidth: .5
            })}
        </View>

    }

    render() {
        const {navigator} = this.props;

        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.transparent} }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                leftButton={NavBarButton.getMerchantDetailPageBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                rightButton={NavBarButton.getMerchantDetailRightBt(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                hide={false}/>;

        return (
            <View style={[GlobalStyles.pageContainer, {backgroundColor: Colors.BizCommonGrayBack}]}>
                <BaseListComp
                    {...this.props }
                    customContainer={{position: "absolute", top: 0, bottom: 50, left: 0, right: 0}}
                    renderRow={
                        this.renderRow
                    }
                />
                {navigationBar}
                {this.renderFooterBar()}
            </View>
        );
    }

}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {MerchantDetailPageReducer}=state;
    return {baseReducer: MerchantDetailPageReducer};
}
export default connect(mapStateToProps)(MerchantDetailPage);