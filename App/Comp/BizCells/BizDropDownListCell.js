/**
 * Created by Ebates on 2017/3/29.
 * BizDropDownListCell.js
 * 业务逻辑通用的 筛选控件的 下拉列表 cell, 只有一个 title和 右边的对号
 */
import React, {Component, PropTypes } from 'react';
import {
    View, Text
} from 'react-native';
import Colors from '../../Utils/Colors'
import GlobalStyles from '../../Global/GlobalStyles'
import *as BizViews from '../BizCommonComp/BizViews'
import Ionicons from 'react-native-vector-icons/Ionicons';
import BaseBt from '../Base/BaseBt'

export default class BizDropDownListCell extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        rowData: PropTypes.any,//
        onPress:PropTypes.func,
    };

    render() {
        const {rowData,onPress}=this.props;
        let isSelect=rowData.isSelect;
        return (
            <BaseBt style={{flexDirection:'row', justifyContent:'space-between', height:GlobalStyles.AllMerchantPageDropDownListCellH,
                alignItems:'center',
                backgroundColor:Colors.white
            }}
                    activeOpacity={0.6}
                    onPress={ () => {
                        onPress(rowData);
                    } }
            >
                <Text style={{
                    fontSize: 15, color: isSelect?'rgba(54, 166, 66, 1)':'rgba(85, 85, 85, 1)', marginTop: 0, marginLeft: 15,
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
                {isSelect&&<Ionicons name='ios-checkmark' size={50} color='rgba(54, 166, 66, 1)' style={{marginRight:15,
                    backgroundColor:Colors.transparent
                }}/>}

                {BizViews.renderShadowLine({position:'absolute', bottom: 0.5,left:15, right: 0,borderWidth: 0.3})}
            </BaseBt>

        );
    }

}
