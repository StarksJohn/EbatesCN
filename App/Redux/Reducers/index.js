import {combineReducers} from 'redux';
import RootPageReducer from './RootPageReducer';
import HomePageReducer from './HomePageHotCouponListReducer'
import quickLogReducer from './QuickLogReducer'
import RegisterReducer from './RegisterReducer'
import LogInReducer from './LogInReducer'
import RootComponentReducer from './RootComponentReducer'
import RootHomeNavReducer from './RootHomeNavReducer'
import RootRecommendFriendNavReducer from './RootRecommendFriendNavReducer'
import SearchPageListReducer from './SearchPageListReducer'
import SearchResultPageMerchantListReducer from './SearchResultPageMerchantListReducer'
import SearchResultPageReducer from './SearchResultPageReducer'
import SearchResultPageCouponListReducer from './SearchResultPageCouponListReducer'
import MerchantPageReducer from './MerchantPageReducer'
import ForgetPassPageReducer from './ForgetPassPageReducer'
import AllMerchantPageGridViewReducer from './AllMerchantPageGridViewReducer'
import MerchantPageGridViewReducer from './MerchantPageGridViewReducer'
import SearchPageGridViewReducer from './SearchPageGridViewReducer'
import MerchantDetailPageReducer from './MerchantDetailPageReducer'
import MerchantDetailPageMarkGridViewReducer from './MerchantDetailPageMarkGridViewReducer'
import TransferWebViewPageReducer from './TransferWebViewPageReducer'
import HomePageHotCouponListReducer from './HomePageHotCouponListReducer'
import HomePageHotClickCouponListReducer from './HomePageHotClickCouponListReducer'
import HomePageEBCouponListReducer from './HomePageEBCouponListReducer'
import AllMerchantPageReducer from './AllMerchantPageReducer'
import AllMerchantPageListReducer from './AllMerchantPageListReducer'
import AllMerchantPageCategoryListReducer from './AllMerchantPageCategoryListReducer'
import BizDropDownMenuAndListReducer from './BizDropDownMenuAndListReducer'
import AllMerchantPageCountryListReducer from './AllMerchantPageCountryListReducer'

export default combineReducers({
    RootPageReducer,HomePageReducer,quickLogReducer,RegisterReducer,LogInReducer,RootComponentReducer,RootHomeNavReducer,RootRecommendFriendNavReducer,SearchPageListReducer,SearchResultPageMerchantListReducer,SearchResultPageReducer,SearchResultPageCouponListReducer,MerchantPageReducer,ForgetPassPageReducer,AllMerchantPageGridViewReducer,MerchantPageGridViewReducer,SearchPageGridViewReducer,MerchantDetailPageReducer,MerchantDetailPageMarkGridViewReducer,TransferWebViewPageReducer,HomePageHotCouponListReducer,HomePageHotClickCouponListReducer,HomePageEBCouponListReducer,AllMerchantPageListReducer,AllMerchantPageReducer,AllMerchantPageCategoryListReducer,BizDropDownMenuAndListReducer,AllMerchantPageCountryListReducer
});
