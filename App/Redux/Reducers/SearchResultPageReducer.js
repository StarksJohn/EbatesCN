/**
 * Created by Ebates on 16/12/27.
 *
 * 搜索结果页 reducer
 */
import {
    ListView,
} from 'react-native';
// import InitialState from '../InitialState/ListInitialState'
import *as SearchResultPageActions from '../Actions/SearchResultPageActions'
import *as BizApi from '../../NetWork/API/BizApi'

const initialState = {
    merchantListTabLable: BizApi.SearchResultPageMerchantListAPI.tabLabel + '(0)',//商家 列表的 tabLabel
    couponListTabLable: BizApi.SearchResultPageCouponListAPI.tabLabel+'(0)',
    customRefs:['merchent', 'coupon'],//BizSearchResultPagScrollableTabBar的 不同 tabbar里的 Text 控件的 ref
};

export default function SearchResultPageReducer(state = initialState, action) {

    switch (action.type) {
        case SearchResultPageActions.defultTabLabels: {

            return {
                ...state,
            };
        }
            break;
        case SearchResultPageActions.updateTabLabels: {
            let {tabLabelTag, nums } = action.value;
            let newMerchantListTabLable=state.merchantListTabLable;
            let newCouponListTabLable=state.couponListTabLable;

            if (tabLabelTag==BizApi.SearchResultPageMerchantListAPI.tabLabel){//更新 商家 列表的 tabLabel
                newMerchantListTabLable=BizApi.SearchResultPageMerchantListAPI.tabLabel+'('+nums+')';
            }else if(tabLabelTag==BizApi.SearchResultPageCouponListAPI.tabLabel){//更新 优惠 列表的 tabLabel
                newCouponListTabLable=BizApi.SearchResultPageCouponListAPI.tabLabel+'('+nums+')';
            }

            // Log.log('SearchResultPageReducer SearchResultPageActions.updateTabLabels  return ');
            return {
                ...state,
                merchantListTabLable:newMerchantListTabLable,
                couponListTabLable:newCouponListTabLable
            };
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}