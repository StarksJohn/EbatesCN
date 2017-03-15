/**
 * Created by Ebates on 17/2/15.
 * 优惠列表的cell
 * BizCouponListCell
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

export function RenderBizCouponListCell(rowData, sectionID, rowID, highlightRow, paddingTop, callback) {

    Log.log('RenderBizCouponListCell rowID==' + rowID);
    Log.log('RenderBizCouponListCell rowData==' + Log.writeObjToJson(rowData));

    // let str='rowID  '+rowID;

    // let paddingTop = 0;
    // if (rowID != 0) {
    //     paddingTop = 5;
    // }

    //右边所有文字的背景view 的 宽
    let rightBigViewW = GlobalStyles.window.width - 15 - 75 - 15 - 15;

    let arrMerchaintName = ['Amazon.com', 'Amazon.co.jp(亚马逊日本)', 'Amazon.de(亚马逊德国)', 'Amazon.uk(英国亚马逊)'];
    let arrTime = ['01/01/2017后过期', '00:41:55', '2天后过期']
    let name = rowData.merchant ? rowData.merchant.name : '';//arrMerchaintName[Math.randomNums(0, arrMerchaintName.length
    // - 1)];
    let time = arrTime[Math.randomNums(0, arrTime.length - 1)];//rowData.end_date;


    // let msg='用户信息';
    // let nums=Math.randomNums(1,5 );
    // for (let i=0;i<nums;i++){
    //     msg=msg+msg;
    // }

    return (
        // 最大的白view
        <BaseBt
            style={ {flex: 1, paddingTop: paddingTop, paddingBottom: 5,}}
            //underlayColor={/*Colors.blackTranslucent*/ this.props.selectColor}
            activeOpacity={0.6}
            disabled={false}
            onPress={ () => {
                callback(rowData);
            } }
        >
            {/*logo和右边view的背景*/}
            <View style={{
                flexDirection: 'row',
                backgroundColor: Colors.white
            }}>
                {/*左logo*/}
                <Image source={ {uri: rowData.image}} style={{
                    marginLeft: 15, marginTop: 20, marginBottom: 20, width: 75, height: 75,
                    borderColor: Colors.getRandomColor(), borderWidth: 0.5
                    //backgroundColor: Colors.getRandomColor()
                }}/>
                {/*右边所有文字的背景view*/}
                <View style={{
                    marginTop: 20 - 3,//因标题Text的内容上下有点空白,故往上移点,能让Text的内容和左图平行
                    marginBottom: 20,
                    marginLeft: 15,
                    marginRight: 15,
                    //height: 100,
                    width: rightBigViewW,
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    {/*标题*/}
                    <Text style={{
                        marginLeft: 0, marginTop: 0, fontSize: 15, color: 'rgba(255, 115,' +
                        ' 12, 1)', textAlign: "left", //lineHeight: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1}
                    >{rowData.chinese_highlight}</Text>
                    {/*优惠信息*/}
                    <Text style={{
                        marginLeft: 0, marginTop: 5 + 3, fontSize: 12, color: 'rgba(85, 85,' +
                        ' 85, 1)', lineHeight: 14,
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={0} textAlign="center"
                    >{rowData.chinese_name}</Text>
                    {/*最后一行,剩余时间等最大背景view*/}
                    <View style={{
                        marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', marginRight: 0, height: 14,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        {
                            StringOauth.isNull(name) ? null :
                                <Image source={require('../../Img/common_list_icon_store.png')}
                                       style={{width: 14, height: 14}}/>
                        }
                        {/*最后一行,在 左边icon 右边的view*/}
                        <View style={{
                            flexDirection: StringOauth.isNull(name) ?'row':'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: 14,
                            width: rightBigViewW - 14,
                            marginLeft: 5,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            {/*竖线+倒计时icon+倒计时text的背景view*/}
                            <View style={{
                                //flex:1.5,
                                flexDirection: 'row', height: 14, justifyContent: 'flex-end',
                                //backgroundColor: Colors.getRandomColor()
                            }}>
                                {/*竖线*/}
                                {
                                    StringOauth.isNull(name) ? null : <Text style={{
                                            marginLeft: 0, marginTop: 0, fontSize: 10, color: 'rgba(228, 228,' +
                                            ' 228, 1)', textAlign: "center", alignSelf: 'center',
                                            //backgroundColor: Colors.getRandomColor()
                                        }} numberOfLines={1}
                                        >|
                                        </Text>
                                }

                                {/*倒计时icon*/}
                                <Image source={require('../../Img/common_list_icon_time.png')}
                                       style={{
                                           width: 14, height: 14, marginLeft: 5,
                                           //backgroundColor:Colors.getRandomColor()
                                       }}/>
                                {/*倒计时时间*/}
                                <Text style={{//flex:1,
                                    marginLeft: 5, marginTop: 0, fontSize: 12, color: 'rgba(136, 136,' +
                                    ' 136, 1)', textAlign: "right", alignSelf: 'center',
                                    //backgroundColor: Colors.getRandomColor()
                                }} numberOfLines={1}
                                >{time}
                                </Text>
                            </View>
                            {/*优惠商家名称*/}
                            {
                                StringOauth.isNull(name) ? null :
                                    <Text style={{
                                        flex: 1,//让 此Text占据 除了  右边的View之外的 父视图里的 所有区域
                                        marginLeft: 5,
                                        marginRight: 10,
                                        marginTop: 0,
                                        fontSize: 12,
                                        color: 'rgba(136, 136,' +
                                        ' 136, 1)',
                                        textAlign: "left",
                                        alignSelf: 'flex-start',
                                        //backgroundColor: Colors.getRandomColor()
                                    }} numberOfLines={1}
                                    >{name}</Text>
                            }

                        </View>

                    </View>
                </View>
            </View>

        </ BaseBt >
    );

}
