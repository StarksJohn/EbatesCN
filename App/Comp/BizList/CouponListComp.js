/**
 优惠 列表,可能在 搜索结果页 画,也可能 在 其他页面 画,不同页面,外部包不同的 container, 可让此控件获取不同的 数据源
 CouponListComp
 */

import React, {Component, PropTypes } from 'react';
import {
    View, Text
} from 'react-native';
import BaseListComp from '../Base/BaseListComp';
import Colors from '../../Utils/Colors'


export default class CouponListComp extends Component {

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
        Log.log('CouponListComp rowID==' + rowID);
        let str='rowID  '+rowID;

        return (
            <View style={{flex: 1, height: 150, justifyContent:'center' , alignItems: 'center',
                //backgroundColor: Colors.getRandomColor()
            }}>
                <Text style={{
                    backgroundColor: Colors.getRandomColor()
                }}>
                    {str}
                </Text>
            </View>
        );

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