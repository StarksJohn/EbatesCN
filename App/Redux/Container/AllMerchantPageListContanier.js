/**
 * Created by Ebates on 17/1/19.
 * AllMerchantPageListContanier
 * 全部商家页 的 商家 列表 数据源
 */

import React, {Component, PropTypes} from 'react';
import {
    View, Text
} from 'react-native';
import {connect} from 'react-redux';
import CouponListComp from '../../Comp/BizList/CouponListComp'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BizMerchantListCell from '../../Comp/BizCells/BizMerchantListCell'
import GlobalStyles from '../../Global/GlobalStyles'
import BaseListComp from '../../Comp/Base/BaseListComp'
import MerchantListComp from '../../Comp/BizList/MerchantListComp'
// import EventListener from '../../Utils/EventListener/EventListener'
// import SMSTimer from '../../Utils/SMSTimer'


class AllMerchantPageListContanier extends Component {

    static propTypes = {
        // AllMerchantPageReducer:PropTypes.any ,//全部商家 页面的 reducer
    };

    static defaultProps = {
        // AllMerchantPageReducer:null

    };

    componentDidMount() {
        // let self=this;
        //点击 全部商家页 筛选控件的 单选和多选 下拉列表的 item 或 确定 按钮后, 此控件 回调 箭头函数, 重新调 SearchMerchants 接口
        // this.Listener = new EventListener({
        //     eventName: this.props.baseReducer.ApiName, eventCallback: ()=> {
        //
        //         // this.props.dispatch(BaseListActions.InitListDataSource(this.props.baseReducer.ApiName));// 全部商家 列表的 InitListState  重置
        //
        //         new SMSTimer({
        //             timerNums: 13,
        //             callBack: (time) => {
        //                 Log.log('time===' + time);
        //                 if (time == -1  ) {
        //                     // this.props.dispatch(BaseListActions.Loadinglist(BaseListActions.BaseListFetchDataType.REFRESH, this.props.baseReducer.ApiName));
        //
        //                     this.props.dispatch(BizApi.AllMerchantPageListApi.SearchMerchants(BaseListActions.BaseListFetchDataType.REFRESH,self.props))
        //                 }
        //             }
        //         }).start()
        //
        //     }
        // });
    }

    componentWillUnmount() {
        // if (this.Listener) {
        //     this.Listener.removeEventListener();
        // }
    }

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

    render() {

        return (
            <MerchantListComp
                {...this.props}
                renderNoDataView={(props) => {
                    return BizViews.netWorkAbnormalView({}, {
                        marginTop: 60,
                        width: 90,
                        height: 90,
                    }, {marginTop: 25,}, {marginTop: 17}, () => {
                        this.props.dispatch(BizApi.SearchResultPageMerchantListAPI.fetchData(BaseListActions.BaseListFetchDataType.REFRESH, props.route.value));//刷新 列表

                    });
                }
                }
                renderNetWorkAbnormalView={(props) => {
                    return BizViews.netWorkAbnormalView({}, {
                        marginTop: 60,
                        width: 90,
                        height: 90,
                    }, {marginTop: 25,}, {marginTop: 17}, () => {
                        this.props.dispatch(BizApi.SearchResultPageMerchantListAPI.fetchData(BaseListActions.BaseListFetchDataType.REFRESH, props.route.value));//刷新 列表

                    });
                }
                }
            />
        );
    }
}

function mapStateToProps(state) {
    const {AllMerchantPageListReducer}=state;
    return {
        baseReducer: AllMerchantPageListReducer,
    };

}

export default connect(mapStateToProps)(AllMerchantPageListContanier);