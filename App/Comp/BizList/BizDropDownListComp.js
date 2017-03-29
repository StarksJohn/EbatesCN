/**
 * Created by Ebates on 17/2/28.
 * BizDropDownListComp  筛选控件 点击 Menu后 显示的 通用下拉列表
 */
import React, {Component, PropTypes} from 'react';
import {
    View, Text
} from 'react-native';
import BaseListComp from '../Base/BaseListComp';
import Colors from '../../Utils/Colors'
import BizDropDownListCell from '../BizCells/BizDropDownListCell'
import *as BaseListActions from '../../Redux/Actions/BaseListActions'

export default class BizDropDownListComp extends Component {

    static propTypes = {
        renderNoDataView: PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
        renderRow: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    onPress(rowData) {
        if (!rowData.isSelect) {
            rowData.isSelect = true;//只改变 model  的属性不行,因 model的地址 没变,就 不能 重绘 对应的model

            // this.props.baseReducer.$dataArray.toJS().map(
            //     (model,i)=>{
            //         Log.log('BizDropDownListComp onPress map() i=='+i);
            //         if (rowData.id!=model.id && model.isSelect){
            //             model.isSelect=false;
            //
            //             this.props.dispatch(BaseListActions.ChangeListNumsItemAction(BaseListActions.BaseListFetchDataType.REFRESH, this.props.baseReducer.ApiName, {
            //                 indexArr: [rowData.index],
            //                 newDataArr: [{...rowData},{...model}]
            //             }));
            //
            //         }
            //     }
            // )

            let arr = this.props.baseReducer.$dataArray.toJS();

            for (let i = 0; i < arr.length; i++) {
                Log.log('BizDropDownListComp onPress for() i==' + i);
                let model = arr[i];
                if (rowData.id != model.id && model.isSelect) {
                    model.isSelect = false;

                    this.props.dispatch(BaseListActions.ChangeListNumsItemAction(BaseListActions.BaseListFetchDataType.REFRESH, this.props.baseReducer.ApiName, {
                        indexArr: [rowData.index,model.index],
                        newDataArr: [{...rowData}, {...model}]
                    }));
                    break;
                }
            }

        }

    }

    /**
     * 当前控件的cell的自定义绘制
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param highlightRow
     * @returns {XML}
     */
    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        Log.log('BizDropDownListComp renderRow rowID=' + rowID)
        return <BizDropDownListCell
            rowData={rowData}
            onPress={ (rowData) => {
                this.onPress(rowData);
            } }
        >

        </BizDropDownListCell>;

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    //customContainer={{paddingTop:0}}
                    onScroll={
                        () => {
                            {/*Log.log('BizDropDownListComp onScroll!');*/}
                        }
                    }
                    initialListSize={5}
                    scrollRenderAheadDistance={300}
                    renderRow={
                        this.props.renderRow ? this.props.renderRow : this.renderRow
                    }
                />
            </View>

        );
    }

}