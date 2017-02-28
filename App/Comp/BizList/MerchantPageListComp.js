/**
 * Created by Ebates on 17/2/17.
 * MerchantPageListComp 商家页列表
 */
import React, {Component} from 'react';
import {
    View, Text, Image
} from 'react-native';
import Colors from '../../Utils/Colors'
import BaseListComp from '../Base/BaseListComp';
import BaseBt from '../Base/BaseBt'
import GlobalStyles from '../../Global/GlobalStyles'
import BaseGridView from '../Base/BaseGridView'
import *as BizViews from '../BizCommonComp/BizViews'
import *as BizMerchantListCell from '../BizCells/BizMerchantListCell'
import BaseTitleBt from '../Base/BaseTitleBt'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AllMerchantPage from '../../Pages/AllMerchantPage'


export default class MerchantPageListComp extends Component {
    constructor(props) {
        super(props);
    }

    onCheckAllMerchant() {
        this.props.navigator.push({
            component: AllMerchantPage,
            name: gRouteName.AllMerchantPage,
        });
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        Log.log('MerchantPageListComp renderRow rowID==' + rowID);

        if (rowID != '0' && rowID == this.props.baseReducer.$dataArray.toJS().length - 1) {//最底部画 占位view
            return BizViews.renderBottomTabbarBackView();
        } else if (rowID == this.props.baseReducer.$dataArray.toJS().length - 2) {//查看全部cell
            return <BaseTitleBt
                btStyle={[{
                    marginTop: 5,height: 45, justifyContent: 'center',
                    alignItems: 'center',
                    //backgroundColor: Colors.getRandomColor(),
                }]}
                onPress={() => this.onCheckAllMerchant()}
                textStyle={{
                    fontSize: 15,
                    color: 'rgba(85, 85, 85, 1)',
                    //backgroundColor: Colors.getRandomColor()
                }}
                title='查看全部'
                disabled={false}
            >
            </BaseTitleBt>
        }
        switch (rowID) {
            case '0': {
                return (
                    <BaseGridView
                        items={Array.from(rowData)}//数组元素是 {img:'',title:''}
                        containerStyle={{
                            paddingLeft: 10,
                            paddingRight: 10, paddingTop: 10, paddingBottom: 10,
                            backgroundColor: Colors.white
                        }}
                        renderItem={(model/*此处的model是 {img:'',title:''} 结构*/) => {
                            return (
                                <BaseBt
                                    key={model.title}
                                    style={ {flex:0,
                                        marginTop:5, marginBottom: 0,marginLeft: 0, marginRight: 0,paddingTop: 0,
                                        paddingBottom: 0,
                                        width: (GlobalStyles.window.width - 20 ) / 4,
                                        height: (200 - 30 ) / 2,
                                        //backgroundColor: Colors.getRandomColor()
                                    }}
                                    activeOpacity={0.6}
                                    disabled={false}
                                    onPress={ () => {
                                        //callback(rowData);
                                    } }
                                >
                                    <Image source={model.img} style={{width: 55, height: 55, alignSelf: 'center',marginTop: 0,}}/>
                                    <Text style={{
                                        marginLeft: 0,
                                        marginTop: 7,
                                        fontSize: 13,
                                        color: '#404040',
                                        alignSelf: 'center',
                                        //backgroundColor: Colors.getRandomColor()
                                    }} numberOfLines={1} textAlign="center"
                                    >{model.title}</Text>
                                </ BaseBt >
                            );
                        }}
                    />
                );
            }
                break;
            case '1': {//Top10商家cell
                return <View style={{
                    height: 50, flexDirection: 'row', justifyContent: 'space-between',
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    <Text style={{
                        marginLeft: 15,
                        marginTop: 20,
                        fontSize: 15,
                        color: Colors.BizCommonBlack,
                        //fontWeight:'bold',
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1} textAlign="center"
                    >Top10商家
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        <BaseTitleBt
                            btStyle={[{
                                height: 30, marginTop: 17,
                                alignItems: 'center', justifyContent: 'center',
                                marginRight: 5,
                                backgroundColor: Colors.transparent ,
                            }]}
                            onPress={() => this.onCheckAllMerchant()}
                            textStyle={{
                                fontSize: 12, fontWeight:'bold' ,color: 'rgba(136, 136, 136, 1)',
                            }}
                            title='查看全部'
                            disabled={false}
                        >
                        </BaseTitleBt>
                        <FontAwesomeIcon style={{
                            marginTop: 24, marginRight: 15,
                            //backgroundColor: Colors.getRandomColor()
                        }} name='angle-right' size={16} color='rgba(136, 136, 136, 1)'/>
                    </View>

                </View>
            }
                break;
            default://商家cell
            {
                let paddingTop = 0;
                if (rowID != '2') {
                    paddingTop = 5;
                }

                return BizMerchantListCell.RenderBizMerchantListCell(rowData, sectionID, rowID, highlightRow, (rowData) => {
                    Log.log('MerchantListComp renderRow callback rowData==' + rowData);
                },paddingTop);
            }
                break;
        }

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    renderRow={
                        this.renderRow
                    }

                />
            </View>

        );
    }
}