/**
 * Created by Ebates on 17/3/17.
 * 首页 热门优惠 列表 HomePageHotCouponList
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView, Platform, Image, ScrollView, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import *as BizCouponListCell from '../BizCells/BizCouponListCell'
import *as BizApi from '../../NetWork/API/BizApi'
import Colors from '../../Utils/Colors'
import BaseListComp from '../Base/BaseListComp';
import Swiper from 'react-native-swiper'
import BaseSwiperImgView from '../Base/BaseSwiperImgView'
import Spinner from 'react-native-spinkit'
import BaseTitleBt from '../Base/BaseTitleBt'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import *as DataType from '../../Utils/DataType'
import  BaseBt from '../Base/BaseBt'
import ImageProgress from 'react-native-image-progress';
import *as BizViews from '../BizCommonComp/BizViews'
import MerchantDetailPage from '../../Pages/MerchantDetailPage'
import GlobalStyles from '../../Global/GlobalStyles'
import *as BizRemainingTimeView from '../BizCommonComp/BizRemainingTimeView'


export class HomePageHotCouponList extends Component {

    static propTypes = {
        // renderNoDataView: PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
    };

    constructor(props) {
        super(props);

    }

    onCheckAllMerchant() {

    }

    /**
     * 画 限时 返利 cell
     * @param rowData
     */
    renderFlashDealsCell(rowData) {
        // Log.log('HomePageHotCouponList renderFlashDealsCell 正在画 限时返利cell rowData=' + Log.writeObjToJson(rowData));
        return <BaseBt style={{
            paddingTop: 5, paddingBottom: 10, alignItems: 'center', marginTop: 5,
            backgroundColor: Colors.white
        }}
                       activeOpacity={0.6}
        >

            <Image source={ {uri: rowData.image_url} } style={{
                //position:'absolute',left:15, top:15, right:15,,,
                width: GlobalStyles.window_width - 30, height: 125, marginTop: 10, resizeMode: 'cover'//marginLeft: 15,
                //borderColor: Colors.getRandomColor(), borderWidth: 0.5,
                //backgroundColor: Colors.getRandomColor()
            }}>
            </Image>

            <Image source={ require('../../Img/common_icon_flashdeal.png') } style={{
                position: 'absolute', left: 25, top: 10,
                width: 60, height: 50,
                //alignSelf: 'center', //resizeMode: 'contain',
                //borderColor: Colors.getRandomColor(), borderWidth: 0.5,
                //backgroundColor: Colors.getRandomColor()
            }}>
            </Image>
            <Text style={{
                marginLeft: 15, marginRight: 15, marginTop: 10,
                fontSize: 14,
                color: Colors.BizCommonBlack, lineHeight:20
                //fontWeight:'bold',
                //backgroundColor: Colors.getRandomColor()
            }} numberOfLines={0} textAlign="center"
            >{rowData.name}
            </Text>
            {/*底部view*/}
            <View style={{
                flexDirection: 'row', width: GlobalStyles.window_width, justifyContent: 'space-between', marginTop: 5,
                marginBottom: 5, //alignItems: 'center',
                //backgroundColor: Colors.getRandomColor()
            }}>
                {/*限时返利最高*/}
                <Text style={{
                    marginLeft: 15,
                    fontSize: 15,
                    color: Colors.orange,
                    //fontWeight:'bold',
                    //backgroundColor: Colors.getRandomColor()
                }} numberOfLines={1} textAlign="center"
                >{rowData.merchant.now_rate}
                </Text>
                {/*距离过期+倒计时*/}
                <View style={{
                    flexDirection: 'row', alignItems: 'center', marginRight: 15,
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    <Text style={{
                        marginLeft: 0,
                        fontSize: 12,
                        color: Colors.textGray,
                        //fontWeight:'bold',
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1} textAlign="center"
                    >距离过期
                    </Text>
                    {BizRemainingTimeView.renderBizRemainingTimeView(rowData.now, rowData.expired_at, styles.time, styles.time, styles.time, styles.colon, styles.colon)}
                </View>
            </View>
        </BaseBt>
    }

    /**
     * 画 热门优惠 cell
     * @returns {XML}
     */
    renderHotCouponCell() {//
        return <View style={{
            height: 35, flexDirection: 'row', justifyContent: 'space-between',
            //backgroundColor: Colors.getRandomColor()
        }}>
            <Text style={{
                marginLeft: 15,
                marginTop: 15,
                fontSize: 15,
                color: Colors.BizCommonBlack,
                //fontWeight:'bold',
                //backgroundColor: Colors.getRandomColor()
            }} numberOfLines={1} textAlign="center"
            >热门优惠
            </Text>
            <BaseTitleBt
                btStyle={[{
                    flexDirection: 'row', justifyContent: 'space-between',
                    height: 35, marginTop: 0,
                    // alignItems: 'center',
                    marginRight: 15,
                    backgroundColor: Colors.transparent,
                }]}
                onPress={() => this.onCheckAllMerchant()}
                textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'rgba(136, 136, 136, 1)',
                    marginTop: 20,
                    marginRight: 5
                }}
                title='查看全部'
                disabled={false}
            >
                <FontAwesomeIcon style={{
                    marginTop: 18,
                    //backgroundColor: Colors.getRandomColor()
                }} name='angle-right' size={16} color='rgba(136, 136, 136, 1)'/>
            </BaseTitleBt>
        </View>
    }

    /**
     * 当前控件的cell的自定义绘制
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param highlightRow
     * @returns {XML}
     */
    renderRow = (rowData, sectionID, rowID, highlightRow) => {

        Log.log('HomePageHotCouponList renderRow rowID==' + rowID);

        if (rowID == '0') {//画 轮播图 cell
            if (DataType.isString(rowData)) {//接口未拿到数据
                return <View style={{height: 175, alignItems: 'center', justifyContent: 'center'}}>
                    <Spinner style={{
                        //backgroundColor: Colors.white
                    }} isVisible={true} size={25}
                             color={Colors.backPopBtColor}
                             type='FadingCircle'//'FadingCircleAlt'//'FadingCircle'//'Circle'//CircleFlip
                        // 圆圈反转//Bounce 圆圈大小缩放
                        //'rgba(136, 136, 136, 1)'
                    />
                </View>
            } else if (DataType.isArray(rowData)) {
                return <BaseSwiperImgView containerStyle={{
                    //backgroundColor: Colors.white
                } } height={175} imgList={rowData.map(
                    (v, i) => {
                        return v.image;
                    }
                )} renderLoadingView={
                    () => {
                        Log.log('HomePageHotCouponList renderRow 正在画 轮播图的 loadingView')
                        return <Spinner style={{
                            //backgroundColor: Colors.white
                        }} isVisible={true} size={25}
                                        color={Colors.backPopBtColor}
                                        type='FadingCircle'//'FadingCircleAlt'//'FadingCircle'//'Circle'//CircleFlip
                            // 圆圈反转//Bounce 圆圈大小缩放
                            //'rgba(136, 136, 136, 1)'
                        />
                    }
                }
                >
                </BaseSwiperImgView>
            }
        } else if (rowID == '1') {//加倍返利商家cell
            let content = null;
            if (DataType.isString(rowData)) {
                // Log.log('HomePageHotCouponList renderRow rowData==' + rowData);
                content = <Spinner style={{
                    marginTop: 40, alignSelf: 'center',
                    //backgroundColor: Colors.getRandomColor()
                }} isVisible={true} size={25}
                                   color={Colors.backPopBtColor}
                                   type='FadingCircle'//'FadingCircleAlt'//'FadingCircle'//'Circle'//CircleFlip
                    // 圆圈反转//Bounce 圆圈大小缩放
                    //'rgba(136, 136, 136, 1)'
                />;
            } else if (DataType.isArray(rowData)) {
                // Log.log('HomePageHotCouponList renderRow rowData==' + rowData);
                let self = this;
                content = <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal={true}
                    style={{
                        backgroundColor: Colors.white
                    }}
                >
                    <View style={{
                        flexDirection: "row",
                        //alignItems: "center",
                        paddingBottom: 25,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {
                            rowData.map((item, i) => {
                                {/*Log.log('HomePageHotCouponList renderRow item=' + Log.writeObjToJson(item))*/
                                }
                                return (
                                    <BaseBt key={i} style={{
                                        alignItems: 'center', borderRadius: 0, width: 150, height: 75, marginTop: 15,
                                        //backgroundColor: Colors.getRandomColor()
                                    }} onPress={() => {
                                        Log.log('item==' + item);
                                        self.props.navigator.push({
                                            component: MerchantDetailPage,
                                            name: gRouteName.MerchantDetailPage,
                                            merchantData: item,
                                        });
                                    }}>
                                        <ImageProgress
                                            key={item.image}
                                            source={{uri: item.image}}
                                            //indicator={Progress.Bar} 不选此属性,默认用 系统菊花,因 此第三方库估计没适配最新的rn 版本
                                            style={
                                                {
                                                    width: 112,
                                                    height: 24,
                                                    marginTop: 1,
                                                    //backgroundColor: Colors.getRandomColor()
                                                }
                                            }
                                            onLoaded={() => {
                                                //showToast('ImageProgress onLoaded')
                                            }}
                                        />
                                        <Text style={{
                                            fontSize: 11,
                                            color: "rgba(85, 85, 85, 1)",
                                            marginTop: 13
                                        }}>{item.slogan}</Text>
                                        <Text style={{
                                            marginLeft: 0,
                                            marginTop: 5,
                                            fontSize: 13,
                                            color: 'rgba(255, 115,' +
                                            ' 12, 1)',
                                            //backgroundColor: Colors.getRandomColor()
                                        }} numberOfLines={1} textAlign="center"
                                        >{item.now_rate}
                                            <Text style={{
                                                fontSize: 11, marginLeft: 5, color: Colors.textGray,
                                                textDecorationLine: 'line-through',
                                                textDecorationStyle: 'solid',
                                                textDecorationColor: Colors.textGray,
                                                //backgroundColor: Colors.getRandomColor()
                                            }} textDecorationStyle="dashed" textDecorationColor={Colors
                                                .getRandomColor()} textAlign="center"
                                            >{rowData.was_rate}</Text>
                                        </Text>
                                        {BizViews.renderShadowLine({
                                            position: 'absolute', top: 0, right: 0, height: 75, borderWidth: 0.3,
                                        })}
                                    </BaseBt>
                                );
                            })
                        }
                    </View>
                </ScrollView>;
            }

            return <View style={{
                height: 150, paddingBottom: 5, //backgroundColor: Colors.white
            }}>
                <View style={{
                    height: 35, flexDirection: 'row', justifyContent: 'space-between',
                    backgroundColor: Colors.white
                }}>
                    <Text style={{
                        marginLeft: 15,
                        marginTop: 18,
                        fontSize: 15,
                        color: Colors.BizCommonBlack,
                        //fontWeight:'bold',
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1} textAlign="center"
                    >加倍返利商家
                    </Text>
                    <BaseTitleBt
                        btStyle={[{
                            flexDirection: 'row', justifyContent: 'space-between',
                            height: 35, marginTop: 0,
                            // alignItems: 'center',
                            marginRight: 15,
                            //backgroundColor: Colors.getRandomColor(),
                        }]}
                        onPress={() => this.onCheckAllMerchant()}
                        textStyle={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: 'rgba(136, 136, 136, 1)',
                            marginTop: 20,
                            marginRight: 5
                        }}
                        title='查看全部'
                        disabled={false}
                    >
                        <FontAwesomeIcon style={{
                            marginTop: 18,
                            //backgroundColor: Colors.getRandomColor()
                        }} name='angle-right' size={16} color='rgba(136, 136, 136, 1)'/>
                    </BaseTitleBt>
                </View>
                {content}
            </View>
        } else if (rowID == '2') {//限时返利|热门优惠 cell
            if (BizApi.HomePageHotCouponListApi.isFlashDealsApiOk) {//画 限时返利 cell
                return this.renderFlashDealsCell(rowData);
            } else {//画 热门优惠 cell
                return this.renderHotCouponCell();
            }
        } else if (BizApi.HomePageHotCouponListApi.isFlashDealsApiOk && rowID == '3') {//画 热门优惠 cell
            return this.renderHotCouponCell();
        } else if (( BizApi.HomePageHotCouponListApi.isHotCouonListApiOK && rowID == this.props.baseReducer.$dataArray.toJS().length - 2)) {//查看更多cell
            return <BaseTitleBt
                btStyle={[{
                    marginTop: 5, height: 45, justifyContent: 'center',
                    alignItems: 'center', marginBottom: 10
                    //backgroundColor: Colors.getRandomColor(),
                }]}
                onPress={() => this.onCheckAllMerchant()}
                textStyle={{
                    fontSize: 15,
                    color: 'rgba(85, 85, 85, 1)',
                    //backgroundColor: Colors.getRandomColor()
                }}
                title='查看更多'
                disabled={false}
            >
            </BaseTitleBt>
        } else if (( BizApi.HomePageHotCouponListApi.isHotCouonListApiOK && rowID == this.props.baseReducer.$dataArray.toJS().length - 1)) {//底部留白cell
            return BizViews.renderBottomTabbarBackView();
        } else {// 优惠cell
            let paddingTop = 5;

            return BizCouponListCell.RenderBizCouponListCell(rowData, sectionID, rowID, highlightRow, paddingTop, (rowData) => {
                Log.log('CouponListComp renderRow callback rowData==' + rowData);
            });
        }

    }


    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    initialListSize={5}
                    scrollRenderAheadDistance={300}
                    renderRow={
                        this.renderRow
                    }
                    renderNoDataView={(props) => {
                        return <View style={{
                            height: 175,
                            backgroundColor: Colors.getRandomColor()
                        }}>

                        </View>;
                    }
                    }
                />
            </View>

        );
    }

}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {HomePageHotCouponListReducer}=state;
    return {baseReducer: HomePageHotCouponListReducer};
}
export default connect(mapStateToProps)(HomePageHotCouponList);

const styles = StyleSheet.create({
    time: {
        paddingHorizontal: 3,
        backgroundColor: 'rgba(85, 85, 85, 1)',
        fontSize: 12,
        color: Colors.white,
        marginHorizontal: 3,
        borderRadius: 2,
    },
    //冒号
    colon: {
        fontSize: 12, color: 'rgba(85, 85, 85, 1)'
    }
});