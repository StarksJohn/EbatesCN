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
import EventListener from '../../Utils/EventListener/EventListener'


class AllMerchantPageListContanier extends Component {

    static propTypes = {
        // AllMerchantPageReducer:PropTypes.any ,//全部商家 页面的 reducer
    };

    static defaultProps = {
        // AllMerchantPageReducer:null

    };

    componentDidMount() {
        this.Listener = new EventListener({
            eventName: this.props.baseReducer.ApiName, eventCallback: ()=> {
                this.props.dispatch(BizApi.AllMerchantPageListApi.SearchMerchants(BaseListActions.BaseListFetchDataType.REFRESH,this.props))

            }
        });
    }

    componentWillUnmount() {
        if (this.Listener) {
            this.Listener.removeEventListener();
        }
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