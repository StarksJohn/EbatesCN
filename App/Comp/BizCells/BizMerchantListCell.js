/**
 * Created by Ebates on 17/2/15.
 *
 * BizMerchantListCell 商家列表的cell
 */
import React, {Component, PropTypes} from 'react';
import {
    View, Text, Image
} from 'react-native';
import Colors from '../../Utils/Colors'
import *as BizViews from '../BizCommonComp/BizViews'
import *as Math from '../../Utils/Math'
import GlobalStyles from '../../Global/GlobalStyles'
import BaseBt from '../Base/BaseBt'
import *as StringOauth from '../../Utils/StringUtils/StringOauth'

export function RenderBizMerchantListCell(rowData, sectionID, rowID, highlightRow, callback, paddingTop) {

    // Log.log('BizMerchantListCell renderBizMerchantListCell rowData==' + Log.writeObjToJson(rowData));
    // let str='rowID  '+rowID;
    // let uri={uri:  'http://extrabux-static.b0.upaiyun.com/images/merchants/1912.jpg'}

    /* "* 使用iPhones、 iPads下单，无法获得返利。
     ↵* 购买礼品卡，Nike Air Foamposite， Lunarglide 6，Jordan，Kobe，Durant，Under Armour Curry， Lebron/Yeezy系列等无返利。" */

    //美工约定的左图的尺寸
    let logoW = 112;
    let logoH = 24;
    let nowRate = rowData.now_rate + ' ';
    let wasRate = rowData.wasRate;
    return (
        <BaseBt
            style={ {
                flex: 1, paddingTop: paddingTop, paddingBottom: 5,
                //backgroundColor: Colors.getRandomColor()
            }}
            //underlayColor={/*Colors.blackTranslucent*/ this.props.selectColor}
            activeOpacity={0.6}
            disabled={false}
            onPress={ () => {
                callback(rowData);
            } }
        >
            {/*横线上边的view*/}
            <View style={{
                flexDirection: 'row-reverse',//先画右边的 ,能让左边的 logo背景 盖住 右边标签的 竖线
                backgroundColor: Colors.white
            }}>
                {/*右边 的title等View*/}
                <View style={{
                    marginLeft: 0, marginRight: 15, marginBottom: 10,
                    /*marginRight: 250*/ width: GlobalStyles.window.width - 15 - logoW - 15,
                    overflow: 'hidden',
                    //height: Math.randomNums(60, 100),
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    {/*标题*/}
                    <Text style={{
                        marginLeft: 10,
                        marginTop: 15, fontSize: 15, color: 'rgba(64, 64,' +
                        ' 64, 1)',
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1} textAlign="center" textDecorationLine="underline"
                          textDecorationStyle="dashed" textDecorationColor={Colors
                        .getRandomColor()}
                    >{rowData.name}</Text>
                    <Text style={{
                        marginLeft: 10,
                        marginTop: 10,
                        fontSize: 15,
                        color: 'rgba(255, 155,' +
                        ' 12, 1)',
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1} textAlign="center"
                    >{nowRate}
                        <Text style={{
                            fontSize: 10, marginLeft: 10, color: Colors.textGray,
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                            textDecorationColor: Colors.textGray,
                            //backgroundColor: Colors.getRandomColor()
                        }} textDecorationStyle="dashed" textDecorationColor={Colors
                            .getRandomColor()} textAlign="center"
                        >{wasRate}</Text>
                    </Text>
                    {renderMark(rowData)}
                </View>
                {/*logo的背景*/}
                <View style={{
                    marginLeft: 0, marginRight: -1/*盖住 每行标签的第一个竖线*/, width: logoW, justifyContent: 'center',
                    backgroundColor: Colors.white//白色为了盖住右边的竖线
                }}>
                    {/*logo 用 www.ebates.com 里的logo,,宽高和美工约定好了,服务器发的是280x80 左右 的,如 https://www.ebates.com/image/store/icon/8333/icon-280x80.gif   , 在 顶部到 分割线 之间 上下居中*/}
                    <Image source={ {uri: rowData.image} } style={{
                        marginLeft: 0, marginRight: 0,
                        width: logoW, height: logoH,
                        alignSelf: 'center', resizeMode: 'contain',
                        //borderColor: Colors.getRandomColor(),
                        //borderWidth: 0.5,
                        //backgroundColor: Colors.getRandomColor()
                    }}/>
                </View>
            </View>
            {/*圆圈*/}
            {renderBadge(rowData, rowID)}
            {/*横线下边的view*/}
            {renderCouponMsgView(rowData)}
        </BaseBt>
    );

}

function renderBadge(rowData, rowID) {
    if (rowData.isInTopTenList) {
        let backColor = null;
        let textColor = Colors.white;
        let borderColor = null;
        let borderWidth = 0;
        switch (rowID) {
            case '2': {
                backColor = '#F4AC00'
            }
                break;
            case '3': {
                backColor = '#A5A5A5'
            }
                break;
            case '4': {
                backColor = '#BD9A69'
            }
                break;
            default: {
                backColor = Colors.white;
                textColor = '#888888',
                    borderColor = '#BDBDBD';
                borderWidth = 0.5;
            }
                break;
        }
        return BizViews.renderBadge({
            position: 'absolute',
            left: 10, top: 30, width: 20, height: 20, borderRadius: 20, borderColor: borderColor,
            borderWidth: borderWidth,
            backgroundColor: backColor
        }, {fontSize: 12, color: textColor}, rowID - 1);
    } else {
        return null;
    }
}

/**
 * 画 优惠 view
 */
function renderCouponMsgView(rowData) {
    // let nums = Math.randomNums(1, 2);//模拟 [1,2] 条 优惠信息
    let arr = rowData.hotCoupons ? rowData.hotCoupons.data : [];//
    // for (let i = 0; i < nums; i++) {
    //     arr.push('优惠信息优惠信息优惠信息优惠信息优惠信息优惠信息优惠信息优惠');
    // }
    if (arr.length == 0) {
        return (
            null
        );
    }
    let content = arr.map((v, i) => {

        return (

            // 一行优惠信息view
            <View key={i}
                  style={{
                      flexDirection: 'row',
                      marginLeft: 15,
                      marginRight: 15,
                      paddingTop: 5, paddingBottom: 5,
                      //height: 12,
                      //backgroundColor: Colors.getRandomColor()
                  }}>
                <Text key='textRef' style={{
                    //width: 24, height: 13,
                    paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2,
                    fontSize: 9, color: Colors.white, textAlign: "center",
                    //lineHeight: 10, height: 10,
                    backgroundColor: 'rgba(67, 187, 78, 1)'
                }} numberOfLines={1} //textAlign="center"
                >
                    优惠
                </Text>
                <Text style={{
                    width: GlobalStyles.window.width - 30 - 24 - 5,
                    marginLeft: 5, fontSize: 12, color: 'rgba(136,' +
                    ' 136,' +
                    ' 136, 1)',
                    //lineHeight: 13, height: 12,
                    //backgroundColor: Colors.white
                }} numberOfLines={1} textAlign="center"
                >{v.chinese_name}</Text>
            </View>
        );


    });
    return (
        // 底部最大的view
        <View style={{
            //backgroundColor: Colors.getRandomColor()
        }}>
            {/*分割线*/}
            {BizViews.baseSpeLine({
                marginTop: -0.5
            })}
            <View style={{
                paddingTop: 10, paddingBottom: 10,
                backgroundColor: Colors.white
            }}>
                {content}
            </View>
        </View>
    );
}

/**
 * 话 所有 标签 view
 * @returns {XML}
 */
function renderMark(rowData) {
    let arr = [];
    if (rowData.isInTopTenList) {//只有top10 列表才 画 近两周rowData.transfers人拿到返利
        arr.push({name: '近两周' + rowData.transfers + '人拿到返利'});
    } else {
        arr = /*rowData.tags.data=*/ ['支持直邮', '接受国卡', '接受支付宝', '联名卡推荐商家', '接受', '接支', '联名卡'];
    }
    // let nums = Math.randomNums(1, arr.length);
    // let newArr = [];
    // for (let i = 0; i < nums; i++) {
    //     newArr.push(arr[i]);
    // }

    // let newArr = ['近两周66300人拿到返利'];

    let content = arr.map((v, i) => {
        return (
            <View key={i}
                  style={{
                      flexDirection: 'row',
                      height: 13,
                      marginTop: 5,
                      marginBottom: 5,// padding: 0,//overflow: 'hidden',
                      alignItems: 'center',
                      //backgroundColor: Colors.getRandomColor()
                  }} removeClippedSubviews={true}>
                {i != -1 ? BizViews.renderVerticalLine({marginLeft: -1/*左移0.1,这样 每行的第一个竖线能被 左边的logo的白色背景盖住*/}) : null}
                <Text key={v.name} style={{
                    marginLeft: rowData.isInTopTenList ? 8 : 10, marginRight: 10, fontSize: 12, color: 'rgba(136,' +
                    ' 136,' +
                    ' 136, 1)', lineHeight: 12, height: 13, padding: 0, textAlign: 'center',
                    // backgroundColor: Colors.getRandomColor()
                }} numberOfLines={1}
                >{v.name}</Text>
            </View>
        );

    });
    return (
        <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap', overflow: 'hidden',
            marginTop: 5, marginBottom: 0,
            //backgroundColor: Colors.getRandomColor()
        }} removeClippedSubviews={true}>
            {content}
        </View>
    );


}
