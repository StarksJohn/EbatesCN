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

export function RenderBizMerchantListCell(rowData, sectionID, rowID, highlightRow,callback) {

    Log.log('renderBizMerchantListCell rowID==' + rowID);
    // let str='rowID  '+rowID;

    let paddingTop = 0;
    if (rowID != 0) {
        paddingTop = 5;
    }

    return (
        <BaseBt
            style={ {flex: 1, paddingTop: paddingTop, paddingBottom: 5,}}
            //underlayColor={/*Colors.blackTranslucent*/ this.props.selectColor}
            activeOpacity={0.6}
            disabled={false}
            onPress={ () => {
                callback(rowData);
            } }
        >
            {/*横线上边的view*/}
            <View style={{
                flexDirection: 'row', backgroundColor: Colors.white
            }}>
                {/*用 www.ebates.com 里的logo,如 https://www.ebates.com/merchant_images/large/icon_ashford.gif ,宽高和美工约定好了*/}
                <Image source={ {uri: 'https://www.ebates.com/merchant_images/large/icon_ashford.gif'}} style={{
                    marginLeft: 15, width: 140, height: 30, alignSelf: 'center'/*logo 在 顶部到 分割线 之间 上下居中*/,
                    //backgroundColor: Colors.getRandomColor()
                }}/>
                {/*右边 的title等View*/}
                <View style={{
                    marginLeft: 0, marginBottom: 10,
                    /*marginRight: 250*/ width: GlobalStyles.window.width - 15 - 140 - 15,
                    //height: Math.randomNums(60, 100),
                    backgroundColor: Colors.getRandomColor()
                }}>
                    <Text style={{
                        marginLeft: 10,
                        marginTop: 20, fontSize: 15, color: 'rgba(64, 64,' +
                        ' 64, 1)',
                        backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1} textAlign="center" textDecorationLine="underline"
                          textDecorationStyle="dashed" textDecorationColor={Colors
                        .getRandomColor()}
                    >标题标题标题标题标题标题标题标题标题标题标题标题标题</Text>
                    <Text style={{
                        marginLeft: 10,
                        marginTop: 10, fontSize: 15, color: 'rgba(255, 155,' +
                        ' 12, 1)',
                        backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1} textAlign="center" textDecorationLine="underline"
                          textDecorationStyle="dashed" textDecorationColor={Colors
                        .getRandomColor()}
                    >返利5.5%</Text>
                    {renderMark()}
                </View>

            </View>
            {/*横线下边的view*/}
            {renderCouponMsgView()}
        </BaseBt>
        // <View style={{
        //     flex: 1, paddingTop: paddingTop, paddingBottom: 5,
        //     //backgroundColor: Colors.getRandomColor()
        // }}>
        //
        // </View>
    );

}

/**
 * 画 优惠 view
 */
function renderCouponMsgView() {
    let nums = Math.randomNums(1, 2);//模拟 [1,2] 条 优惠信息
    let arr = [];
    for (let i = 0; i < nums; i++) {
        arr.push('优惠信息优惠信息优惠信息优惠信息优惠信息优惠信息优惠信息优惠');
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
                    backgroundColor: Colors.white
                }} numberOfLines={1} textAlign="center"
                >{v}</Text>
            </View>
        );


    });
    return (
        // 底部最大的view
        <View style={{
            backgroundColor: Colors.white
        }}>
            {/*分割线*/}
            {BizViews.baseSpeLine({
                left: 15,
                width: GlobalStyles.window.width - 30
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
function renderMark() {
    let arr = ['支持直邮', '接受国卡', '接受支付宝', '联名卡推荐商家', '支持直邮1', '接受国卡1', '接受支付宝1', '联名卡推荐商家1'];
    // let arr = ['近两周66300人拿到返利'];

    let content = arr.map((v, i) => {

        return <Text key={v} style={{
            marginTop: 5, marginBottom: 5, marginLeft: 10, marginRight: 0, fontSize: 12, color: 'rgba(136, 136,' +
            ' 136, 1)', lineHeight: 12, height: 12,
            backgroundColor: Colors.getRandomColor()
        }} numberOfLines={1}
        >{v}</Text>
    });
    return (
        <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 5, /*width:GlobalStyles.window.width - 15 - 140 - 10 - 15,*/
            backgroundColor: Colors.getRandomColor()
        }}>
            {content}
        </View>
    );


}