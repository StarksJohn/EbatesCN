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
import BizFilterDropDownListCell from '../BizCells/BizFilterDropDownListCell'
import *as BizApi from '../../NetWork/API/BizApi'
import *as EventListener from '../../Utils/EventListener/EventListener'
import *as AllMerchantPage from '../../Pages/AllMerchantPage'
import *as AllCouponPageApi from '../../NetWork/API/AllCouponPageApi'
import *as AllCouponsPage from '../../Pages/AllCouponsPage'

export default class BizDropDownListComp extends Component {

    static propTypes = {
        renderNoDataView: PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
        renderRow: PropTypes.func,
        onPress: PropTypes.func,
        refreshListEventName: React.PropTypes.string,//主动调 某列表 控件的 刷新 逻辑 的 事件

    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        // this.refs.map(
        //     (v,i)=>{
        //         v.measure((fx, fy, width, height, px, py) => {
        //             Log.log('BizDropDownListComp componentDidMount  FilterDropDownListCellRef.height='+height );
        //         })
        //     }
        // )
    }

    /**
     * 单选的cell 点击后回调
     * @param rowData
     */
    onPress(rowData) {
        if (!rowData.isSelect) {
            rowData.isSelect = true;//只改变 model  的属性不行,因 model的地址 没变,就 不能 重绘 对应的model

            //改变 下拉列表 其他 model的 选中 状态
            let arr = this.props.baseReducer.$dataArray.toJS();
            for (let i = 0; i < arr.length; i++) {
                Log.log('BizDropDownListComp onPress for() i==' + i);
                let model = arr[i];
                if (rowData.index != model.index && model.isSelect) {
                    model.isSelect = false;

                    this.props.dispatch(BaseListActions.ChangeListNumsItemAction(BaseListActions.BaseListFetchDataType.REFRESH, this.props.baseReducer.ApiName, {
                        indexArr: [rowData.index, model.index],
                        newDataArr: [{...rowData}, {...model}]//以后把 model 改成 Immutable 类型
                    }));
                    break;
                }
            }
        }

        if (this.props.baseReducer.ApiName == BizApi.AllMerchantPageCategoryListApi.ApiName) {
            BizApi.AllMerchantPageCategoryListApi.categoryID = rowData.id;

            //发 改变 全部商家页面 title的 事件
            EventListener.sendEvent(AllMerchantPage.AllMerchantPagechangeTitleEventName, rowData.index == 0 ? '全部商家' : rowData.name);

            //发改变 Category下拉列表Menu的 title的 事件
            EventListener.sendEvent(AllMerchantPage.AllMerchantPageChangeCategoryMenuTitleEventName, rowData.index == 0 ? '分类' : rowData.name);


        } else if (this.props.baseReducer.ApiName == BizApi.AllMerchantPageCountryListApi.ApiName) {
            BizApi.AllMerchantPageCountryListApi.tag = rowData.key;
            EventListener.sendEvent(AllMerchantPage.AllMerchantPageChangeCountryMenuTitleEventName, rowData.index == 0 ? '国家' : rowData.name);

        } else if (this.props.baseReducer.ApiName == BizApi.AllMerchantPageSortDropDownListApi.ApiName) {
            BizApi.AllMerchantPageSortDropDownListApi.sort_by = rowData.id;

            EventListener.sendEvent(AllMerchantPage.AllMerchantPageChangeSortMenuTitleEventName, rowData.index == 0 ? '排序' : rowData.name);
        } else if (this.props.baseReducer.ApiName == AllCouponPageApi.AllCouponPageCategoryListApi.ApiName) {
            AllCouponPageApi.AllCouponPageCategoryListApi.categoryID = rowData.id;

            //发 改变 全部优惠页面 title的 事件
            EventListener.sendEvent(AllCouponsPage.AllCouponPageChangeTitleEventName,rowData.index==0?'全部优惠':rowData.name);

            //发改变 Category下拉列表Menu的 title的 事件
            EventListener.sendEvent(AllCouponsPage.AllCouponPageChangeCategoryMenuTitleEventName,rowData.index==0?'分类':rowData.name);


        }

        Log.log('BizDropDownListComp onPress ');
        this.props.onPress && this.props.onPress()

        //发送 某个列表控件 需要 主动 刷新的事件
        this.props.refreshListEventName && EventListener.sendEvent(/*BizApi.AllMerchantPageListApi.ApiName*/ this.props.refreshListEventName);

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
        // Log.log('BizDropDownListComp renderRow rowID=' + rowID)
        let self = this;
        let cell = null;
        if (self.props.baseReducer.ApiName == BizApi.AllMerchantPageFilterDropDownListApi.ApiName) {//画 筛选 下拉列表的cell
            cell = <BizFilterDropDownListCell
                {...self.props}
                ref={
                    rowData.index
                }
                rowData={rowData}
                onPress={ (rowData) => {
                    self.onPress(rowData);
                } }
            >

            </BizFilterDropDownListCell>;
        } else {//画 其他下拉列表的 单选 cell
            cell = <BizDropDownListCell
                {...self.props}
                rowData={rowData}
                onPress={ (rowData) => {
                    self.onPress(rowData);
                } }
            >

            </BizDropDownListCell>;
        }

        return cell;
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    onScroll={
                        () => {
                            {/*Log.log('BizDropDownListComp onScroll!');*/
                            }
                        }
                    }
                    initialListSize={5}
                    removeClippedSubviews={false}
                    //pageSize={5}
                    scrollRenderAheadDistance={300}
                    renderRow={
                        this.props.renderRow ? this.props.renderRow : this.renderRow
                    }
                />
            </View>

        );
    }

}