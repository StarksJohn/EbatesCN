/**
 * Created by Ebates on 17/1/19.
 * AllMerchantPageFilterListContanier
 * 全部商家页 的 筛选 下拉 列表 数据源
 */

import React, {Component, PropTypes} from 'react';
import {
    View, Text, Animated
} from 'react-native';
import {connect} from 'react-redux';
import CouponListComp from '../../Comp/BizList/CouponListComp'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BizMerchantListCell from '../../Comp/BizCells/BizMerchantListCell'
import BaseListComp from '../../Comp/Base/BaseListComp'
import BizDropDownListComp from '../../Comp/BizList/BizDropDownListComp'
import GlobalStyles from '../../Global/GlobalStyles'
import Colors from '../../Utils/Colors'
import BaseTitleBt from '../../Comp/Base/BaseTitleBt'
import *as EventListener from '../../Utils/EventListener/EventListener'
import AllMerchantPageListContanier,{AllMerchantPageRefreshListEventName} from './AllMerchantPageListContanier'

class AllMerchantPageFilterListContanier extends Component {

    static propTypes = {
        // AllMerchantPageReducer:PropTypes.any ,//全部商家 页面的 reducer
        // AnimatedViewStyle:PropTypes.any,//下拉列表的容器
        onPress:PropTypes.func

    };

    static defaultProps = {
        // AllMerchantPageReducer:null

    };

    componentWillUnmount() {
        Log.log('AllMerchantPageFilterListContanier componentWillUnmount ')

        BizApi.AllMerchantPageFilterDropDownListApi.isThisCompDidMount = false;

    }


    onClearBt() {
        this.props.dispatch(BizApi.AllMerchantPageFilterDropDownListApi.clearSelectData())
    }

    onConfirmBt() {
        EventListener.sendEvent(AllMerchantPageRefreshListEventName);
        this.props.onPress&&this.props.onPress();

    }

    render() {
        Log.log('AllMerchantPageFilterListContanier render() ')
        return (
            <View style={{flex: 1}}>
                <BizDropDownListComp
                    {...this.props}
                    customContainer={{height: GlobalStyles.AllMerchantPageFilterListH - 60}}
                    renderNetWorkAbnormalView={(props) => {
                        return BizViews.netWorkAbnormalView({}, {
                            marginTop: 60,
                            width: 90,
                            height: 90,
                        }, {marginTop: 25,}, {marginTop: 17}, () => {
                            {/*this.props.dispatch(BizApi.SearchResultPageMerchantListAPI.fetchData(BaseListActions.BaseListFetchDataType.REFRESH, props.route.value));//刷新 列表*/
                            }

                        });
                    }
                    }
                />
                <View style={{
                    height: 60,
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: 'rgba(242, 242, 242, 1)'
                }}>
                    <BaseTitleBt
                        key={0}
                        btStyle={[{
                            width: (GlobalStyles.window.width - 30 - 10) / 2 - 0.1 /*减0.1是因为大屏上,/3后的值可能
                             比 实际的值大, 避免 一行大屏 里 一行显示不下3个按钮*/,
                            borderRadius: 4,
                            marginLeft: 15,
                            height: 44,
                            alignItems: 'center',
                            borderColor: 'rgba(210, 210, 210, 1)',
                            borderWidth: 0.5,
                            justifyContent: 'center',
                            backgroundColor: Colors.white,
                        }]}
                        onPress={() => this.onClearBt()}
                        textStyle={{
                            fontSize: 15,
                            color: 'rgba(85, 85, 85, 1)',
                        }}
                        title='清空'
                        disabled={false}
                    >
                    </BaseTitleBt>
                    <BaseTitleBt
                        key={1}
                        btStyle={[{
                            width: (GlobalStyles.window.width - 30 - 10) / 2 - 0.1 /*减0.1是因为大屏上,/3后的值可能
                             比 实际的值大, 避免 一行大屏 里 一行显示不下3个按钮*/,
                            borderRadius: 4,
                            marginLeft: 10,
                            height: 44,
                            alignItems: 'center',
                            //borderColor: 'rgba(210, 210, 210, 1)',
                            //borderWidth: 0.5,
                            justifyContent: 'center',
                            backgroundColor: Colors.appUnifiedBackColor,
                        }]}
                        onPress={() => this.onConfirmBt()}
                        textStyle={{
                            fontSize: 15,
                            color: Colors.white,
                        }}
                        title='确定'
                        disabled={false}
                    >
                    </BaseTitleBt>
                </View>
            </View>


        );
    }
}

function mapStateToProps(state) {
    const {AllMerchantPageFilterListReducer}=state;
    return {
        baseReducer: AllMerchantPageFilterListReducer,
    };

}

export default connect(mapStateToProps)(AllMerchantPageFilterListContanier);