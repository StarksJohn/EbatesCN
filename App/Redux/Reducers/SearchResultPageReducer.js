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
    // couponTabLable: BizApi.SearchResultPageMerchantListAPI.tabLabel+'(0)',
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
            let value = action.value;
            let newMerchantListTabLable=state.merchantListTabLable;
            if (value.tabLabelTag==BizApi.SearchResultPageMerchantListAPI.tabLabel){//更新 商家 列表的 tabLabel
                newMerchantListTabLable=BizApi.SearchResultPageMerchantListAPI.tabLabel+'('+value.nums+')';
            }
            return {
                ...state,
                merchantListTabLable:newMerchantListTabLable,
            };
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}