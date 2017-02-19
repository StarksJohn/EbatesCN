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

export default class MerchantPageListComp extends Component {
    constructor(props) {
        super(props);
    }

    onCheckAllMerchant(title) {
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        Log.log('MerchantPageListComp renderRow rowID==' + rowID);

        if (rowID != '0' && rowID == this.props.baseReducer.$dataArray.toJS().length - 1) {//最底部画 占位view
            return BizViews.renderBottomTabbarBackView();
        } else if (rowID == this.props.baseReducer.$dataArray.toJS().length - 2) {//查看全部cell
            return <BaseTitleBt
                btStyle={[{
                    height: 45, justifyContent: 'center',
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
                            paddingLeft: 25,
                            paddingRight: 25, paddingTop: 15, paddingBottom: 15,
                            backgroundColor: Colors.white
                        }}
                        renderItem={(model/*此处的model是 {img:'',title:''} 结构*/) => {
                            return (
                                <BaseBt
                                    key={model.title}
                                    style={ {
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        width: (GlobalStyles.window.width - 50 ) / 4,
                                        height: (200 - 30 ) / 2,
                                        //backgroundColor: Colors.getRandomColor()
                                    }}
                                    activeOpacity={0.6}
                                    disabled={false}
                                    onPress={ () => {
                                        //callback(rowData);
                                    } }
                                >
                                    <Image source={model.img} style={{width: 55, height: 55, alignSelf: 'center'}}/>
                                    <Text style={{
                                        marginLeft: 0,
                                        marginTop: 10,
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
                    height: 50,
                    backgroundColor: Colors.getRandomColor()
                }}>
                </View>
            }
                break;
            default://商家cell
            {
                return BizMerchantListCell.RenderBizMerchantListCell(rowData,sectionID,rowID,highlightRow,(rowData)=>{
                    Log.log('MerchantListComp renderRow callback rowData=='+rowData);
                });
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