/**
 * Created by Ebates on 17/1/19.
 * HomePageEBCouponListContanier
 * 首页 的 EB独家优惠 列表 数据源
 */

import React from 'react';
import {
    View, Text
} from 'react-native';
import {connect} from 'react-redux';
import CouponListComp from '../../Comp/BizList/CouponListComp'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BizCouponListCell from '../../Comp/BizCells/BizCouponListCell'
import GlobalStyles from '../../Global/GlobalStyles'


class HomePageEBCouponListContanier extends React.Component {

    /**
     * @param props
     * @returns {XML}
     */
    renderNetWorkAbnormalView(props) {

        return BizViews.netWorkAbnormalView({}, {
            marginTop: 60,
            width: 90,
            height: 90,
        }, {marginTop: 25,}, {marginTop: 17}, () => {
            this.props.dispatch(BizApi.SearchResultPageMerchantListAPI.fetchData(BaseListActions.BaseListFetchDataType.REFRESH, props.route.value));//刷新 列表

        });
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {

        let paddingTop = 0;
        if (rowID != 0) {
            paddingTop = 5;
        }

        // if (( rowID == this.props.baseReducer.$dataArray.toJS().length - 1)) {//底部留白cell
        //     return BizViews.renderBottomTabbarBackView();
        // }else
            {
                rowData.isRenderEB = true;

                return BizCouponListCell.RenderBizCouponListCell(rowData, sectionID, rowID, highlightRow, paddingTop, (rowData) => {
                Log.log('CouponListComp renderRow callback rowData==' + rowData);
            });
        }
    }

    render() {
        return (
            <CouponListComp {...this.props}
                            renderNoDataView={(props) => {
                                return this.renderNetWorkAbnormalView(props);
                            }
                            }
                            renderNetWorkAbnormalView={(props) => {
                                return this.renderNetWorkAbnormalView(props);
                            }
                            }
                            renderRow={this.renderRow}

                            customContainer={{paddingBottom:GlobalStyles.bottomTabBarHeight}}

            />
        );
    }
}

function mapStateToProps(state) {
    const {HomePageEBCouponListReducer}=state;
    return {
        baseReducer: HomePageEBCouponListReducer,
    };

}

export default connect(mapStateToProps)(HomePageEBCouponListContanier);