/**
 商家 列表,可能在 搜索结果页 画,也可能 在 商家页 画
 */

import React, {Component, PropTypes } from 'react';
import {
    View, Text
} from 'react-native';
import BaseListComp from '../Base/BaseListComp';
import Colors from '../../Utils/Colors'


export default class MerchantListComp extends Component {

    static propTypes = {
        renderNoDataView: PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
    };

    constructor(props) {
        super(props);
    }

    /**
     * 当前控件的cell的自定义绘制
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param highlightRow
     * @returns {XML}
     */
    renderRow = (rowData, sectionID, rowID, highlightRow)=> {

        // Log.log('MerchantListComp rowID==' + rowID);

        return (
            <View style={{flex: 1, height: 100,
                backgroundColor: Colors.getRandomColor()
            }}>
            </View>
        );

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    renderRow={
                        this.renderRow
                    }
                    renderNoDataView={(props) =>
                    {
                        return this.props.renderNoDataView(props);
                    }
                    }
                />
            </View>

        );
    }

}