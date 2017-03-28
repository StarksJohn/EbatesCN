/**
 * Created by Ebates on 17/2/28.
 * BizDropDownListComp  筛选控件 点击 Menu后 显示的 通用下拉列表
 */
import React, {Component, PropTypes } from 'react';
import {
    View, Text
} from 'react-native';
import BaseListComp from '../Base/BaseListComp';
import Colors from '../../Utils/Colors'

export default class BizDropDownListComp extends Component {

    static propTypes = {
        renderNoDataView: PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
        renderRow:PropTypes.func,
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
        Log.log('BizDropDownListComp renderRow rowID='+rowID)
        return <View style={{height:44, backgroundColor:Colors.getRandomColor()}}>

        </View>;

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    initialListSize={5}
                    scrollRenderAheadDistance={300}
                    renderRow={
                        this.props.renderRow ? this.props.renderRow :this.renderRow
                    }
                />
            </View>

        );
    }

}