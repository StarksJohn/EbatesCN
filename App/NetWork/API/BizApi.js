/**
 * Created by Ebates on 17/1/11.
 * BizApi
 *  * 业务逻辑需要的所有接口
 */
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import *as HistorySearchDB from '../../DB/BizDB/HistorySearchDB'
const {fromJS} = require('immutable'); //导入  Immutable.js 的 Record API
import *as SearchResultPageActions from '../../Redux/Actions/SearchResultPageActions'
import SMSTimer from '../../Utils/SMSTimer'
import BizSearchResultPagScrollableTabBar, {UpdateTabUnderlineWidthEventName} from '../../Comp/BizCommonComp/BizSearchResultPagScrollableTabBar'
import *as Math from '../../Utils/Math'

/**
 * 搜索页 列表的 API
 * @type {{ApiName: string}}
 */
export const SearchPageListApi = {
    ApiName: 'SearchPageListApi',

    //搜索 页 最大列表  的  数据源, 9个按钮+热门搜索 text 是一个 cell, 默认是 热门搜索cell 和 底部留白cell 2个 数据源
    $dataArray: fromJS([[{title: 'GNC'}, {title: 'Walgreens'}, {title: '普丽普莱'}, {title: '黑五'}, {title: '雅诗兰黛'}, {title: 'shoebuy'}, {title: 'Amazon'}, {title: '联名卡'}, {title: 'shoebuy2'}], '底部为了留白的cell']),

    /**
     * 历史搜索 列表 第一次 挂载时| commit后 刷新列表时 获取数据源
     * @param opt
     * @returns {function(*)}
     */
    fetchData(opt){
        return (dispatch) => {

            //rawData:  缓存的 关键词
            HistorySearchDB.loadHistoryDB().then((rawData)=> {
                if (rawData.length > 0) {//有缓存
                    this.packageCachedDataToListDataSource(rawData);
                    dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, this.$dataArray.toJSArray()));
                }
            }).catch(err => {
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, this.$dataArray.toJSArray()));

            });
        }
    },

    /**
     * 把 缓存里更新过的 数据 组装到 列表的 数据源 里
     * @param rawData
     * @param data
     * @returns {boolean}
     */
    packageCachedDataToListDataSource(rawData /*, data*/){

        if (this.$dataArray.size == 2) {
            this.$dataArray = this.$dataArray.insert(1, '历史搜索');
        } else {
            while (this.$dataArray.size > 3) {//删除 关键词 cell, 只保留 热门搜索, 历史搜索,和 底部空白 cell
                this.$dataArray = this.$dataArray.delete(2);
            }
        }

        rawData.map(
            (v, i)=> {
                this.$dataArray = this.$dataArray.insert(-1, v);//数组倒数第二个下标 循环 插入一个 关键字
            }
        );
    },

    /**
     * 清除 关键词 列表
     * @param opt
     * @returns {function(*)}
     */
    clearAllHistorySearch(opt){
        return (dispatch) => {

            this.reset$dataArray();

            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, this.$dataArray.toJSArray()));
        }
    },

    /**
     * 重置 $dataArray 为初始状态, 只保留 热门搜索,和 底部空白 cell
     */
    reset$dataArray(){
        while (this.$dataArray.size > 2) {//删除 关键词 cell, 只保留 热门搜索,和 底部空白 cell
            this.$dataArray = this.$dataArray.delete(1);
        }
    },

    /**
     * 删除某个 关键词
     * @param word
     * @returns {function(*)}
     */
    deleteOneKeyWord(word, opt){
        return (dispatch) => {

            HistorySearchDB.deleteOneKeyWordFromHistoryDB(word).then((rawData)=> {
                if (rawData.length > 0) {//有缓存
                    this.packageCachedDataToListDataSource(rawData);
                } else {
                    this.reset$dataArray();
                }
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, this.$dataArray.toJSArray()));
            }).catch(err => {
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, this.$dataArray.toJSArray()));

            });
        }
    }

}

/**
 * 搜索 结果页 搜索关键词 接口 的 API
 */
export const SearchResultPageSearchKeyWordAPI = {
    ApiName: 'SearchResultPageSearchKeyWordAPI',

    //模拟 搜索结果页 搜素关键词后 拿到的 商家列表 和 优惠列表 的 所有 数据,此方法第一次由 一进入 搜索结果页 ,商家列表 挂载 后 触发,暂时不考虑 这2个列表 还翻页的情况, 因 数据不会很大
    searchKeyWordAPI(opt){

        return (dispatch) => {

            this.timer = new SMSTimer({
                timerNums: 3,
                callBack: (time)=> {
                    Log.log('time===' + time);
                    if (time == -1) {

                        {//模拟拿到 优惠 列表的 第一页 网络数据, 先 刷新 优惠列表的 tabLabel是因为, 商家列表 的 tabLabl 在 第一次进入页面后 先显示,所以 得 最后 发送 商家列表的 updateTabLabelsAction, 让 tabLable底部的 横线 的 长度 适配 商家列表 的 tabLabel
                            let arr = [];
                            let all=Math.randomNums(8,50);
                            for (let i = 0; i < all; i++) {
                                arr.push({index: SearchResultPageCouponListAPI.tabLabel + i});
                            }

                            dispatch(SearchResultPageCouponListAPI.handleNetWorkData(opt, arr, all,true));
                        }

                        {//模拟拿到 商家列表的 所有 网络数据
                            let arr = [];
                            let all=Math.randomNums(8,50);
                            for (let i = 0; i < all; i++) {
                                arr.push({index: SearchResultPageMerchantListAPI.tabLabel + i});
                            }

                            dispatch(SearchResultPageMerchantListAPI.handleNetWorkData(opt, arr, all));
                        }

                    }
                }
            });

            this.timer.start();
        }
    }
}

/**
 * 搜索结果页 的 商家 列表 的 API
 * @type {{ApiName: string}}
 */
export const SearchResultPageMerchantListAPI = {
    ApiName: 'SearchResultPageMerchantListApi',
    tabLabel: '商家',
    tabLabelTotalNums: 0,//用于 商家列表 tab 显示的 通过 搜索关键词 接口 拿到的 数据源总数
    tabLabelCurNums: 0,//用于 商家列表 已经 拿到的数据源 数量
    perPageOfNums: 10,//服务器每页发几条数据

    fetchData(opt, BaseListCompProps){
        return (dispatch) => {
            // Log.log('SearchResultPageMerchantListAPI fetchData() ')

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//控件 挂载时 回调的
                dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, 0));//商家列表的 tabLabel 清零
                dispatch(BaseListActions.InitListDataSource(this.ApiName));// 商家 列表的 $dataArray 清0

                dispatch(SearchResultPageActions.updateTabLabelsAction(SearchResultPageCouponListAPI.tabLabel, 0));//优惠 列表的 tabLabel 清零

                //调 搜索结果页的 搜索关键词 接口,拿2个列表的数据
                dispatch(SearchResultPageSearchKeyWordAPI.searchKeyWordAPI(opt));
            }else if(opt==BaseListActions.BaseListFetchDataType.MORE){//请求 列表 下页数据
                this.timer = new SMSTimer({
                    timerNums: 3,
                    callBack: (time)=> {
                        Log.log('time===' + time);
                        if (time == -1) {

                            {//模拟拿到 商家列表的 一页 网络数据
                                let arr = [];
                                for (let i = 0; i < 10; i++) {
                                    arr.push({index: SearchResultPageMerchantListAPI.tabLabel + i});
                                }

                                dispatch(SearchResultPageMerchantListAPI.handleNetWorkData(opt, arr, this.tabLabelTotalNums));
                            }

                        }
                    }
                });

                this.timer.start();
            }
            dispatch(BaseListActions.Loadinglist(opt, this.ApiName));
        }
    },

    /**
     * 处理 拿到一次 网络请求 后的数据
     * @param opt
     * @param newArr
     * @param tabLabelTotalNums  商家列表 数据总数
     * @returns {function(*)}
     */
    handleNetWorkData(opt, newArr, tabLabelTotalNums){
        return (dispatch) => {

            this.tabLabelTotalNums = tabLabelTotalNums;

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {
                this.tabLabelCurNums=0;
                dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, this.tabLabelTotalNums));

                if (tabLabelTotalNums == 0 ){//模拟没搜索到 关键词 相关的 商家 数据后,发 商家列表的 Nodata action
                    dispatch(SearchResultPageActions.nodataAction(/*BaseListCompProps.route.value,*/this.ApiName, opt));
                    return;
                }
            }

            this.tabLabelCurNums+=newArr.length;

            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                couldLoadMore: this.tabLabelCurNums<this.tabLabelTotalNums,
                newContentArray: newArr
            }));
        }
    }
}

/**
 * 搜索结果页 的 优惠 列表 的 API
 * @type {{ApiName: string}}
 */
export const SearchResultPageCouponListAPI = {
    ApiName: 'SearchResultPageCouponListAPI',
    tabLabel: '优惠',
    tabLabelTotalNums: 0,//用于 列表 tab 显示的 通过 搜索关键词 接口 拿到的 数据源总数
    tabLabelCurNums: 0,//用于 列表 已经 拿到的数据源 数量
    $dataArray: fromJS([]),//存储 SearchResultPageSearchKeyWordAPI.searchKeyWord方法拿到的 优惠列表的 第一页 的 网络数据
    perPageOfNums: 10,//服务器每页发几条数据

    /**
     * 请求数据
     * @param opt
     * @param BaseListCompProps
     * @returns {function(*)}
     */
    fetchData(opt, BaseListCompProps){
        return (dispatch) => {

            // Log.log('BizApi SearchResultPageCouponListAPI fetchData opt=='+opt);
            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE  ){// 第一次挂载
                dispatch(BaseListActions.InitListDataSource(this.ApiName));// 优惠 列表的 $dataArray 清0

                if (this.tabLabelTotalNums>0){// 之前通过 searchKeyWordAPI 接口拿到了 数据
                    this.tabLabelCurNums=0;
                    dispatch(this.handleNetWorkData(opt,this.$dataArray.toJS(),this.tabLabelTotalNums,false));

                }
            }
        }
    },

    /**
     * 处理 拿到一次 网络请求 后的数据
     * @param opt : 怎么请求的
     * @param newArr :一次请求拿到的 数据
     * @param tabLabelTotalNums  列表 数据总数
     * @param isDataFromSearchKeyWordAPI:
     *      要处理的数据 是否来自 searchKeyWordAPI
     *          true: 此时 此控件还没挂载, 不发 SuccessFetchinglist
     *          false:此时 此控件 刚 挂载 或 请求好了 下页数据
     * @returns {function(*)}
     */
    handleNetWorkData(opt, newArr, tabLabelTotalNums, isDataFromSearchKeyWordAPI){
        return (dispatch) => {

            this.tabLabelTotalNums = tabLabelTotalNums;

            if (  isDataFromSearchKeyWordAPI ) {//处理 searchKeyWordAPI 接口拿到的 数据 , 重置 tabLabel, $dataArray
                this.tabLabelCurNums=0;
                dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, this.tabLabelTotalNums));
                this.$dataArray=this.$dataArray.clear();

                if (tabLabelTotalNums == 0 ){//模拟没搜索到 关键词 相关的 优惠 数据后,发 优惠 列表的 Nodata action
                    dispatch(SearchResultPageActions.nodataAction(/*BaseListCompProps.route.value,*/this.ApiName, opt));
                    return;
                }

                newArr.map(
                    (v, i)=> {
                        this.$dataArray = this.$dataArray.push(v);
                    }
                );
            }

            this.tabLabelCurNums+=newArr.length;

            if (!isDataFromSearchKeyWordAPI){
                // Log.log('SearchResultPageCouponListAPI handleNetWorkData SuccessFetchinglist() newArr=='+newArr);
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                    couldLoadMore: this.tabLabelCurNums<this.tabLabelTotalNums,
                    newContentArray: newArr
                }));
            }

        }
    }
}


/**
 * 初步分解 各种API
 * @param opt
 * @param pageNo
 * @param BaseListCompProps 外部传给 BaseListComp的 props
 * @returns {*}
 */
export function fetchApi(opt, pageNo, BaseListCompProps) {
    switch (BaseListCompProps.baseReducer.ApiName) {
        case SearchPageListApi.ApiName: {
            return SearchPageListApi.fetchData(opt);
        }
            break;
        case SearchResultPageMerchantListAPI.ApiName: {
            return SearchResultPageMerchantListAPI.fetchData(opt, BaseListCompProps);
        }
            break;
        case SearchResultPageCouponListAPI.ApiName: {
            return SearchResultPageCouponListAPI.fetchData(opt, BaseListCompProps);
        }
            break;
    }
}