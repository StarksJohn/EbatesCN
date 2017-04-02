/**
 * Created by Ebates on 2017/4/2.
 * AllCouponPageApi.js 全部优惠 页 的 所有API, 因 所有API 都挤在 BizApi 里,不好找
 */
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import *as HistorySearchDB from '../../DB/BizDB/HistorySearchDB'
const {fromJS, List} = require('immutable'); //导入  Immutable.js 的 Record API
import *as SearchResultPageActions from '../../Redux/Actions/SearchResultPageActions'
import SMSTimer from '../../Utils/SMSTimer'
import BizSearchResultPagScrollableTabBar, {UpdateTabUnderlineWidthEventName} from '../../Comp/BizCommonComp/BizSearchResultPagScrollableTabBar'
import *as Math from '../../Utils/Math'
import *as TokenAPI from './TokenAPI'
import *as RequestUtil from '../RequestUtil'
import *as TokenDB from '../../DB/BizDB/TokenDB'
import *as BizLoadingView from '../../Comp/BizCommonComp/BizLoadingView'
import *as BaseGridViewActions from '../../Redux/Actions/BaseGridViewActions'
import *as AllMerchantPageActions from '../../Redux/Actions/AllMerchantPageActions'
import *as BizDropDownMenuAndListActions from '../../Redux/Actions/BizDropDownMenuAndListActions'
import GlobalStyles from '../../Global/GlobalStyles'
import *as BizApi from './BizApi'

/**
 * 全部优惠页 api
 * @type {{}}
 */
export const AllCouponPageApi = {
    ApiName: 'AllCouponPageApi',
    // SearchKeys: '',//筛选出来的关键词

    /**
     * 获取 3 个menu的数据
     */
    fetchMenuData(){
        return (dispatch) => {
            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.ApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, [{
                id: 0,
                title: '分类', //changeTitleEventName: AllMerchantPage.AllMerchantPageChangeCategoryMenuTitleEventName
            }, {
                id: 1,
                title: '排序',
                //changeTitleEventName: AllMerchantPage.AllMerchantPageChangeSortMenuTitleEventName
            }, {
                id: 2,
                title: '商家', //changeTitleEventName: AllMerchantPage.AllMerchantPageChangeFilterMenuTitleEventName
            }]));
        }
    },
}

/**
 * 全部优惠页 优惠列表 的API https://api-staging-current.ebates.cn/docs.html#search-search-coupons-get
 */
export const AllCouponPageListApi = {
    ApiName: 'AllCouponPageListApi',

    /**
     * 全部优惠页 搜索优惠 接口, 也是此页面 第一次进来 的 默认 列表 接口
     * @param BaseProps
     * @returns {function(*)}
     * @constructor
     */
    SearchCoupon (opt, BaseProps){
        return (dispatch) => {
            TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                () => {

                    Log.log('AllCouponPageListApi  SearchCoupon 开始请求 全部优惠页 搜索优惠 接口,opt=' + opt);
                    dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                    let params = {
                        include: 'merchant',
                        page: opt == BaseListActions.BaseListFetchDataType.REFRESH ? 1 : BaseProps.baseReducer.meta.pagination.current_page + 1,
                        perPage: BaseProps.baseReducer.meta.pagination.per_page,
                    };
                    if (AllCouponPageCategoryListApi.categoryID != -1) {
                        params.category = AllCouponPageCategoryListApi.categoryID;
                    }
                    //添加 国家列表 或 筛选下拉列表 选中的 数据
                    // if (AllMerchantPageCountryListApi.tag != '-1' || AllMerchantPageFilterDropDownListApi.tagsArr.length > 0) {
                    //     let tagsArr = [];
                    //     if (AllMerchantPageCountryListApi.tag != '-1') {
                    //         tagsArr.push(AllMerchantPageCountryListApi.tag);
                    //         Log.log('BizApi  AllMerchantPageListApi  SearchMerchants AllMerchantPageCountryListApi.tag=' + AllMerchantPageCountryListApi.tag);
                    //
                    //     }
                    //     if (AllMerchantPageFilterDropDownListApi.tagsArr.length > 0) {//筛选下拉列表有选中的数据
                    //         AllMerchantPageFilterDropDownListApi.tagsArr.map(
                    //             (model, i) => {
                    //                 tagsArr.push(model);
                    //             }
                    //         )
                    //     }
                    //
                    //     params.tag = '';
                    //     tagsArr.map(
                    //         (model, i) => {
                    //             if (i != 0) {
                    //                 params.tag += ',';
                    //             }
                    //             params.tag += model;
                    //         }
                    //     )
                    //
                    //     Log.log('BizApi SearchMerchants params.tag=' + params.tag);
                    //     // params.tag=AllMerchantPageCountryListApi.tag;
                    // }
                    // if (AllMerchantPageSortDropDownListApi.sort_by != '-1') {
                    //     params.sort_by = AllMerchantPageSortDropDownListApi.sort_by;
                    // }

                    Log.log('AllCouponPageListApi  SearchCoupon params=' + JSON.stringify(params));

                    let url = RequestUtil.getStagingOrProductionHost() + 'search/coupons';
                    RequestUtil.GET(url, params,
                        (header) => {
                            BizApi.commonApiHeaderAppend(header)
                        },
                    ).then((responseData) => {
                        // Log.log('BizApi  AllMerchantPageListApi 全部商家页 搜索商家 接口OK, responseData.data =' + Log.writeObjToJson(responseData.data))
                        Log.log('AllCouponPageListApi  SearchCoupon 全部优惠页 搜索优惠 接口OK, responseData.data.length =' + responseData.data.length)

                        //不是 加载更多 时 无数据, 列表 切换到 无数据状态
                        if (responseData.data.length==0 && opt!=BaseListActions.BaseListFetchDataType.MORE){
                            Log.log('BiAllCouponPageListApi  SearchCoupon 全部优惠页 搜索优惠 接口 无数据')
                            dispatch(BaseListActions.NodataAction(this.ApiName, opt));
                        }else{
                            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                                meta: responseData.meta,
                                newContentArray: responseData.data,
                            }));
                        }

                    }).catch((error) => {
                        Log.log('AllCouponPageListApi  SearchCoupon 全部优惠页 搜索优惠 接口失败 =' + error)
                        RequestUtil.showErrorMsg(error)

                        //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                        // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                        // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                        //     couldLoadMore: true,
                        //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                        // }));
                    });
                }
            )

        }
    },

    /**
     * 重置 全部优惠页 的 筛选控件的 所有下拉列表 里 的 已选中的 信息为默认信息
     */
    resetAllDropDownListSelectedInfo(){
        return (dispatch) => {
            AllCouponPageCategoryListApi.resetCategoryListData();
            // AllMerchantPageCountryListApi.resetCountryListData();
            // AllMerchantPageSortDropDownListApi.resetSortListData();
            // dispatch(AllMerchantPageFilterDropDownListApi.clearSelectData());
        }

    }
}

/**
 * 全部优惠页 分类 Category 下拉列表 API,暂时不知道是不是 https://api-staging-current.ebates.cn/docs.html#categories-category-list-get
 * @type {{ApiName: string, export: AllMerchantPageCategoryListApi.export}}
 */
export const AllCouponPageCategoryListApi = {
    ApiName: 'AllCouponPageCategoryListApi',
    $CategoryListDataArray: fromJS([]), //CATEGORY LIST 接口 已经拿到的数据,immutable.List 数据类型  , 里边放 model, toJS()可转成JS 数组
    isLoading: false,//是否正在 请求接口
    isThisCompDidMount: false,//此API 对应的控件是否 挂载中
    categoryID: -1,// 点击 Category 列表 后 选择的 model.id

    /**
     * CATEGORY LIST 接口 https://api-staging-current.ebates.cn/docs.html#categories-category-list-get
     * 拿 全部优惠页 分类下拉列表  的数据
     */
    fetchCategoryList(opt){
        return (dispatch) => {
            {
                if (this.isLoading && this.$CategoryListDataArray.size == 0)//如果 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态
                {
                    Log.log('AllCouponPageApi fetchCategoryList 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态')
                    // new SMSTimer({//为了能 从 初始化状态 切换到 Loading  状态, 否则太快了,切换不了
                    //     timerNums: 1,
                    //     callBack: (time) => {
                    //         Log.log('time===' + time);
                    //         if (time == -1) {
                    //
                    //             dispatch(BaseListActions.Loadinglist(opt, this.ApiName));
                    //             this.isThisCompDidMount = true;
                    //         }
                    //     }
                    // }).start();
                    dispatch(BaseListActions.Loadinglist(opt, this.ApiName));
                    this.isThisCompDidMount = true;

                } else if (!this.isLoading && this.$CategoryListDataArray.size > 0) {//列表挂载时, 接口已经拿到数据,列表直接切到 成功状态
                    dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                        couldLoadMore: false,
                        newContentArray: this.$CategoryListDataArray.toJS(),
                    }));
                    dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, this.$CategoryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH/*每个cell 高 默认 44 ,以后 把此 常量写到 专门的 cell里*/))
                    this.isThisCompDidMount = true;
                }
                else if (!this.isLoading && this.$CategoryListDataArray.size == 0) {//刚进入 全部商家页, 主动 调此接口, 走这里的代码
                    Log.log('AllCouponPageApi  fetchCategoryList 开始请求 全部优惠页 分类下拉列表 接口 ');
                    this.isLoading = true;

                    let url = RequestUtil.getStagingOrProductionHost() + 'categories';
                    RequestUtil.GET(url, {
                            parent: 'top'
                        },
                        (header) => {
                            BizApi.commonApiHeaderAppend(header)
                        },
                    ).then((responseData) => {

                        // new SMSTimer({//模拟 拿到数据后, Loading状态的列表 切到 成功状态
                        //     timerNums: 10,
                        //     callBack: (time) => {
                        //         Log.log('time===' + time);
                        //         if (time == -1){
                        //
                        //         }
                        //     }
                        // }).start();

                        {

                            Log.log('AllCouponPageApi  fetchCategoryList 全部优惠页 分类下拉列表  接口OK, responseData.data.length =' + responseData.data.length)

                            // Log.log('BizApi  fetchCategoryList 全部商家页 分类下拉列表 接口OK, responseData.data =' + Log.writeObjToJson(responseData.data));

                            responseData.data.map(
                                (v, i) => {
                                    // if (i<5)
                                    {
                                        v.isSelect = false;//给每个mode 加 是否被选中 属性
                                        v.index = i + 1;//用于 点击 处理对号的位置

                                        this.$CategoryListDataArray = this.$CategoryListDataArray.set(this.$CategoryListDataArray.size, v);
                                    }
                                }
                            );
                            this.$CategoryListDataArray = this.$CategoryListDataArray.insert(0, {
                                id: -1,
                                name: "全部",
                                slug: null,
                                isSelect: true,
                                index: 0
                            });

                            // Log.log('BizApi  fetchCategoryList 全部商家页 分类下拉列表 的数据源 $CategoryListDataArray=' + Log.writeObjToJson(this.$CategoryListDataArray.toJS()))
                            this.isLoading = false;

                            if (this.isThisCompDidMount) {
                                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                                    couldLoadMore: false,
                                    newContentArray: this.$CategoryListDataArray.toJS(),
                                }));

                                dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, this.$CategoryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH/*每个cell 高 默认 44 ,以后 把此 常量写到 专门的 cell里*/))
                            }


                        }

                    }).catch((error) => {
                        Log.log('AllCouponPageApi   全部优惠页 搜索商家 接口失败 =' + error)
                        RequestUtil.showErrorMsg(error)
                        this.isLoading = false;

                        //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                        // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                        // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                        //     couldLoadMore: true,
                        //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                        // }));
                    });
                }
            }
        }
    },

    /**
     * 重置 category 下拉列表 的默认 选中 cell为 0号cell
     */
    resetCategoryListData(){
        this.isLoading = false;
        this.isThisCompDidMount = false;
        this.categoryID = -1;

        this.$CategoryListDataArray.toJS().map(
            (model, i) => {
                {
                    model.isSelect = false;//给每个mode 加 是否被选中 属性
                    if (i==0){
                        model.isSelect = true;
                    }

                    this.$CategoryListDataArray = this.$CategoryListDataArray.set(i, model);
                }
            }
        );
    },

    /**
     * 重置 CategoryList 接口的 数据 和 其 列表的 高度
     * @returns {function(*)}
     */
    releaseCategoryListData(){
        return (dispatch) => {
            this.$CategoryListDataArray = this.$CategoryListDataArray.clear();
            this.isLoading = false;
            this.isThisCompDidMount = false;
            this.categoryID = -1;
        }

    }
}