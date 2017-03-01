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
import *as TokenAPI from './TokenAPI'
import *as RequestUtil from '../RequestUtil'
import *as TokenDB from '../../DB/BizDB/TokenDB'

/**
 * 注册页面的API
 * @type {{ApiName: string}}
 */
export const RegisterPageApi = {
    ApiName: 'RegisterPageApi',

    /**
     * 注册接口
     */
    registerUser (body) {
        return new Promise(
            (resolve, reject) => {

                let url = RequestUtil.getStagingOrProductionHost() + 'users';
                RequestUtil.POST(url,
                    (header) => {
                        commonApiHeaderAppend(header)
                    }, body
                ).then((responseData) => {
                    resolve(responseData);
                }).catch((error) => {
                    reject(error);
                });
            }
        );
    }

}

/**
 * 除了 获取非登录token接口, 其他接口的header里 都 需要加 ('Authorization', 'Bearer ' + 'xxx')
 */
export function commonApiHeaderAppend(header) {
    let token = TokenDB.getAvailableToken();

    header.append('Authorization', token.data.token_type + ' ' + token.data.access_token);//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
}

/**
 * Captcha 图片验证码接口
 * @type {{ApiName: string, data: {captchaUrl: string, captchaUuid: string}}}
 */
export const ImgOauthCodeAPI = {
    ApiName: 'ImgOauthCodeAPI',
    data: {
        captchaUrl: '',
        captchaUuid: '',//注册接口里传给服务器
    },
    requestCaptcha() {
        return new Promise(
            (resolve, reject) => {

                let url = RequestUtil.getStagingOrProductionHost() + 'captchaInfo';
                RequestUtil.GET(url, null,
                    (header) => {
                        // header.append('Authorization', 'Bearer ' + 'xxx');//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
                        commonApiHeaderAppend(header)
                    },
                ).then((responseData) => {
                    // Log.log('TokenAPI getClientTokenApi resolve ');
                    this.data = responseData;
                    resolve(this.data.captchaUrl);
                }).catch((error) => {
                    reject(error);
                });
            }
        );
    }
}

/**
 * 忘记密码 页面的API
 * @type {{ApiName: string}}
 */
export const ForgetPassPageApi = {
    ApiName: 'ForgetPassPageApi',

}

/**
 * 搜索页 列表的 API
 * @type {{ApiName: string}}
 */
export const SearchPageListApi = {
    ApiName: 'SearchPageListApi',

    //搜索 页 最大列表  的  数据源, 9个按钮+热门搜索 text 是一个 cell, 默认是 热门搜索cell 和 底部留白cell 2个 数据源
    $dataArray: fromJS([[{title: 'GNC'}, {title: 'Walgreens'}, {title: '普丽普莱普丽普莱普丽普莱普丽普莱普丽普莱'}, {title: '黑五'}, {title: '雅诗兰黛'}, {title: 'shoebuy'}, {title: 'Amazon'}, {title: '联名卡'}, {title: 'shoebuy2'}], '底部为了留白的cell']),

    /**
     * 历史搜索 列表 第一次 挂载时| commit后 刷新列表时 获取数据源
     * @param opt
     * @returns {function(*)}
     */
    fetchData(opt){
        return (dispatch) => {

            //rawData:  缓存的 关键词
            HistorySearchDB.loadHistoryDB().then((rawData) => {
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
            (v, i) => {
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

            HistorySearchDB.deleteOneKeyWordFromHistoryDB(word).then((rawData) => {
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

    /**
     * 模拟 搜索结果页 搜素关键词  接口 ,此方法第一次 调用 由 一进入 搜索结果页 商家列表 挂载 后 触发 拿到 商家列表 和 优惠列表 的 第一页 数据; 之后 可能由于 在搜索结果页 再次搜索 后触发,再次搜索调用此接口时,opt 发 REFRESH ;  也可能 在这2个列表 翻页时 触发
     * @param opt
     * @param keyword
     * @returns {function(*)}
     */
    searchKeyWordAPI(opt, keyword){

        return (dispatch) => {

            this.timer = new SMSTimer({
                timerNums: 3,
                callBack: (time) => {
                    Log.log('time===' + time);
                    if (time == -1) {

                        if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {//模拟 拿到2个列表的 第一页数据, 调用的搜索API

                            {//模拟拿到 优惠 列表的 第一页 网络数据, 先 刷新 优惠列表的 tabLabel是因为, 商家列表 的 tabLabl 在 第一次进入页面后 先显示,所以 得 最后 发送 商家列表的 updateTabLabelsAction, 让 tabLable底部的 横线 的 长度 适配 商家列表 的 tabLabel
                                let arr = [];
                                let all = Math.randomNums(3, 30);

                                let firstPageNums = (all > SearchResultPageCouponListAPI.perPageOfNums ? SearchResultPageCouponListAPI.perPageOfNums : all);
                                //模拟 服务器发来的 第一页 数据
                                for (let i = 0; i < firstPageNums; i++) {
                                    arr.push({index: SearchResultPageCouponListAPI.tabLabel + i});
                                }

                                dispatch(SearchResultPageCouponListAPI.handleNetWorkData(opt, arr, all));
                            }

                            {//模拟拿到 商家列表的 第一页 网络数据
                                let arr = [];
                                let all = Math.randomNums(4, 30);
                                let firstPageNums = (all > SearchResultPageMerchantListAPI.perPageOfNums ? SearchResultPageMerchantListAPI.perPageOfNums : all);

                                for (let i = 0; i < firstPageNums; i++) {
                                    arr.push({index: SearchResultPageMerchantListAPI.tabLabel + i});
                                }

                                dispatch(SearchResultPageMerchantListAPI.handleNetWorkData(opt, arr, all));
                            }
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

    fetchData(opt, keyWord){
        return (dispatch) => {
            // Log.log('SearchResultPageMerchantListAPI fetchData() ')

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {//此 控件 首次 挂载时 回调的
                dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, 0));//商家列表的 tabLabel 清零
                dispatch(BaseListActions.InitListDataSource(this.ApiName));// 商家 列表的 $dataArray 清0

                dispatch(SearchResultPageActions.updateTabLabelsAction(SearchResultPageCouponListAPI.tabLabel, 0));//优惠 列表的 tabLabel 清零

                //调 搜索结果页的 搜索关键词 接口,拿2个列表的数据
                dispatch(SearchResultPageSearchKeyWordAPI.searchKeyWordAPI(opt, keyWord));
            } else if (opt == BaseListActions.BaseListFetchDataType.MORE) {//请求 列表 下页数据
                this.timer = new SMSTimer({
                    timerNums: 3,
                    callBack: (time) => {
                        Log.log('time===' + time);
                        if (time == -1) {

                            {//模拟拿到 商家列表的 下一页 网络数据
                                let arr = [];
                                let newPageDataNums = this.tabLabelTotalNums - this.tabLabelCurNums >= this.perPageOfNums ? this.perPageOfNums : this.tabLabelTotalNums - this.tabLabelCurNums;//模拟服务器发来的 下页数据
                                for (let i = 0; i < newPageDataNums; i++) {
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

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {
                this.tabLabelCurNums = 0;
                dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, this.tabLabelTotalNums));

                if (tabLabelTotalNums == 0) {//模拟没搜索到 关键词 相关的 商家 数据后,发 商家列表的 Nodata action
                    dispatch(SearchResultPageActions.nodataAction(/*BaseListCompProps.route.value,*/this.ApiName, opt));
                    return;
                }

                //搜索结果页 再次搜索, 拿到数据后,触发 刷新
                if (opt == BaseListActions.BaseListFetchDataType.REFRESH) {
                    dispatch(BaseListActions.InitListDataSource(this.ApiName));// 商家 列表的 $dataArray 清0
                }
            }

            this.tabLabelCurNums += newArr.length;

            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                couldLoadMore: this.tabLabelCurNums < this.tabLabelTotalNums,
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
    componentDidMount: false,//false: 此时 此控件还没挂载, 不发 SuccessFetchinglist   true:此时 此控件 刚 挂载 或 请求好了 下页数据

    /**
     * 请求数据
     * @param opt
     * @param keyWord
     * @returns {function(*)}
     */
    fetchData(opt, keyWord){
        return (dispatch) => {

            // Log.log('BizApi SearchResultPageCouponListAPI fetchData opt=='+opt);
            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {// 第一次挂载
                dispatch(BaseListActions.InitListDataSource(this.ApiName));// 优惠 列表的 $dataArray 清0

                if (!this.componentDidMount && opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//第一次挂载
                    this.componentDidMount = true;

                    if (this.tabLabelTotalNums > 0) {// 之前通过 searchKeyWordAPI 接口拿到了 数据
                        this.tabLabelCurNums = 0;

                        dispatch(this.handleNetWorkData(opt, this.$dataArray.toJS(), this.tabLabelTotalNums));
                    } else {
                        dispatch(SearchResultPageActions.nodataAction(this.ApiName, opt));
                    }

                } else if (opt == BaseListActions.BaseListFetchDataType.REFRESH && this.componentDidMount) {//搜索结果页, 优惠列表已挂载后, 再次搜索,触发 此接口
                    dispatch(BaseListActions.Loadinglist(opt, this.ApiName));//优惠列表 变loading 状态
                    dispatch(SearchResultPageActions.updateTabLabelsAction(SearchResultPageMerchantListAPI.tabLabel, 0));//商家列表的 tabLabel 清零
                    // dispatch(BaseListActions.InitListDataSource(SearchResultPageMerchantListAPI.ApiName));// 商家 列表的 $dataArray 清0
                    dispatch(SearchResultPageActions.updateTabLabelsAction(SearchResultPageCouponListAPI.tabLabel, 0));//优惠 列表的 tabLabel 清零
//调 搜索结果页的 搜索关键词 接口,拿2个列表的数据
                    dispatch(SearchResultPageSearchKeyWordAPI.searchKeyWordAPI(opt, keyWord));
                }

            } else if (opt == BaseListActions.BaseListFetchDataType.MORE) {//请求 列表的 下页数据
                dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                this.timer = new SMSTimer({
                    timerNums: 3,
                    callBack: (time) => {
                        Log.log('time===' + time);
                        if (time == -1) {

                            {//模拟拿到 优惠 列表的 下一页 网络数据
                                let arr = [];
                                let newPageDataNums = this.tabLabelTotalNums - this.tabLabelCurNums >= this.perPageOfNums ? this.perPageOfNums : this.tabLabelTotalNums - this.tabLabelCurNums
                                for (let i = 0; i < newPageDataNums; i++) {
                                    arr.push({index: SearchResultPageMerchantListAPI.tabLabel + i});
                                }

                                dispatch(this.handleNetWorkData(opt, arr, this.tabLabelTotalNums));
                            }

                        }
                    }
                });

                this.timer.start();
            }
        }
    },

    /**
     * 处理 优惠列表 拿到一次 网络请求 后的数据
     * @param opt : 怎么请求的
     * @param newArr :一次请求拿到的 数据
     * @param tabLabelTotalNums  列表 数据总数
     * @returns {function(*)}
     */
    handleNetWorkData(opt, newArr, tabLabelTotalNums){
        return (dispatch) => {

            this.tabLabelTotalNums = tabLabelTotalNums;

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {//处理 刚进页面,  searchKeyWordAPI 接口拿到的 数据 , 重置 tabLabel, $dataArray
                this.tabLabelCurNums = 0;
                dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, this.tabLabelTotalNums));

                if (tabLabelTotalNums == 0) {//模拟没搜索到 关键词 相关的 优惠 数据后,发 优惠 列表的 Nodata action
                    dispatch(SearchResultPageActions.nodataAction(/*BaseListCompProps.route.value,*/this.ApiName, opt));
                    Log.log('BizApi SearchResultPageCouponListAPI handleNetWorkData nodataAction')
                    return;
                }

                if (!this.componentDidMount) {
                    this.$dataArray = this.$dataArray.clear();
                    newArr.map(
                        (v, i) => {
                            this.$dataArray = this.$dataArray.push(v);
                        }
                    );
                }

            }

            this.tabLabelCurNums += newArr.length;

            // if (opt == BaseListActions.BaseListFetchDataType.REFRESH) {
            //     dispatch(BaseListActions.InitListDataSource(this.ApiName));// 优惠 列表的 $dataArray 清0
            // }

            if (this.componentDidMount) {
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                    couldLoadMore: this.tabLabelCurNums < this.tabLabelTotalNums,
                    newContentArray: newArr
                }));
            }

        }
    }
}

/**
 * 商家页面API
 * @type {{}}
 */
export const MerchantPageApi = {
    ApiName: 'MerchantPageApi',

    /**
     * 初始化 商家页 列表 的 默认数据源, 也就是 0号cell的数据源
     * @param opt
     * @returns {function(*)}
     */
    fetchData(opt){
        return (dispatch) => {
            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//一开始 挂载
                dispatch(BaseListActions.InitListDataSource(this.ApiName));// 当前 列表的 $dataArray 清0

                let arr = [{
                    img: require('../../Img/store_icon_baby.png'),
                    title: '母婴'
                }, {
                    img: require('../../Img/store_icon_fashion.png'),
                    title: '时尚'
                }, {img: require('../../Img/store_icon_beauty.png'), title: '美妆'}, {
                    img: require('../../Img/store_icon_health.png'),
                    title: '健康美护'
                }, {
                    img: require('../../Img/store_icon_supplements.png'),
                    title: '保健'
                }, {
                    img: require('../../Img/store_icon_sport.png'),
                    title: '运动'
                }, {
                    img: require('../../Img/store_icon_outdoor.png'),
                    title: '户外'
                }, {img: require('../../Img/store_icon_all.png'), title: '全部'}];

                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                    couldLoadMore: true,
                    newContentArray: [arr]
                }));

                dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                // this.fetchTopTen();
                TokenAPI.checkUnLoginTokenExpires().then(
                    () => {
                        dispatch(MerchantPageApi.fetchTopTen());
                    }
                );

            }
        }
    },

    /**
     * 获取top10商家数据
     */
    fetchTopTen(){
        return (dispatch) => {

            this.timer = new SMSTimer({
                timerNums: 1.5,
                callBack: (time) => {
                    Log.log('time===' + time);
                    if (time == -1) {

                        {//模拟拿到 top10商家数据 网络数据
                            let arr = [];
                            for (let i = 0; i < 13; i++) {
                                arr.push({index: i});
                            }
                            dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.MORE, this.ApiName, {
                                couldLoadMore: false,
                                newContentArray: arr
                            }));
                        }

                    }
                }
            });
            this.timer.start();
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
            return SearchResultPageMerchantListAPI.fetchData(opt, BaseListCompProps.route.value);
        }
            break;
        case SearchResultPageCouponListAPI.ApiName: {
            return SearchResultPageCouponListAPI.fetchData(opt, BaseListCompProps.route.value);
        }
            break;
        case MerchantPageApi.ApiName: {
            return MerchantPageApi.fetchData(opt);
        }
            break;
    }
}
