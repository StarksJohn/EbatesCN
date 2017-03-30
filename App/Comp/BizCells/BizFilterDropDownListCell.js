/**
 * Created by Ebates on 2017/3/29.
 * BizFilterDropDownListCell.js
 * 全部商家页  筛选控件的 筛选 下拉列表 cell, 0和1号cell是 title+对号, 2号cell的直邮, 3号cell是支付方式,4号cell是清空+确定
 */
import React, {Component, PropTypes} from 'react';
import {
    View, Text
} from 'react-native';
import Colors from '../../Utils/Colors'
import GlobalStyles from '../../Global/GlobalStyles'
import *as BizViews from '../BizCommonComp/BizViews'
import Ionicons from 'react-native-vector-icons/Ionicons';
import BaseBt from '../Base/BaseBt'
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import AllMerchantPageFilterListShipsMenuGridViewContainer from '../../Redux/Container/AllMerchantPageFilterListShipsGridViewContainer'
import AllMerchantPageFilterListPaymentsGridViewContainer from '../../Redux/Container/AllMerchantPageFilterListPaymentsGridViewContainer'

export default class BizFilterDropDownListCell extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        rowData: PropTypes.any,//
        onPress: PropTypes.func,//点 确定户 回调
    };

    onFirstAndSecondCellPress() {
        const {rowData, onPress, baseReducer}=this.props;

        // if (!rowData.isSelect)
        {
            rowData.isSelect = !rowData.isSelect;//只改变 model  的属性不行,因 model的地址 没变,就 不能 重绘 对应的model

            this.props.dispatch(BaseListActions.ChangeListOneItemAction(BaseListActions.BaseListFetchDataType.REFRESH, this.props.baseReducer.ApiName, {
                index: rowData.index,
                newData: {...rowData}
            }));

        }

    }

    //画 0号或 1号cell
    renderFirstAndSecondCell() {
        const {rowData, onPress, baseReducer}=this.props;
        let isSelect = rowData.isSelect;

        return (
            <BaseBt style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: GlobalStyles.AllMerchantPageDropDownListCellH,
                alignItems: 'center',
                backgroundColor: Colors.white
            }}
                    activeOpacity={0.6}
                    onPress={ () => {
                        this.onFirstAndSecondCellPress();
                    } }
            >
                <Text style={{
                    fontSize: 15,
                    color: 'rgba(85, 85, 85, 1)',
                    marginTop: 0,
                    marginLeft: 15,
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    {this.props.rowData.name}
                </Text>
                {/*太粗*/}
                {/*<FontAwesomeIcon style={{*/}
                {/*marginRight: 15,*/}
                {/*//backgroundColor: Colors.getRandomColor()*/}
                {/*}} name='check' size={20} color='rgba(54, 166, 66, 1)' />*/}
                {/*粗细差不多*/}
                {isSelect ? <Ionicons name='md-checkbox' size={25} color='rgba(54, 166, 66, 1)' style={{
                    marginRight: 15, borderRadius: 10,backgroundColor: Colors.transparent
                }}/>:
                    <View style={{
                        marginRight: 15, width:20, height:20, borderColor:'rgba(210, 210, 210, 1)', borderRadius: 4,
                        borderWidth:1,backgroundColor: Colors.white,
                    }}/>}

                {BizViews.renderShadowLine({position: 'absolute', bottom: 0.5, left: 15, right: 0, borderWidth: 0.3})}
            </BaseBt>

        );
    }

    /**
     * 画 直邮 或 支付方式 cell
     */
    renderShipsAndPaymentsCell(){
        const {rowData, onPress, baseReducer}=this.props;

        let self=this;

        if (rowData.index==2){
            return(
                <View
                    ref={
                        (r)=>{
                            self.shipsCellRef=r;
                        }
                    }
                    style={{
                    backgroundColor:Colors.white
                }}>
                    <Text style={{
                        marginLeft: 15, marginTop: 20, fontSize: 14, color: 'rgba(85, 85,' +
                        ' 85, 1)', textAlign: "left", //lineHeight: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1}
                    >直邮至</Text>
                    <AllMerchantPageFilterListShipsMenuGridViewContainer
                        onItemPress={
                            (key) => {
                                Log.log(' BizFilterDropDownListCell renderShipsAndPaymentsCell onItemPress key ='+key );
                            }
                        }
                    >

                    </AllMerchantPageFilterListShipsMenuGridViewContainer>
                </View>
            );
        }else if(rowData.index==3){
            return(
                <View
                    ref={
                        (r)=>{
                            self.payMentsCellRef=r;
                        }
                    }
                    style={{
                    backgroundColor:Colors.white
                }}>
                    <Text style={{
                        marginLeft: 15, marginTop: 20, fontSize: 14, color: 'rgba(85, 85,' +
                        ' 85, 1)', textAlign: "left", //lineHeight: 15,
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1}
                    >支持支付方式</Text>
                    <AllMerchantPageFilterListPaymentsGridViewContainer
                        onItemPress={
                            (key) => {
                                Log.log(' BizFilterDropDownListCell renderShipsAndPaymentsCell onItemPress key ='+key );
                            }
                        }
                    >

                    </AllMerchantPageFilterListPaymentsGridViewContainer>
                </View>
            );
        }


    }

    render() {
        const {rowData}=this.props;
        switch (rowData.index) {
            case 0:
            case 1: {
                return this.renderFirstAndSecondCell();
            }
                break;
            case 2:
            case 3:
            {
                return this.renderShipsAndPaymentsCell();
            }
            default: {
                return <View style={{height: 100, backgroundColor: Colors.getRandomColor()}}>

                </View>
            }
        }

    }

}
