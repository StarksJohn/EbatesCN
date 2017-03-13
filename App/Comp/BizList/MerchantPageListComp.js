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
import MerchantPageGridViewContainer from '../../Redux/Container/MerchantPageGridViewContainer'
import *as BizViews from '../BizCommonComp/BizViews'
import *as BizMerchantListCell from '../BizCells/BizMerchantListCell'
import BaseTitleBt from '../Base/BaseTitleBt'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AllMerchantPage from '../../Pages/AllMerchantPage'
import *as BizApi from '../../NetWork/API/BizApi'
import *as TokenAPI from '../../NetWork/API/TokenAPI'
import MerchantDetailPage from '../../Pages/MerchantDetailPage'


export default class MerchantPageListComp extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    onCheckAllMerchant() {
        // this.props.navigator.push({
        //     component: AllMerchantPage,
        //     name: gRouteName.AllMerchantPage,
        // });
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        Log.log('MerchantPageListComp renderRow rowID==' + rowID);

        if (rowID != '0' && this.props.baseReducer.$dataArray.toJS().length > 10 && rowID == this.props.baseReducer.$dataArray.toJS().length - 1) {//最底部画 占位view
            return BizViews.renderBottomTabbarBackView();
        } else if (this.props.baseReducer.$dataArray.toJS().length > 10 && rowID == this.props.baseReducer.$dataArray.toJS().length - 2) {//查看全部cell
            return <BaseTitleBt
                btStyle={[{
                    marginTop: 5, height: 45, justifyContent: 'center',
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
        //画网络异常cell
        else if (this.props.baseReducer.$dataArray.toJS().length == 3 &&rowData.key&&  rowData.key === BizApi.MerchantPageApi.NetWorkAbnormalCellData) {
            return BizViews.netWorkAbnormalView({}, {
                marginTop: 0,
                width: 90,
                height: 90,
            }, {marginTop: 25,}, {marginTop: 17, marginBottom:55}, () => {
                TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                    () => {
                        Log.log('BizApi MerchantPageApi 开始 调 top10商家接口 ')
                            this.props.dispatch(BizApi.MerchantPageApi.fetchTopTen());
                    }
                );
            });
        }
        switch (rowID) {
            case '0': {
                return (
                    <MerchantPageGridViewContainer

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
                                backgroundColor: Colors.transparent,
                            }]}
                            onPress={() => this.onCheckAllMerchant()}
                            textStyle={{
                                fontSize: 12, fontWeight: 'bold', color: 'rgba(136, 136, 136, 1)',
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

                if (this.props.baseReducer.ApiName == BizApi.MerchantPageApi.ApiName) {
                    rowData.isInTopTenList = true;
                }

                return BizMerchantListCell.RenderBizMerchantListCell(rowData, sectionID, rowID, highlightRow, (rowData) => {
                    Log.log('MerchantListComp renderRow callback rowData==' + rowData);
                    this.props.navigator.push({
                        component: MerchantDetailPage,
                        name: gRouteName.MerchantDetailPage,
                        merchantData:rowData,
                    });
                }, paddingTop);
            }
                break;
        }

    }

    render() {
        return (
            <BaseListComp
                {...this.props }
                renderRow={
                    this.renderRow
                }

            />
            // {/*<View style={{flex: 1}}>*/}
            //     {/*<BaseListComp*/}
            //         {/*{...this.props }*/}
            //         {/*renderRow={*/}
            //             {/*this.renderRow*/}
            //         {/*}*/}
            //
            //     {/*/>*/}
            // {/*</View>*/}

        );
    }
}