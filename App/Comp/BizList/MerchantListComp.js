/**
 商家 列表,可能在 搜索结果页 画,也可能 在 商家页 画
 */

import React, {Component, PropTypes} from 'react';
import {
    View, Text, Image
} from 'react-native';
import BaseListComp from '../Base/BaseListComp';
import *as BizMerchantListCell from '../BizCells/BizMerchantListCell'


export default class MerchantListComp extends Component {

    static propTypes = {
        renderNoDataView: PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Image.getSize('http://mmbiz.qpic.cn/mmbiz/z7kZjMoQ3yF06A6zTMZbI4Fp35KtDtTSNBD9Ysfjmb3ePlicYNPHJic8LQaYDbU5Y8fx3dBRb2AKuD2KTbG4QxZA/0?wx_fmt=jpeg', (width, height) => {
        //     Log.log('MerchantListComp componentDidMount width==' + width + '  height==' + height);
        // });


        // var aref = this.tempfunc;
        // window.setTimeout(this.refs.textRef.measure((fx, fy, width, height, px, py)=> {
        //     Log.log(fx, fy, width, height, px, py);
        // }), 1);//延迟一毫秒执行tempfuc
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

        Log.log('MerchantListComp rowID==' + rowID);

        return BizMerchantListCell.RenderBizMerchantListCell(rowData,sectionID,rowID,highlightRow,(rowData)=>{
            Log.log('MerchantListComp renderRow callback rowData=='+rowData);
        });
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
                    renderNoDataView={(props) => {
                        return this.props.renderNoDataView(props);
                    }
                    }
                />
            </View>

        );
    }

}