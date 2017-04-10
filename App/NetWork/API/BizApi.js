/**
 * Created by Ebates on 17/1/11.
 * BizApi
 *  * 业务逻辑需要的所有接口
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
import *as AllMerchantPage from '../../Pages/AllMerchantPage'
import *as AllCouponPageApi from './AllCouponPageApi'
import *as CouponDetailPageApi from './CouponDetailPageApi'
import *as PersonalPageApi from './PersonalPageApi'
import *as SettingPageApi from './SettingPageApi'
import *as AboutEbatesCnPageApi from './AboutEbatesCnPageApi'

/**
 * 列表类型 接口 都会返回的 通用的 可判断 couldLoadMore 的 数据结构
 * @type {{pagination: {total: number, count: number, per_page: number, current_page: number, total_pages: number, links: {next: number, previous: number}}}}
 */
export const metaSchema = {
    "pagination": {
        "total": 0,
        "count": 0,
        "per_page": 0,
        "current_page": 0,
        "total_pages": 0,
        "links": {
            "next": 0,
            "previous": 0
        }
    }
}

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
                BizLoadingView.showBizLoadingView('加载中....');

                let url = RequestUtil.getStagingOrProductionHost() + 'users';
                RequestUtil.POST(url,
                    (header) => {
                        commonApiHeaderAppend(header)
                    }, body
                ).then((responseData) => {
                    resolve(responseData);
                    BizLoadingView.closeBizLoadingView();

                }).catch((error) => {
                    RequestUtil.showErrorMsg(error);
                    BizLoadingView.closeBizLoadingView();

                    reject(error);
                });
            }
        );
    }

}

/**
 * 登录的API
 * @type {{ApiName: string}}
 */
export const LogInApi = {
    ApiName: 'LogInApi',

    /**
     * 登录接口,返回登陆后token并 缓存+内存赋值
     */
    getAccessToken (_body) {
        return new Promise(
            (resolve, reject) => {
                BizLoadingView.showBizLoadingView('加载中....');

                let body = {
                    ..._body, grant_type: 'password',
                    client_id: TokenDB.LoginTokenclient_id,
                    client_secret: TokenDB.LoginTokenclient_secret
                };
                Log.log('BizApi LogInApi getAccessToken() body=' + Log.writeObjToJson(body));
                let url = RequestUtil.getStagingOrProductionHost() + 'oauth/access_token';
                RequestUtil.POST(url,
                    (header) => {
                        commonApiHeaderAppend(header)
                    }, body
                ).then((responseData) => {
                    BizLoadingView.closeBizLoadingView();
                    Log.log('BizApi LogInApi getAccessToken 登录接口成功')

                    TokenDB.saveLoginStateToken(responseData);
                    resolve(TokenDB.loginTokenSchema.data);
                }).catch((error) => {
                    // RequestUtil.showErrorMsg(error);
                    Log.log('BizApi LogInApi getAccessToken 登录接口失败 error.error=' + Log.writeObjToJson(error.error))
                    BizLoadingView.closeBizLoadingView();
                    reject(error);
                });
            }
        );
    },

    /**
     * 刷新 登录 token
     */
    getRefreshToken(){
        return new Promise(
            (resolve, reject) => {
                let body = {
                    grant_type: 'refresh_token',
                    client_id: TokenDB.LoginTokenclient_id,
                    client_secret: TokenDB.LoginTokenclient_secret,
                    refresh_token: TokenDB.loginTokenSchema.data.refresh_token

                }
                let url = RequestUtil.getStagingOrProductionHost() + 'oauth/refresh_token';
                Log.log('BizApi getRefreshToken url=' + url);
                Log.log('BizApi getRefreshToken body=' + Log.writeObjToJson(body));

                RequestUtil.POST(url,
                    (header) => {
                        //此时传 未登录token
                        Log.log('BizApi  LogInApi getRefreshToken TokenDB.unLoginTokenSchema.data=' + Log.writeObjToJson(TokenDB.unLoginTokenSchema.data));
                        header.append('Authorization', TokenDB.unLoginTokenSchema.data.token_type + ' ' + TokenDB.unLoginTokenSchema.data.access_token);//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
                        // Log.log('BizApi LogInApi getRefreshToken header='+Log.writeObjToJson(header.toJSONString()));
                    }, body
                ).then((responseData) => {
                    TokenDB.saveLoginStateToken(responseData);
                    resolve(TokenDB.loginTokenSchema.data);
                }).catch((error) => {
                    RequestUtil.showErrorMsg(error);
                    Log.log('BizApi LogInApi getRefreshToken 刷新登录token失败 error.error=' + Log.writeObjToJson(error.error))
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
    let token = TokenDB.getAvailableToken();//此token必须是未过期的

    // Log.log('BizApi commonApiHeaderAppend token.data.access_token=' + token.data.access_token);
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
                // BizLoadingView.showBizLoadingView('加载中....');

                Log.log('BizApi ImgOauthCodeAPI requestCaptcha 开始请求 图片验证码接口')
                let url = RequestUtil.getStagingOrProductionHost() + 'captchaInfo';
                RequestUtil.GET(url, null,
                    (header) => {
                        // header.append('Authorization', 'Bearer ' + 'xxx');//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
                        commonApiHeaderAppend(header)
                    },
                ).then((responseData) => {
                    // Log.log('TokenAPI getClientTokenApi resolve ');
                    Log.log('BizApi ImgOauthCodeAPI requestCaptcha 图片验证码接口 请求成功')
                    // BizLoadingView.closeBizLoadingView();

                    this.data = responseData;
                    resolve(this.data.captchaUrl);
                }).catch((error) => {
                    Log.log('BizApi ImgOauthCodeAPI requestCaptcha 图片验证码接口 请求失败')
                    // BizLoadingView.closeBizLoadingView();

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

    forgetPassword(body) {
        return new Promise(
            (resolve, reject) => {
                BizLoadingView.showBizLoadingView('加载中....');

                let url = RequestUtil.getStagingOrProductionHost() + 'users/forget-password';

                RequestUtil.POST(url, (header) => {
                        Log.log('BizApi ForgetPassPageApi forgetPassword TokenDB.unLoginTokenSchema.data=' + Log.writeObjToJson(TokenDB.unLoginTokenSchema.data))
                        header.append('Authorization', TokenDB.unLoginTokenSchema.data.token_type + ' ' + TokenDB.unLoginTokenSchema.data.access_token);//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
                    },
                    body
                ).then((responseData) => {
                    Log.log('BizApi ForgetPassPageApi forgetPassword  忘记密码接口返回成功 responseData=' + Log.writeObjToJson(responseData));
                    resolve(responseData);
                    BizLoadingView.closeBizLoadingView();

                }).catch((error) => {
                    Log.log('BizApi ForgetPassPageApi forgetPassword 忘记密码接口返回失败 error=' + Log.writeObjToJson(error));
                    reject(error);
                    RequestUtil.showErrorMsg(error)
                    BizLoadingView.closeBizLoadingView();

                });
            }
        );
    }
}

/**
 * 搜索页 列表的 API
 * @type {{ApiName: string}}
 */
export const SearchPageListApi = {
    ApiName: 'SearchPageListApi',

    //搜索 页 最大列表  的  数据源, 9个按钮+热门搜索 text 是一个 cell, 默认是 热门搜索cell 和 底部留白cell 2个 数据源
    $dataArray: fromJS([{key: '0号cell'}, '底部为了留白的cell']),

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
     * 热门搜索 按钮 数据源
     */
    fetchHotSearchBtData(){
        return (dispatch) => {

            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.ApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, [{title: 'GNC'}, {title: 'Walgreens'}, {title: '普丽普莱普丽普莱普丽普莱普丽普莱普丽普莱'}, {title: '黑五'}, {title: '雅诗兰黛'}, {title: 'shoebuy'}, {title: 'Amazon'}, {title: '联名卡'}, {title: 'shoebuy2'}]));

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
 * https://api-staging-current.ebates.cn/docs.html#search-search-coupons-get 搜索结果页 优惠列表的 api
 * https://api-staging-current.ebates.cn/docs.html#search-search-merchants-get 搜索结果页 商家列表 API
 */
// export const SearchResultPageSearchKeyWordAPI = {
//     ApiName: 'SearchResultPageSearchKeyWordAPI',
//
//     /**
//      * 模拟 搜索结果页 搜素关键词  接口 ,此方法第一次 调用 由 一进入 搜索结果页 商家列表 挂载 后 触发 拿到 商家列表 和 优惠列表 的 第一页 数据; 之后 可能由于 在搜索结果页 再次搜索 后触发,再次搜索调用此接口时,opt 发 REFRESH ;  也可能 在这2个列表 翻页时 触发
//      * @param opt
//      * @param keyword
//      * @returns {function(*)}
//      */
//     searchKeyWordAPI(opt, keyword){
//
//         return (dispatch) => {
//
//             this.timer = new SMSTimer({
//                 timerNums: 3,
//                 callBack: (time) => {
//                     Log.log('time===' + time);
//                     if (time == -1) {
//
//                         if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {//模拟 拿到2个列表的 第一页数据, 调用的搜索API
//
//                             {//模拟拿到 优惠 列表的 第一页 网络数据, 先 刷新 优惠列表的 tabLabel是因为, 商家列表 的 tabLabl 在 第一次进入页面后 先显示,所以 得 最后 发送 商家列表的 updateTabLabelsAction, 让 tabLable底部的 横线 的 长度 适配 商家列表 的 tabLabel
//                                 let arr = [];
//                                 let all = Math.randomNums(3, 30);
//
//                                 let firstPageNums = (all > SearchResultPageCouponListAPI.perPageOfNums ? SearchResultPageCouponListAPI.perPageOfNums : all);
//                                 //模拟 服务器发来的 第一页 数据
//                                 for (let i = 0; i < firstPageNums; i++) {
//                                     arr.push({index: SearchResultPageCouponListAPI.tabLabel + i});
//                                 }
//
//                                 dispatch(SearchResultPageCouponListAPI.handleNetWorkData(opt, arr, all));
//                             }
//
//
//                             {//模拟拿到 商家列表的 第一页 网络数据
//                                 let arr = [];
//                                 let all = Math.randomNums(4, 30);
//                                 let firstPageNums = (all > SearchResultPageMerchantListAPI.perPageOfNums ? SearchResultPageMerchantListAPI.perPageOfNums : all);
//
//                                 for (let i = 0; i < firstPageNums; i++) {
//                                     arr.push({index: SearchResultPageMerchantListAPI.tabLabel + i});
//                                 }
//
//                                 dispatch(SearchResultPageMerchantListAPI.handleNetWorkData(opt, arr, all));
//                             }
//
//                             // {//模拟商家列表网络异常
//                             //     dispatch(BaseListActions.FailureFetchinglist(opt, SearchResultPageMerchantListAPI.ApiName ));
//                             // }
//                         }
//                     }
//                 }
//             });
//
//             this.timer.start();
//         }
//     }
// }

/**
 * 搜索结果页 的 商家 列表 的 API,在 商家列表 挂载,加载更多, 重新搜索刷新 商家列表 时 调用此api的 函数, 挂载和重新搜索时, 此API 还负责调 https://api-staging-current.ebates.cn/docs.html#search-search-coupons-count-get 接口 拿 优惠列表的 tabLabel 显示的 数量
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

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH/*此处的刷新就是 搜索结果页 重新搜索 事件*/) {//此 控件 首次 挂载| 重新搜索 时 回调的
                if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {
                    dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, 0));//商家列表的 tabLabel 清零
                    dispatch(SearchResultPageActions.updateTabLabelsAction(SearchResultPageCouponListAPI.tabLabel, 0));//优惠 列表的 tabLabel 清零
                }


                //重新搜索,重置2个列表的数据源,但是貌似 没等 重置完,就 开始请求 接口了,导致 BaseListCompProps.baseReducer.meta 数据还是上次接口返回的数据
                // if (opt == BaseListActions.BaseListFetchDataType.REFRESH){
                //     dispatch(BaseListActions.InitListDataSource(this.ApiName));// 商家 列表的 InitListState  重置
                //     dispatch(BaseListActions.InitListDataSource(SearchResultPageCouponListAPI.ApiName));// 优惠 列表的
                //     // InitListState  重置
                // }

                dispatch(this.SearchMerchantsCountApi(BaseListCompProps));
                dispatch(SearchResultPageCouponListAPI.SearchCouponsCountApi(BaseListCompProps));

                //调 搜索结果页的 搜索关键词 接口,拿2个列表的数据
                // dispatch(SearchResultPageSearchKeyWordAPI.searchKeyWordAPI(opt, keyWord));
            }
            // else if (opt == BaseListActions.BaseListFetchDataType.MORE) {//请求 列表 下页数据
            //     this.timer = new SMSTimer({
            //         timerNums: 3,
            //         callBack: (time) => {
            //             Log.log('time===' + time);
            //             if (time == -1) {
            //
            //                 {//模拟拿到 商家列表的 下一页 网络数据
            //                     let arr = [];
            //                     let newPageDataNums = this.tabLabelTotalNums - this.tabLabelCurNums >= this.perPageOfNums ? this.perPageOfNums : this.tabLabelTotalNums - this.tabLabelCurNums;//模拟服务器发来的 下页数据
            //                     for (let i = 0; i < newPageDataNums; i++) {
            //                         arr.push({index: SearchResultPageMerchantListAPI.tabLabel + i});
            //                     }
            //                     dispatch(SearchResultPageMerchantListAPI.handleNetWorkData(opt, arr, this.tabLabelTotalNums));
            //                 }
            //
            //             }
            //         }
            //     });
            //
            //     this.timer.start();
            // }
            TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                () => {
                    Log.log('BizApi SearchResultPageMerchantListAPI 开始 调 搜索结果页 商家 列表 接口  ')

                    Log.log('BizApi SearchResultPageMerchantListAPI BaseListCompProps.baseReducer.meta.pagination=' + Log.writeObjToJson(BaseListCompProps.baseReducer.meta.pagination));

                    {
                        dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                        let url = RequestUtil.getStagingOrProductionHost() + 'search/merchants';
                        RequestUtil.GET(url, {
                                q: BaseListCompProps.route.value,
                                page: BaseListCompProps.baseReducer.meta.pagination.current_page + 1,
                                perPage: BaseListCompProps.baseReducer.meta.pagination.per_page,
                                include: 'hot_coupons'/* */,
                            },
                            (header) => {
                                commonApiHeaderAppend(header)
                            },
                        ).then((responseData) => {
                            Log.log('BizApi  SearchResultPageMerchantListAPI 搜索结果页 商家列表 接口OK, responseData.data.length =' + responseData.data.length)

                            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                                meta: responseData.meta,
                                newContentArray: responseData.data,
                            }));
                        }).catch((error) => {
                            Log.log('BizApi  SearchResultPageMerchantListAPI 搜索结果页 商家列表 接口失败 =' + error)
                            RequestUtil.showErrorMsg(error)

                            //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                            // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                            // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                            //     couldLoadMore: true,
                            //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                            // }));
                        });
                    }
                }
            );
        }
    },

    /**
     * 搜索结果页 获取 商家列表 tabLabel 显示数量 的 接口
     * https://api-staging-current.ebates.cn/docs.html#search-search-merchants-count-get
     * @constructor
     */
    SearchMerchantsCountApi(BaseListCompProps){
        return (dispatch) => {
            let url = RequestUtil.getStagingOrProductionHost() + 'search/merchants/count';
            RequestUtil.GET(url, {
                    q: BaseListCompProps.route.value,
                },
                (header) => {
                    commonApiHeaderAppend(header)
                },
            ).then((responseData) => {
                Log.log('BizApi  SearchMerchantsCountApi 搜索结果页 商家列表 tabLabel 显示数量 接口OK, responseData.count =' + responseData.count)
                dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, responseData.count));

                if (responseData.count == 0) {//模拟没搜索到 关键词 相关的 商家 数据后,发 商家列表的 Nodata action
                    dispatch(SearchResultPageActions.nodataAction(/*BaseListCompProps.route.value,*/this.ApiName, opt));
                }

            }).catch((error) => {
                Log.log('BizApi  SearchMerchantsCountApi 搜索结果页 商家列表 tabLabel 显示数量 接口失败 =' + error)
                RequestUtil.showErrorMsg(error)

                //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                //     couldLoadMore: true,
                //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                // }));
            });
        }

    },


    /**
     * 处理 拿到一次 网络请求 后的数据
     * @param opt
     * @param newArr
     * @param tabLabelTotalNums  商家列表 数据总数
     * @returns {function(*)}
     */
    // handleNetWorkData(opt, newArr, tabLabelTotalNums){
    //     return (dispatch) => {
    //
    //         this.tabLabelTotalNums = tabLabelTotalNums;
    //
    //         if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {
    //             this.tabLabelCurNums = 0;
    //             dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, this.tabLabelTotalNums));
    //
    //             if (tabLabelTotalNums == 0) {//模拟没搜索到 关键词 相关的 商家 数据后,发 商家列表的 Nodata action
    //                 dispatch(SearchResultPageActions.nodataAction(/*BaseListCompProps.route.value,*/this.ApiName, opt));
    //                 return;
    //             }
    //
    //             //搜索结果页 再次搜索, 拿到数据后,触发 刷新
    //             if (opt == BaseListActions.BaseListFetchDataType.REFRESH) {
    //                 dispatch(BaseListActions.InitListDataSource(this.ApiName));// 商家 列表的 $dataArray 清0
    //             }
    //         }
    //
    //         this.tabLabelCurNums += newArr.length;
    //
    //         dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
    //             couldLoadMore: this.tabLabelCurNums < this.tabLabelTotalNums,
    //             newContentArray: newArr
    //         }));
    //     }
    // }
}

/**
 * 搜索结果页 的 优惠 列表 的 API
 * https://api-staging-current.ebates.cn/docs.html#search-search-coupons-get
 * @type {{ApiName: string}}
 */
export const SearchResultPageCouponListAPI = {
    ApiName: 'SearchResultPageCouponListAPI',
    tabLabel: '优惠',
    tabLabelTotalNums: 0,//用于 列表 tab 显示的 通过 搜索关键词 接口 拿到的 数据源总数
    tabLabelCurNums: 0,//用于 列表 已经 拿到的数据源 数量
    $dataArray: fromJS([]),//存储 SearchResultPageSearchKeyWordAPI.searchKeyWord方法拿到的 优惠列表的 第一页 的 网络数据
    perPageOfNums: 10,//服务器每页发几条数据
    // componentDidMount: false,//false: 此时 此控件还没挂载, 不发 SuccessFetchinglist   true:此时 此控件 刚 挂载 或 请求好了 下页数据

    /**
     * 请求数据
     * @param opt
     * @param keyWord
     * @returns {function(*)}
     */
    fetchData(opt, BaseListCompProps){
        return (dispatch) => {

            // Log.log('BizApi SearchResultPageCouponListAPI fetchData opt=='+opt);
            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {// 第一次挂载
                // dispatch(BaseListActions.InitListDataSource(this.ApiName));// 优惠 列表的 $dataArray 清0

                //重新搜索,重置2个列表的数据源
                // if (opt == BaseListActions.BaseListFetchDataType.REFRESH){
                //     dispatch(BaseListActions.InitListDataSource(SearchResultPageMerchantListAPI.ApiName));// 商家 列表的 InitListState  重置
                //     dispatch(BaseListActions.InitListDataSource(this.ApiName));// 优惠 列表的
                //     // InitListState  重置
                // }

//                 if (!this.componentDidMount && opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//第一次挂载
//                     this.componentDidMount = true;
//
//                     if (this.tabLabelTotalNums > 0) {// 之前通过 searchKeyWordAPI 接口拿到了 数据
//                         this.tabLabelCurNums = 0;
//
//                         dispatch(this.handleNetWorkData(opt, this.$dataArray.toJS(), this.tabLabelTotalNums));
//                     } else {
//                         dispatch(SearchResultPageActions.nodataAction(this.ApiName, opt));
//
//                         // {//模拟商家列表网络异常
//                         //     dispatch(BaseListActions.FailureFetchinglist(opt, SearchResultPageCouponListAPI.ApiName ));
//                         // }
//                     }
//
//                 } else if (opt == BaseListActions.BaseListFetchDataType.REFRESH && this.componentDidMount) {//搜索结果页, 优惠列表已挂载后, 再次搜索,触发 此接口
//                     dispatch(BaseListActions.Loadinglist(opt, this.ApiName));//优惠列表 变loading 状态
//                     dispatch(SearchResultPageActions.updateTabLabelsAction(SearchResultPageMerchantListAPI.tabLabel, 0));//商家列表的 tabLabel 清零
//                     // dispatch(BaseListActions.InitListDataSource(SearchResultPageMerchantListAPI.ApiName));// 商家 列表的 $dataArray 清0
//                     dispatch(SearchResultPageActions.updateTabLabelsAction(SearchResultPageCouponListAPI.tabLabel, 0));//优惠 列表的 tabLabel 清零
// //调 搜索结果页的 搜索关键词 接口,拿2个列表的数据
//                     dispatch(SearchResultPageSearchKeyWordAPI.searchKeyWordAPI(opt, keyWord));
//                 }

            }

            TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                () => {
                    Log.log('BizApi SearchResultPageCouponListAPI 开始 调 搜索结果页 优惠 列表 接口  ')

                    {
                        dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                        let url = RequestUtil.getStagingOrProductionHost() + 'search/coupons';
                        RequestUtil.GET(url, {
                                q: BaseListCompProps.route.value,
                                page: BaseListCompProps.baseReducer.meta.pagination.current_page + 1,
                                perPage: BaseListCompProps.baseReducer.meta.pagination.per_page,
                                include: 'merchant'/* */,
                            },
                            (header) => {
                                commonApiHeaderAppend(header)
                            },
                        ).then((responseData) => {
                            Log.log('BizApi  SearchResultPageCouponListAPI 搜索结果页 优惠列表 接口OK, responseData.data.length =' + responseData.data.length)

                            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                                meta: responseData.meta,
                                newContentArray: responseData.data,
                            }));
                        }).catch((error) => {
                            Log.log('BizApi  SearchResultPageCouponListAPI 搜索结果页 优惠列表 接口失败 =' + error)
                            RequestUtil.showErrorMsg(error)

                            //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                            // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                            // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                            //     couldLoadMore: true,
                            //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                            // }));
                        });
                    }
                }
            )
        }
    },

    /**
     * 搜索结果页 获取 优惠列表 tabLabel 显示数量 的 接口
     * https://api-staging-current.ebates.cn/docs.html#search-search-coupons-count-get
     * @constructor
     */
    SearchCouponsCountApi(BaseListCompProps){
        return (dispatch) => {
            let url = RequestUtil.getStagingOrProductionHost() + 'search/coupons/count';
            RequestUtil.GET(url, {
                    q: BaseListCompProps.route.value,
                },
                (header) => {
                    commonApiHeaderAppend(header)
                },
            ).then((responseData) => {
                Log.log('BizApi  SearchCouponsCountApi 搜索结果页 优惠列表 tabLabel 显示数量 接口OK, responseData.count =' + responseData.count)
                dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, responseData.count));

                if (responseData.count == 0) {//模拟没搜索到 关键词 相关的 商家 数据后,发 商家列表的 Nodata action
                    dispatch(SearchResultPageActions.nodataAction(/*BaseListCompProps.route.value,*/this.ApiName, opt));
                }

            }).catch((error) => {
                Log.log('BizApi  SearchCouponsCountApi 搜索结果页 优惠列表 tabLabel 显示数量 接口失败 =' + error)
                RequestUtil.showErrorMsg(error)

                //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                //     couldLoadMore: true,
                //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                // }));
            });
        }

    },

    /**
     * 处理 优惠列表 拿到一次 网络请求 后的数据
     * @param opt : 怎么请求的
     * @param newArr :一次请求拿到的 数据
     * @param tabLabelTotalNums  列表 数据总数
     * @returns {function(*)}
     */
    // handleNetWorkData(opt, newArr, tabLabelTotalNums){
    //     return (dispatch) => {
    //
    //         this.tabLabelTotalNums = tabLabelTotalNums;
    //
    //         if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.REFRESH) {//处理 刚进页面,  searchKeyWordAPI 接口拿到的 数据 , 重置 tabLabel, $dataArray
    //             this.tabLabelCurNums = 0;
    //             dispatch(SearchResultPageActions.updateTabLabelsAction(this.tabLabel, this.tabLabelTotalNums));
    //
    //             if (tabLabelTotalNums == 0) {//模拟没搜索到 关键词 相关的 优惠 数据后,发 优惠 列表的 Nodata action
    //                 dispatch(SearchResultPageActions.nodataAction(/*BaseListCompProps.route.value,*/this.ApiName, opt));
    //                 Log.log('BizApi SearchResultPageCouponListAPI handleNetWorkData nodataAction')
    //                 return;
    //             }
    //
    //             if (!this.componentDidMount) {
    //                 this.$dataArray = this.$dataArray.clear();
    //                 newArr.map(
    //                     (v, i) => {
    //                         this.$dataArray = this.$dataArray.push(v);
    //                     }
    //                 );
    //             }
    //
    //         }
    //
    //         this.tabLabelCurNums += newArr.length;
    //
    //         // if (opt == BaseListActions.BaseListFetchDataType.REFRESH) {
    //         //     dispatch(BaseListActions.InitListDataSource(this.ApiName));// 优惠 列表的 $dataArray 清0
    //         // }
    //
    //         if (this.componentDidMount) {
    //             dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
    //                 couldLoadMore: this.tabLabelCurNums < this.tabLabelTotalNums,
    //                 newContentArray: newArr
    //             }));
    //         }
    //
    //     }
    // }
}

/**
 * 商家页面API
 * @type {{}}
 */
export const MerchantPageApi = {
    ApiName: 'MerchantPageApi',
    // meta:null,
    NetWorkAbnormalCellData: '网络异常cell',
    isInNetWorkAbnormalBeforeFetchSuccess: false,//本次请求成功数据之前,列表的状态是不是 网络异常 状态

    /**
     * 初始化 商家页 列表 的 默认数据源, 也就是 0号cell的数据源
     * @param opt
     * @returns {function(*)}
     */
    fetchData(opt){
        return (dispatch) => {
            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//一开始 挂载
                dispatch(BaseListActions.InitListDataSource(this.ApiName));// 当前 列表的 $dataArray 清0

                //列表一开始画0号cell和1号cell, 让 网格控件 可以 自动加载其API
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                    couldLoadMore: true,
                    newContentArray: [{key: '0号cell'}, {key: '1号cell'}]
                }));

                // dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                    () => {
                        Log.log('BizApi MerchantPageApi 开始 调 top10商家接口 ')
                        dispatch(MerchantPageApi.fetchTopTen());

                    }
                );

            }
        }
    },

    /**
     * 顶部7个按钮API
     * @constructor
     */
    FeaturedCategoryListApi(){
        return (dispatch) => {

            Log.log('BizApi MerchantPageApi FeaturedCategoryListApi 开始请求顶部 7个按钮的 接口 ')

            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.ApiName, BaseGridViewActions.BaseGridViewStates.Loading, null));

            TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                () => {
                    let url = RequestUtil.getStagingOrProductionHost() + 'categories/featured';
                    RequestUtil.GET(url, null,
                        (header) => {
                            commonApiHeaderAppend(header)
                        },
                    ).then((responseData) => {
                        // resolve(responseData);
                        // BizLoadingView.closeBizLoadingView();

                        Log.log('BizApi MerchantPageApi FeaturedCategoryListApi 拿到 7个按钮的数据 responseData=' + Log.writeObjToJson(responseData))
                        dispatch(BaseGridViewActions.changeBaseGridViewStates(this.ApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, responseData.data));
                        // dispatch(BaseGridViewActions.changeBaseGridViewStates(this.ApiName, BaseGridViewActions.BaseGridViewStates.fetchFail, []));
                    }).catch((error) => {
                        Log.log('BizApi MerchantPageApi FeaturedCategoryListApi 拿 7个按钮的数据 失败  error=' + Log.writeObjToJson(error))

                        dispatch(BaseGridViewActions.changeBaseGridViewStates(this.ApiName, BaseGridViewActions.BaseGridViewStates.fetchFail, []));

                    });
                }
            );
        }

    },

    /**
     * 获取top10商家数据 TOP MERCHANTS
     */
    fetchTopTen(){
        return (dispatch) => {
            if (this.isInNetWorkAbnormalBeforeFetchSuccess) {//本次拿到数据前,列表处于 网络异常 状态,拿到数据后, 删除 网络异常cell
                this.isInNetWorkAbnormalBeforeFetchSuccess = false;
                dispatch(BaseListActions.RemoveOneItemFromlist(this.ApiName, {
                    index: 2
                }));
            }
            dispatch(BaseListActions.Loadinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName));

            {
                let url = RequestUtil.getStagingOrProductionHost() + 'merchants/top';
                RequestUtil.GET(url, {
                        page: 1, perPage: 10, include: 'hotCoupons',
                    },
                    (header) => {
                        commonApiHeaderAppend(header)
                    },
                ).then((responseData) => {
                    Log.log('BizApi MerchantPageApi fetchTopTen top10商家接口OK =' + Log.writeObjToJson(responseData))

                    let data = responseData.data;
                    data.push({key: '全部商家cell'});
                    data.push({key: '底部留白cell'});

                    dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.MORE, this.ApiName, {
                        meta: responseData.meta,
                        newContentArray: data
                    }));
                }).catch((error) => {
                    Log.log('BizApi MerchantPageApi fetchTopTen top10商家接口 失败 =' + error)
                    RequestUtil.showErrorMsg(error)

                    //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                    this.isInNetWorkAbnormalBeforeFetchSuccess = true;
                    dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                        couldLoadMore: true,
                        newContentArray: [{key: this.NetWorkAbnormalCellData}]
                    }));
                });
            }
        }

    }
}

/**
 * 商家详情页API   https://api-staging-current.ebates.cn/docs.html#merchants-merchant-details-get
 * @type {{ApiName: string}}
 */
export const MerchantDetailPageApi = {
    ApiName: 'MerchantDetailPageApi',
    isInNetWorkAbnormalBeforeFetchSuccess: false,
    $dataArray: fromJS([]),//缓存 优惠及折扣列表的model,切换到 如何获得返利 按钮后, reducer里的$dataArray 会 只保留 3个cell,切回 优惠及折扣 按钮后,reducer里的$dataArray再恢复 优惠及折扣列表的model

    //页面一进来默认显示的数据
    fetchPageData(opt, BaseListCompProps){
        // Log.log('BizApi MerchantDetailPageApi fetchPageData () =='+BaseListCompProps.route.merchantData)
        return (dispatch) => {
            Log.log('BizApi MerchantDetailPageApi fetchPageData opt=' + opt)

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//一开始 挂载
                // dispatch(BaseListActions.InitListDataSource(this.ApiName));// 当前 列表的 $dataArray 清0
                this.$dataArray = this.$dataArray.clear();

                //一开始画 2个cell
                dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                    couldLoadMore: false,
                    newContentArray: [BaseListCompProps.route.merchantData, '优惠及折扣cell']

                }));

                TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                    () => {

                        dispatch(this.fetchMerchantDetails(BaseListCompProps.route.merchantData.id));


                        Log.log('BizApi MerchantDetailPageApi 开始 调 优惠及折扣 列表 接口  ')
                        dispatch(this.fetchCouponsForMerchant(BaseListCompProps.route.merchantData.id, BaseListCompProps.baseReducer.meta));
                    }
                );
            } else if (opt == BaseListActions.BaseListFetchDataType.MORE) {//翻页
                TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                    () => {
                        Log.log('BizApi MerchantDetailPageApi fetchPageData() 开始 调 优惠及折扣 列表 接口 获取下页数据  ')
                        dispatch(this.fetchCouponsForMerchant(BaseListCompProps.route.merchantData.id, BaseListCompProps.baseReducer.meta));
                    }
                );
            }
        }
    },

    /**
     * 商家详情 接口 https://api-staging-current.ebates.cn/docs.html#merchants-merchant-details-get
     * @param id
     * @returns {function(*)}
     */
    fetchMerchantDetails(id){
        return (dispatch) => {

            {
                Log.log('BizApi fetchMerchantDetails 开始调 商家详情 接口');
                let url = RequestUtil.getStagingOrProductionHost() + 'merchants/' + id;
                RequestUtil.GET(url, {
                        include: 'tags',
                    },
                    (header) => {
                        commonApiHeaderAppend(header)
                    },
                ).then((responseData) => {
                    Log.log('BizApi  fetchMerchantDetails 商家详情 接口OK, responseData =' + Log.writeObjToJson(responseData))

                    dispatch(BaseListActions.ChangeListOneItemAction(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                        index: 0,
                        newData: responseData
                    }));

                }).catch((error) => {
                    Log.log('BizApi  fetchMerchantDetails 商家详情 失败 =' + error)
                    RequestUtil.showErrorMsg(error)
                });
            }
        }
    },

    /**
     * 标签数据
     * @param items
     * @returns {function(*)}
     */
    fetchTagsData(items){
        return (dispatch) => {

            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.ApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, items));

        }
    },

    /**
     * 优惠及折扣 列表 接口 GET COUPONS FOR MERCHANT https://api-staging-current.ebates.cn/docs.html#merchants-get-coupons-for-merchant-get
     *
     * @param id 商家id
     * @returns {function(*)}
     */
    fetchCouponsForMerchant(id, meta){
        return (dispatch) => {
            // if (this.isInNetWorkAbnormalBeforeFetchSuccess){//本次拿到数据前,列表处于 网络异常 状态,拿到数据后, 删除 网络异常cell
            //     this.isInNetWorkAbnormalBeforeFetchSuccess=false;
            //     dispatch(BaseListActions.RemoveOneItemFromlist( this.ApiName, {
            //         index: 2
            //     }));
            // }
            {
                dispatch(BaseListActions.Loadinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, MerchantDetailPageApi.ApiName));
                let url = RequestUtil.getStagingOrProductionHost() + 'merchants/' + id + '/coupons';
                RequestUtil.GET(url, {
                        page: meta.pagination.current_page + 1,
                        perPage: meta.pagination.per_page,
                        include: 'merchant',
                    },
                    (header) => {
                        commonApiHeaderAppend(header)
                    },
                ).then((responseData) => {
                    Log.log('BizApi  fetchCouponsForMerchant 优惠及折扣 接口OK, responseData.data.length =' + responseData.data.length)

                    {

                        responseData.data.map(
                            (v, i) => {
                                this.$dataArray = this.$dataArray.set(this.$dataArray.size, v);
                            }
                        );
                    }

                    dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.MORE, this.ApiName, {
                        meta: responseData.meta,
                        newContentArray: responseData.data
                    }));
                }).catch((error) => {
                    Log.log('BizApi  fetchCouponsForMerchant 优惠及折扣 失败 =' + error)
                    RequestUtil.showErrorMsg(error)

                    //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                    // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                    // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                    //     couldLoadMore: true,
                    //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                    // }));
                });
            }
        }
    },

    /**
     * 列表数据源切换到 如何获得返利 列表状态
     * @param BaseListCompProps
     * @returns {function(*)}
     */
    changeToHowtoGetRebatesList(BaseListCompProps){
        return (dispatch) => {
            dispatch(BaseListActions.RemoveNumsItemFromlist(this.ApiName, {
                fromIndex: 2, toIndex: BaseListCompProps.baseReducer.$dataArray.size - 1
            }));

            dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.MORE, this.ApiName, {
                meta: BaseListCompProps.baseReducer.meta,
                newContentArray: [{key: BaseListCompProps.route.merchantData.restrictions}]
            }));
        }
    },

    /**
     *  列表数据源切换到 优惠及折扣 列表状态
     * @param BaseListCompProps
     * @returns {function(*)}
     */
    changeToCouponList(BaseListCompProps){

        return (dispatch) => {

            //删除 如何获得返利的 内容  cell
            dispatch(BaseListActions.RemoveOneItemFromlist(this.ApiName, {
                index: 2
            }));

            dispatch(BaseListActions.Loadinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, MerchantDetailPageApi.ApiName));

            //刚删除一个cell, 得等 列表 刷新后再 添加数据,否则 时间太紧, 列表未刷新完毕就添加数据,导致 商家详情页切换到 优惠及折扣 列表后, 2号cell的 数据源是 {}
            new SMSTimer({
                timerNums: 1,
                callBack: (time) => {
                    Log.log('time===' + time);
                    if (time == -1) {
                        // Log.log('BizApi changeToCouponList 列表数据源 即将 切换到 优惠及折扣 列表状态, this.$dataArray.toJS()='+Log.writeObjToJson(this.$dataArray.toJS()));
                        dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.MORE, this.ApiName, {
                            meta: BaseListCompProps.baseReducer.meta,
                            newContentArray: this.$dataArray.toJS()
                        }));

                    }
                }
            }).start();

            // Log.log('BizApi changeToCouponList 列表数据源 即将 切换到 优惠及折扣 列表状态, this.$dataArray.toJS()='+Log.writeObjToJson(this.$dataArray.toJS()));
            // dispatch(MerchantDetailPageActions.changeToCouponListAction(BaseListActions.BaseListFetchDataType.MORE, this.ApiName, {
            //     meta: BaseListCompProps.baseReducer.meta,
            //     newContentArray: this.$dataArray.toJS()
            // }));
        }
    }

}

/**
 * 跳转页的API
 * @type {{ApiName: string}}
 */
export const TransferWebViewPageApi = {
    ApiName: 'TransferWebViewPageApi',

    // fetchPageData(opt, BaseListCompProps){
    //     return (dispatch) => {
    //         Log.log('BizApi MerchantDetailPageApi fetchPageData opt=' + opt)
    //
    //         if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//一开始 挂载
    //             dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
    //                 couldLoadMore: false,
    //                 newContentArray: [{}]
    //             }));
    //         }
    //     }
    // }
}

export const ClickApi = {
    ApiName: 'ClickApi',

    fetchClickData(merchant_id){
        return new Promise((resolve, reject) => {
            Log.log('BizApi  开启请求 ClickApi   接口 , merchant_id =' + merchant_id);

            let url = RequestUtil.getStagingOrProductionHost() + 'click';

            RequestUtil.GET(url, {
                    merchant_id: merchant_id,
                    //coupon_id: ' '
                },
                (header) => {
                    commonApiHeaderAppend(header)
                },
            ).then((responseData) => {
                Log.log('BizApi  ClickApi  接口OK, responseData =' + Log.writeObjToJson(responseData))

                resolve(responseData)
            }).catch((error) => {
                RequestUtil.showErrorMsg(error)

                reject(error);
            });
        });
    }
}

/**
 * 首页 热门优惠 列表 的 API
 * @type {{}}
 */
export const HomePageHotCouponListApi = {
    ApiName: 'HomePageHotCouponListApi',
    // $dataArray: fromJS([]),//加倍返利商家 接口的数据
    isFlashDealsApiOk: false,//限时返利接口是否拿到数据
    isHotCouonListApiOK: false,

    fetchPageData(opt, BaseListCompProps){
        // Log.log('BizApi MerchantDetailPageApi fetchPageData () =='+BaseListCompProps.route.merchantData)
        return (dispatch) => {

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//一开始 挂载
                Log.log('BizApi HomePageHotCouponListApi fetchPageData 开始请求 首页的4个接口')

                this.isHotCouonListApiOK = false;

                //一开始画 轮播图 和 加倍返利商家 和 热门优惠 3 个cell
                dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                    couldLoadMore: true,
                    newContentArray: ['轮播图接口未成功', '加倍返利商家', '热门优惠 cell ']

                }));

                TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                    () => {
                        dispatch(this.HeroBannersApi(BaseListCompProps));
                        dispatch(this.fetchDoubleCashbackMerchants(BaseListCompProps));
                        dispatch(this.FLashDealsApi(BaseListCompProps));
                        dispatch(this.HotCouonListApi(BaseListCompProps));

                    }
                );

            } else if (opt == BaseListActions.BaseListFetchDataType.MORE) {//翻页

            }
        }
    },

    /**
     * 轮播图, banner
     * @constructor
     */
    HeroBannersApi(BaseListCompProps){
        return (dispatch) => {

            Log.log('BizApi  HeroBannersApi 开始加载 轮播图 接口 ');

            let url = RequestUtil.getStagingOrProductionHost() + 'banners/hero';
            RequestUtil.GET(url, null,
                (header) => {
                    commonApiHeaderAppend(header)
                },
            ).then((responseData) => {
                Log.log('BizApi  HeroBannersApi 轮播图 接口OK, responseData.data.length =' + responseData.data.length)

                dispatch(BaseListActions.ChangeListOneItemAction(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                    index: 0,
                    newData: responseData.data
                }));


                // new SMSTimer({
                //     timerNums: 1,
                //     callBack: (time) => {
                //         Log.log('time===' + time);
                //         if (time == -1) {
                //             dispatch(this.fetchDoubleCashbackMerchants(BaseListCompProps));
                //
                //         }
                //     }
                // }).start();

            }).catch((error) => {
                Log.log('BizApi  HeroBannersApi 轮播图 接口失败 =' + error)
                RequestUtil.showErrorMsg(error)

                //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                //     couldLoadMore: true,
                //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                // }));
            });
        }
    },

    /**
     * 加倍返利商家 接口 DOUBLE CASHBACK MERCHANTS
     * https://api-staging-current.ebates.cn/docs.html#merchants-double-cashback-merchants-get
     */
    fetchDoubleCashbackMerchants(BaseListCompProps){
        return (dispatch) => {

            Log.log('BizApi  fetchDoubleCashbackMerchants 开始加载 加倍返利商家 接口 ');

            let url = RequestUtil.getStagingOrProductionHost() + 'merchants/double_cashback';
            RequestUtil.GET(url, {
                    page: 1,
                    perPage: 10,
                },
                (header) => {
                    commonApiHeaderAppend(header)
                },
            ).then((responseData) => {
                Log.log('BizApi  fetchDoubleCashbackMerchants 加倍返利商家 接口OK, responseData.data.length =' + responseData.data.length)

                dispatch(BaseListActions.ChangeListOneItemAction(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                    index: 1,
                    newData: responseData.data
                }));

                // new SMSTimer({
                //     timerNums: 1,
                //     callBack: (time) => {
                //         Log.log('time===' + time);
                //         if (time == -1) {
                //             dispatch(this.HotCouonListApi(BaseListCompProps));
                //
                //         }
                //     }
                // }).start();
            }).catch((error) => {
                Log.log('BizApi  fetchDoubleCashbackMerchants 加倍返利商家 接口失败 =' + error)
                RequestUtil.showErrorMsg(error)

                //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                //     couldLoadMore: true,
                //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                // }));
            });
        }
    },

    /**
     * 限时返利 https://api-staging-current.ebates.cn/docs.html#coupons-flash-deals-get
     * @constructor
     */
    FLashDealsApi(BaseListCompProps){
        return (dispatch) => {

            Log.log('BizApi  FLashDealsApi 开始加载 限时返利 接口 ');

            let url = RequestUtil.getStagingOrProductionHost() + 'coupons/flash';
            RequestUtil.GET(url, {
                    page: 1,
                    perPage: 1,
                },
                (header) => {
                    commonApiHeaderAppend(header)
                },
            ).then((responseData) => {

                this.isFlashDealsApiOk = responseData.data.length > 0;

                if (this.isFlashDealsApiOk) {

                    Log.log('BizApi  FLashDealsApi 限时返利 接口OK, responseData =' + Log.writeObjToJson(responseData))

                    dispatch(BaseListActions.ListInsertOneItemAction(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                        index: 2,
                        newData: responseData.data[0]
                    }));
                } else {
                    if (responseData.data.length == 0) {
                        Log.log('BizApi  FLashDealsApi 限时返利 接口返回0,故 添加一条假数据');
                        this.isFlashDealsApiOk = true;
                        dispatch(BaseListActions.ListInsertOneItemAction(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                            index: 2,
                            newData: {
                                "name": "满$25立减$10,下单即享美境包邮!满$50送优惠券(第二单$25减$10)",
                                "image_url": "http://extrabux-static.b0.upaiyun.com/images/flash-deal/201511/20151125/origins.jpg",
                                "now": "2017-03-17T08:08:59+00:00",
                                "expired_at": "2017-03-26T00:00:00+00:00",
                                "restrictions": "Here are restrictions",
                                "merchant": {
                                    "id": 3150,
                                    "name": "Levi's (李维斯)",
                                    "now_rate": "返利4%",
                                    "was_rate": "返1%",
                                    "image": "http://extrabux-static.b0.upaiyun.com/images/merchants/3150.jpg",
                                    "thumbnail_image": "http://extrabux-static.b0.upaiyun.com/images/merchants/3015_t.jpg",
                                    "transfers": 14955,
                                    "slogan": "旷世经典人人都爱的牛仔裤",
                                    "restrictions": "* 礼品卡无返利。",
                                    "description": "Levis（李维斯）是著名的牛仔裤品牌，作为牛仔裤的“鼻祖”，它象征着美国野性、刚毅、叛逆与美国开拓者的精神。Levis有时会推出折扣优惠活动，得到了众多海淘爱好者的亲睐。Levis除了提供各类男女士牛仔裤外，还销售各类牛仔外套、牛仔裙、短裤、鞋、包包及其它配件等。"
                                },
                                "coupon": {
                                    "transfer_url": "/transfer/store/1879/2209603"
                                }
                            }
                        }));
                    }
                }
            }).catch((error) => {
                Log.log('BizApi  FLashDealsApi 限时返利 接口失败 =' + error)
                RequestUtil.showErrorMsg(error)

                //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                //     couldLoadMore: true,
                //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                // }));
            });
        }
    },

    /**
     * 首页热门优惠 列表 API https://api-staging-current.ebates.cn/docs.html#coupons-hot-coupon-list-get
     * @returns {function(*)}
     */
    HotCouonListApi(BaseListCompProps){
        return (dispatch) => {
            // if (this.isInNetWorkAbnormalBeforeFetchSuccess){//本次拿到数据前,列表处于 网络异常 状态,拿到数据后, 删除 网络异常cell
            //     this.isInNetWorkAbnormalBeforeFetchSuccess=false;
            //     dispatch(BaseListActions.RemoveOneItemFromlist( this.ApiName, {
            //         index: 2
            //     }));
            // }

            {
                Log.log('BizApi  HotCouonListApi 开始请求 首页热门优惠 接口')
                dispatch(BaseListActions.Loadinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName));

                let url = RequestUtil.getStagingOrProductionHost() + 'coupons/hot';
                RequestUtil.GET(url, {
                        page: BaseListCompProps.baseReducer.meta.pagination.current_page + 1,
                        perPage: BaseListCompProps.baseReducer.meta.pagination.per_page,
                        include: 'merchant'/* */,
                    },
                    (header) => {
                        commonApiHeaderAppend(header)
                    },
                ).then((responseData) => {
                    Log.log('BizApi  HotCouonListApi 首页热门优惠 接口OK, responseData.data =' + Log.writeObjToJson(responseData.data))

                    let arr = responseData.data;
                    arr.push('查看更多cell');
                    arr.push('底部留白cell');

                    this.isHotCouonListApiOK = true;

                    dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.MORE, this.ApiName, {
                        couldLoadMore: false,
                        newContentArray: arr,
                    }));

                    // new SMSTimer({
                    //     timerNums: 1,
                    //     callBack: (time) => {
                    //         Log.log('time===' + time);
                    //         if (time == -1) {
                    //             dispatch(this.FLashDealsApi(BaseListCompProps));
                    //
                    //         }
                    //     }
                    // }).start();
                }).catch((error) => {
                    Log.log('BizApi  HotCouonListApi 首页热门优惠 接口失败 =' + error)
                    RequestUtil.showErrorMsg(error)

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
}

/**
 * 优惠排行 https://api-staging-current.ebates.cn/docs.html#coupons-hot-click-coupon-list-get
 * @type {{}}
 */
export const HomePageHotClickCouponListApi = {
    ApiName: 'HomePageHotClickCouponListApi',

    fetchListData(opt, BaseListCompProps){
        return (dispatch) => {
            Log.log('BizApi HotClickCouponListRankApi fetchListData opt=' + opt)

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.MORE) {//一开始 挂载 | 翻页

                TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                    () => {
                        Log.log('BizApi HotClickCouponListRankApi 开始 调 首页 优惠排行 列表 接口  ')

                        {
                            dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                            let url = RequestUtil.getStagingOrProductionHost() + 'coupons/click';
                            RequestUtil.GET(url, {
                                    page: BaseListCompProps.baseReducer.meta.pagination.current_page + 1,
                                    perPage: BaseListCompProps.baseReducer.meta.pagination.per_page,
                                    include: 'merchant'/* */,
                                },
                                (header) => {
                                    commonApiHeaderAppend(header)
                                },
                            ).then((responseData) => {
                                Log.log('BizApi  HotClickCouponListRankApi 首页 优惠排行 接口OK, responseData.data.length =' + responseData.data.length)

                                let arr = responseData.data;
                                // if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE){
                                //     arr.push('底部留白cell');
                                // }

                                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                                    meta: responseData.meta,
                                    newContentArray: arr,
                                }));
                            }).catch((error) => {
                                Log.log('BizApi  HotClickCouponListRankApi 首页 优惠排行 接口失败 =' + error)
                                RequestUtil.showErrorMsg(error)

                                //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                                // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                                // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                                //     couldLoadMore: true,
                                //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                                // }));
                            });
                        }
                    }
                );
            }
            // else if (opt == BaseListActions.BaseListFetchDataType.MORE) {//翻页
            //     TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
            //         () => {
            //             Log.log('BizApi CouponListApi 开始 调 首页 优惠排行 列表 接口 获取下页数据  ')
            //         }
            //     );
            // }
        }
    },
}

/**
 * EB独家优惠 https://api-staging-current.ebates.cn/docs.html#coupons-exclusive-coupon-list-get
 * @type {{}}
 */
export const EBCouponListApi = {
    ApiName: 'EBCouponListApi',

    fetchListData(opt, BaseListCompProps){
        return (dispatch) => {
            Log.log('BizApi EBCouponListApi fetchListData opt=' + opt)

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE || opt == BaseListActions.BaseListFetchDataType.MORE) {//一开始 挂载 | 翻页

                TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                    () => {
                        Log.log('BizApi EBCouponListApi 开始 调 首页 EB独家优惠 列表 接口  ')

                        {
                            dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                            let url = RequestUtil.getStagingOrProductionHost() + 'coupons/exclusive';
                            RequestUtil.GET(url, {
                                    page: BaseListCompProps.baseReducer.meta.pagination.current_page + 1,
                                    perPage: BaseListCompProps.baseReducer.meta.pagination.per_page,
                                    include: 'merchant'/* */,
                                },
                                (header) => {
                                    commonApiHeaderAppend(header)
                                },
                            ).then((responseData) => {
                                Log.log('BizApi  EBCouponListApi 首页 EB独家优惠 接口OK, responseData.data.length =' + responseData.data.length)

                                let arr = responseData.data;
                                // if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE){
                                //     arr.push('底部留白cell');
                                // }

                                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                                    meta: responseData.meta,
                                    newContentArray: arr,
                                }));
                            }).catch((error) => {
                                Log.log('BizApi  EBCouponListApi 首页 EB独家优惠 接口失败 =' + error)
                                RequestUtil.showErrorMsg(error)

                                //商家页的top10接口如果返回错误, 不能直接把 列表处于 失败状态,因还得画0和1号cell,故只能 添加一个 3号异常cell
                                // this.isInNetWorkAbnormalBeforeFetchSuccess=true;
                                // dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.INITIALIZE, this.ApiName, {
                                //     couldLoadMore: true,
                                //     newContentArray: [{key: this.NetWorkAbnormalCellData}]
                                // }));
                            });
                        }
                    }
                );
            }
            // else if (opt == BaseListActions.BaseListFetchDataType.MORE) {//翻页
            //     TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
            //         () => {
            //             Log.log('BizApi CouponListApi 开始 调 首页 优惠排行 列表 接口 获取下页数据  ')
            //         }
            //     );
            // }
        }
    },
}

/**
 * 全部商家页 api
 * @type {{}}
 */
export const AllMerchantPageApi = {
    ApiName: 'AllMerchantPageApi',
    // SearchKeys: '',//筛选出来的关键词

    /**
     * 获取 4个menu的数据
     */
    fetchMenuData(){
        return (dispatch) => {
            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.ApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, [{
                id: 0,
                title: '分类', changeTitleEventName: AllMerchantPage.AllMerchantPageChangeCategoryMenuTitleEventName
            }, {
                id: 1,
                title: '国家',
                changeTitleEventName: AllMerchantPage.AllMerchantPageChangeCountryMenuTitleEventName
            }, {
                id: 2,
                title: '排序',
                changeTitleEventName: AllMerchantPage.AllMerchantPageChangeSortMenuTitleEventName
            }, {
                id: 3,
                title: '筛选', changeTitleEventName: AllMerchantPage.AllMerchantPageChangeFilterMenuTitleEventName
            }]));
        }
    },
}

/**
 * 全部商家页 商家列表 的API https://api-staging-current.ebates.cn/docs.html#search-search-merchants-get
 */
export const AllMerchantPageListApi = {
    ApiName: 'AllMerchantPageListApi',

    /**
     * 全部商家页 搜索商家 接口, 也是此页面 第一次进来 的 默认 列表 接口
     * @param BaseProps
     * @returns {function(*)}
     * @constructor
     */
    SearchMerchants (opt, BaseProps){
        return (dispatch) => {
            TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                () => {

                    Log.log('BizApi  AllMerchantPageListApi 开始请求 全部商家页 搜索商家 接口,opt=' + opt);
                    dispatch(BaseListActions.Loadinglist(opt, this.ApiName));

                    let params = {
                        include: 'hot_coupons,tags',
                        page: opt == BaseListActions.BaseListFetchDataType.REFRESH ? 1 : BaseProps.baseReducer.meta.pagination.current_page + 1,
                        perPage: BaseProps.baseReducer.meta.pagination.per_page,
                    };
                    if (AllMerchantPageCategoryListApi.categoryID != -1) {
                        params.category = AllMerchantPageCategoryListApi.categoryID;
                    }
                    //添加 国家列表 或 筛选下拉列表 选中的 数据
                    if (AllMerchantPageCountryListApi.tag != '-1' || AllMerchantPageFilterDropDownListApi.tagsArr.length > 0) {
                        let tagsArr = [];
                        if (AllMerchantPageCountryListApi.tag != '-1') {
                            tagsArr.push(AllMerchantPageCountryListApi.tag);
                            Log.log('BizApi  AllMerchantPageListApi  SearchMerchants AllMerchantPageCountryListApi.tag=' + AllMerchantPageCountryListApi.tag);

                        }
                        if (AllMerchantPageFilterDropDownListApi.tagsArr.length > 0) {//筛选下拉列表有选中的数据
                            AllMerchantPageFilterDropDownListApi.tagsArr.map(
                                (model, i) => {
                                    tagsArr.push(model);
                                }
                            )
                        }

                        params.tag = '';
                        tagsArr.map(
                            (model, i) => {
                                if (i != 0) {
                                    params.tag += ',';
                                }
                                params.tag += model;
                            }
                        )

                        Log.log('BizApi SearchMerchants params.tag=' + params.tag);
                        // params.tag=AllMerchantPageCountryListApi.tag;
                    }
                    if (AllMerchantPageSortDropDownListApi.sort_by != '-1') {
                        params.sort_by = AllMerchantPageSortDropDownListApi.sort_by;
                    }

                    Log.log('BizApi SearchMerchants params=' + JSON.stringify(params));


                    let url = RequestUtil.getStagingOrProductionHost() + 'search/merchants';
                    RequestUtil.GET(url, params,
                        (header) => {
                            commonApiHeaderAppend(header)
                        },
                    ).then((responseData) => {
                        // Log.log('BizApi  AllMerchantPageListApi 全部商家页 搜索商家 接口OK, responseData.data =' + Log.writeObjToJson(responseData.data))
                        Log.log('BizApi  AllMerchantPageListApi 全部商家页 搜索商家 接口OK, responseData.data.length =' + responseData.data.length)

                        //不是 加载更多 时 无数据, 列表 切换到 无数据状态
                        if (responseData.data.length == 0 && opt != BaseListActions.BaseListFetchDataType.MORE) {
                            Log.log('BizApi  AllMerchantPageListApi 全部商家页 搜索商家 接口 无数据')
                            dispatch(BaseListActions.NodataAction(this.ApiName, opt));
                        } else {
                            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                                meta: responseData.meta,
                                newContentArray: responseData.data,
                            }));
                        }

                    }).catch((error) => {
                        Log.log('BizApi  AllMerchantPageListApi 全部商家页 搜索商家 接口失败 =' + error)
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
     * 重置 全部商家页 的 筛选控件的 所有下拉列表 里 的 已选中的 信息为默认信息
     */
    resetAllDropDownListSelectedInfo(){
        return (dispatch) => {
            AllMerchantPageCategoryListApi.resetCategoryListData();
            AllMerchantPageCountryListApi.resetCountryListData();
            AllMerchantPageSortDropDownListApi.resetSortListData();
            dispatch(AllMerchantPageFilterDropDownListApi.clearSelectData());
        }

    }
}

/**
 * 全部商家页 分类 Category 下拉列表 API https://api-staging-current.ebates.cn/docs.html#categories-category-list-get
 * @type {{ApiName: string, export: AllMerchantPageCategoryListApi.export}}
 */
export const AllMerchantPageCategoryListApi = {
    ApiName: 'AllMerchantPageCategoryListApi',
    $CategoryListDataArray: fromJS([]), //CATEGORY LIST 接口 已经拿到的数据,immutable.List 数据类型  , 里边放 model, toJS()可转成JS 数组
    isLoading: false,//是否正在 请求接口
    isThisCompDidMount: false,//此API 对应的控件是否 挂载中
    categoryID: -1,// 点击 Category 列表 后 选择的 model.id

    /**
     * CATEGORY LIST 接口 https://api-staging-current.ebates.cn/docs.html#categories-category-list-get
     * 拿 全部商家页 下拉列表 里 有 母婴 的 那个列表 的数据
     */
    fetchCategoryList(opt){
        return (dispatch) => {
            {
                if (this.isLoading && this.$CategoryListDataArray.size == 0)//如果 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态
                {
                    Log.log('BizApi fetchCategoryList 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态')
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
                    dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizDropDownMenuAndListApi.ApiName, this.$CategoryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH/*每个cell 高 默认 44 ,以后 把此 常量写到 专门的 cell里*/))
                    this.isThisCompDidMount = true;
                }
                else if (!this.isLoading && this.$CategoryListDataArray.size == 0) {//刚进入 全部商家页, 主动 调此接口, 走这里的代码
                    Log.log('BizApi  fetchCategoryList 开始请求 全部商家页 分类下拉列表 接口 ');
                    this.isLoading = true;

                    let url = RequestUtil.getStagingOrProductionHost() + 'categories';
                    RequestUtil.GET(url, {
                            parent: 'top'
                        },
                        (header) => {
                            commonApiHeaderAppend(header)
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

                            Log.log('BizApi  fetchCategoryList 全部商家页 分类下拉列表  接口OK, responseData.data.length =' + responseData.data.length)

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

                                dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizDropDownMenuAndListApi.ApiName, this.$CategoryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH/*每个cell 高 默认 44 ,以后 把此 常量写到 专门的 cell里*/))
                            }


                        }

                    }).catch((error) => {
                        Log.log('BizApi  AllMerchantPageListApi 全部商家页 搜索商家 接口失败 =' + error)
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
                    if (i == 0) {
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

/**
 * 全部商家页 Country 下拉列表 API https://api-staging-current.ebates.cn/docs.html#tags-countries-get
 * @type {{ApiName: string, export: AllMerchantPageCategoryListApi.export}}
 */
export const AllMerchantPageCountryListApi = {
    ApiName: 'AllMerchantPageCountryListApi',
    $CountryListDataArray: fromJS([]), //COUNTRIES 接口 已经拿到的数据,immutable.List 数据类型  , 里边放 model, toJS()可转成JS 数组
    isLoading: false,//是否正在 请求接口
    isThisCompDidMount: false,//此API 对应的控件是否 挂载中
    tag: '-1',//国家列表 选择 全部时, 搜索接口 需要的字段 的默认值

    /**
     * 拿 全部商家页 国家 下拉列表   的数据
     */
    fetchCountryList(opt){
        return (dispatch) => {
            {
                if (this.isLoading && this.$CountryListDataArray.size == 0)//如果 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态
                {
                    Log.log('BizApi fetchCountryList 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态')
                    // new SMSTimer({//为了能 从 初始化状态 切换到 Loading  状态, 否则太快了,切换不了
                    //     timerNums: 0.5,
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

                } else if (!this.isLoading && this.$CountryListDataArray.size > 0) {//列表挂载时, 接口已经拿到数据,列表直接切到 成功状态
                    dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                        couldLoadMore: false,
                        newContentArray: this.$CountryListDataArray.toJS(),
                    }));
                    dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizDropDownMenuAndListApi.ApiName, this.$CountryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH/*每个cell 高 默认 44 ,以后 把此 常量写到 专门的 cell里*/))

                    this.isThisCompDidMount = true;

                }
                else if (!this.isLoading && this.$CountryListDataArray.size == 0) {//刚进入 全部商家页, 主动 调此接口, 走这里的代码,此时列表可能未 挂载
                    Log.log('BizApi  fetchCountryList 开始请求 全部商家页 国家 下拉列表  接口 ');
                    this.isLoading = true;

                    let url = RequestUtil.getStagingOrProductionHost() + 'tags/countries';
                    RequestUtil.GET(url, null,
                        (header) => {
                            commonApiHeaderAppend(header)
                        },
                    ).then((responseData) => {

                        // new SMSTimer({//模拟 拿到数据后, Loading状态的列表 切到 成功状态
                        //     timerNums: 10,
                        //     callBack: (time) => {
                        //         Log.log('time===' + time);
                        //         if (time == -1) {
                        //
                        //         }
                        //     }
                        // }).start();

                        {

                            Log.log('BizApi  fetchCountryList 全部商家页 国家 下拉列表  接口OK, responseData.data.length =' + responseData.data.length)

                            Log.log('BizApi  fetchCountryList 全部商家页 国家 下拉列表  接口OK, responseData.data =' + Log.writeObjToJson(responseData.data));

                            responseData.data.map(
                                (v, i) => {
                                    // if (i<5)
                                    {
                                        v.isSelect = false;//给每个mode 加 是否被选中 属性
                                        v.index = i + 1;//用于 点击 处理对号的位置
                                        this.$CountryListDataArray = this.$CountryListDataArray.set(this.$CountryListDataArray.size, v);
                                    }
                                }
                            );
                            this.$CountryListDataArray = this.$CountryListDataArray.insert(0, {
                                id: -1,
                                key: '-1',
                                name: "全部",
                                slug: null,
                                isSelect: true,
                                index: 0
                            });

                            // Log.log('BizApi  fetchCountryList 全部商家页 国家 下拉列表  的数据源 $CountryListDataArray=' + Log.writeObjToJson(this.$CategoryListDataArray.toJS()))
                            this.isLoading = false;

                            if (this.isThisCompDidMount) {//列表正在挂载
                                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                                    couldLoadMore: false,
                                    newContentArray: this.$CountryListDataArray.toJS(),
                                }));

                                dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizDropDownMenuAndListApi.ApiName, this.$CountryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH/*每个cell 高 默认 44 ,以后 把此 常量写到 专门的 cell里*/))
                            }
                        }

                    }).catch((error) => {
                        Log.log('BizApi  fetchCountryList 全部商家页 国家 下拉列表 接口失败 =' + error)
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
     * 重置 Country 下拉列表 的默认 选中 cell为 0号cell
     */
    resetCountryListData(){
        this.isLoading = false;
        this.isThisCompDidMount = false;
        this.tag = '-1'

        this.$CountryListDataArray.toJS().map(
            (model, i) => {
                {
                    model.isSelect = false;//给每个mode 加 是否被选中 属性
                    if (i == 0) {
                        model.isSelect = true;
                    }

                    this.$CountryListDataArray = this.$CountryListDataArray.set(i, model);
                }
            }
        );
    },

    /**
     * 重置 Country 接口的 数据 和 其 列表的 高度
     * @returns {function(*)}
     */
    releaseCountryListData(){
        return (dispatch) => {
            this.$CountryListDataArray = this.$CountryListDataArray.clear();
            this.isLoading = false;
            this.isThisCompDidMount = false;
            this.tag = '-1'
        }

    }
}

/**
 * 全部商家页 排序 下拉列表 API ,数据写死
 * @type {{ApiName: string, export: AllMerchantPageCategoryListApi.export}}
 */
export const AllMerchantPageSortDropDownListApi = {
    ApiName: 'AllMerchantPageSortDropDownListApi',
    $SortListDataArray: fromJS([]), //sort 接口 已经拿到的数据,immutable.List 数据类型  , 里边放 model, toJS()可转成JS 数组
    isLoading: false,//是否正在 请求接口
    isThisCompDidMount: false,//此API 对应的控件是否 挂载中
    sort_by: '-1',//默认的 https://api-staging-current.ebates.cn/docs.html#search-search-merchants-get 接口的 sort_by 参数,如果
    // 没选其他的, 此字段 不传

    /**
     * 拿 全部商家页 排序 下拉列表   的数据
     */
    fetchSortList(opt){
        return (dispatch) => {
            {
                if (this.isLoading && this.$SortListDataArray.size == 0)//如果 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态
                {
                    Log.log('BizApi fetchSortList 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态')
                    new SMSTimer({//为了能 从 初始化状态 切换到 Loading  状态, 否则太快了,切换不了
                        timerNums: 1,
                        callBack: (time) => {
                            Log.log('time===' + time);
                            if (time == -1) {

                                dispatch(BaseListActions.Loadinglist(opt, this.ApiName));
                                this.isThisCompDidMount = true;
                            }
                        }
                    }).start();

                } else if (!this.isLoading && this.$SortListDataArray.size > 0) {//列表挂载时, 接口已经拿到数据,列表直接切到 成功状态
                    dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                        couldLoadMore: false,
                        newContentArray: this.$SortListDataArray.toJS(),
                    }));
                    dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizDropDownMenuAndListApi.ApiName, this.$SortListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH/*每个cell 高 默认 44 ,以后 把此 常量写到 专门的 cell里*/))

                    this.isThisCompDidMount = true;

                }
                else if (!this.isLoading && this.$SortListDataArray.size == 0) {//刚进入 全部商家页, 主动 调此接口, 走这里的代码,此时列表可能未 挂载
                    Log.log('BizApi  fetchSortList 开始请求 全部商家页 排序 下拉列表  接口 ');
                    this.isLoading = true;

                    {

                        [{name: '智能排序', id: '-1'}, {name: '按返利最高', id: 'cashback'}, {
                            name: '按2周内拿到返利人数最多',
                            id: 'transfers'
                        }, {name: '按商家名首字母', id: 'letter'}].map(
                            (v, i) => {
                                {
                                    v.isSelect = false;//给每个mode 加 是否被选中 属性
                                    if (i == 0) {
                                        v.isSelect = true
                                    }
                                    v.index = i;//用于 点击 处理对号的位置
                                    this.$SortListDataArray = this.$SortListDataArray.set(this.$SortListDataArray.size, v);
                                }
                            }
                        );

                        // Log.log('BizApi  fetchCountryList 全部商家页 国家 下拉列表  的数据源 $CountryListDataArray=' + Log.writeObjToJson(this.$CategoryListDataArray.toJS()))
                        this.isLoading = false;

                        // if (this.isThisCompDidMount) {//列表正在挂载
                        //     dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                        //         couldLoadMore: false,
                        //         newContentArray: this.$CountryListDataArray.toJS(),
                        //     }));
                        //
                        //     dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizDropDownMenuAndListApi.ApiName, this.$CountryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH/*每个cell 高 默认 44 ,以后 把此 常量写到 专门的 cell里*/))
                        // }
                    }
                }
            }
        }
    },

    /**
     * 重置 排序 下拉列表 的默认 选中 cell为 0号cell
     */
    resetSortListData(){
        this.isLoading = false;
        this.isThisCompDidMount = false;
        this.sort_by = '-1'

        this.$SortListDataArray.toJS().map(
            (model, i) => {
                {
                    model.isSelect = false;//给每个mode 加 是否被选中 属性
                    if (i == 0) {
                        model.isSelect = true;
                    }

                    this.$SortListDataArray = this.$SortListDataArray.set(i, model);
                }
            }
        );
    },

    /**
     * 重置 排序 接口的 数据 和 其 列表的 高度
     * @returns {function(*)}
     */
    releaseSortListData(){
        return (dispatch) => {
            this.$SortListDataArray = this.$SortListDataArray.clear();
            this.isLoading = false;
            this.isThisCompDidMount = false;
            this.sort_by = '-1';
        }

    }
}

/**
 * 全部商家页 筛选 下拉列表 API ,前2个cell 数据写死, 此列表的2个接口全部Ok后,才切换到 成功状态,否则 是 loading 状态,因 任何一个接口没成功,数据显示就不完整,筛选就没意义
 * @type {{ApiName: string, export: AllMerchantPageCategoryListApi.export}}
 */
export const AllMerchantPageFilterDropDownListApi = {
    ApiName: 'AllMerchantPageFilterDropDownListApi',
    shipsApiName: 'shipsApiName',//直邮方式api
    paymentsApiName: 'paymentsApiName',//支付方式api
    $FilterListDataArray: fromJS([]), //筛选 接口 已经拿到的数据,immutable.List 数据类型  , 里边放 model, toJS()可转成JS 数组, 0和1号model对应 0和1 号 cell,2号model 对应直邮至 cell 的接口, 3号model 对应支付方式 cell的 接口,4号model对应 清空和确定cell
    isLoading: false,//是否正在 请求接口
    isThisCompDidMount: false,//此API 对应的控件是否 挂载中
    isShipsApiOk: false,//直邮方式 接口是否OK
    isPaymentsApiOk: false,// 支付方式 接口 是否 OK
    $shipsDataArr: fromJS([]),//存 ships 接口的 数据
    $paymentsDataArr: fromJS([]),//存 payments 接口的 数据
    tagsArr: [],//此 列表 多选 的 按钮 model的 key

    /**
     * 拿 全部商家页 筛选 下拉列表   的数据
     */
    fetchFilterList(opt){
        return (dispatch) => {
            {
                if (this.isLoading && this.$FilterListDataArray.size == 0)//如果 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态
                {
                    Log.log('BizApi fetchFilterList 列表控件 挂载时, 接口正在 请求中 ,列表控件就 切到 Loading 状态')
                    // new SMSTimer({//为了能 从 初始化状态 切换到 Loading  状态, 否则太快了,切换不了
                    //     timerNums: 0.5,
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

                } else if (!this.isLoading && this.$FilterListDataArray.size > 0) {//列表挂载时, 接口已经拿到数据,列表直接切到 成功状态
                    Log.log('BizApi fetchFilterList 列表挂载时, 接口已经拿到数据,列表直接切到 成功状态,this.$FilterListDataArray=' + Log.writeObjToJson(this.$FilterListDataArray));

                    dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                        couldLoadMore: false,
                        newContentArray: this.$FilterListDataArray.toJS(),
                    }));
                    dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizDropDownMenuAndListApi.ApiName, GlobalStyles.AllMerchantPageFilterListH))

                    this.isThisCompDidMount = true;

                }
                else if (!this.isLoading && this.$FilterListDataArray.size == 0) {//刚进入 全部商家页, 主动 调此接口, 走这里的代码,此时列表可能未 挂载
                    Log.log('BizApi  fetchFilterList 开始请求 全部商家页 筛选 下拉列表  接口 ');

                    this.isLoading = true;
                    dispatch(this.fetchShipsApi(opt));
                    dispatch(this.fetchPaymentsApi(opt));

                }
            }
        }
    },

    /**
     * 直邮方式 API https://api-staging-current.ebates.cn/docs.html#tags-ships-get
     */
    fetchShipsApi(opt){
        return (dispatch) => {
            if (this.$shipsDataArr.size > 0) {
                return;
            }

            let url = RequestUtil.getStagingOrProductionHost() + 'tags/ships';
            RequestUtil.GET(url, null,
                (header) => {
                    commonApiHeaderAppend(header)
                },
            ).then((responseData) => {

                // new SMSTimer({//模拟 拿到数据后, Loading状态的列表 切到 成功状态
                //     timerNums: 3,
                //     callBack: (time) => {
                //         Log.log('time===' + time);
                //         if (time == -1) {
                //
                //         }
                //     }
                // }).start();

                {
                    Log.log('BizApi  fetchShipsApi 全部商家页 ships  接口OK, responseData.data.length =' + Log.writeObjToJson(responseData.data.length));

                    // this.shipsDataArr=responseData.data;

                    responseData.data.map(
                        (model, i) => {
                            {
                                model.isSelect = false;//给每个mode 加 是否被选中 属性
                                this.$shipsDataArr = this.$shipsDataArr.set(this.$shipsDataArr.size, model)

                            }
                        }
                    );

                    this.isShipsApiOk = true;

                    // this.CombineData();
                    dispatch(this.CombineData(opt));
                }

            }).catch((error) => {
                Log.log('BizApi  fetchShipsApi 全部商家页 ships 接口失败 =' + error)
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

    },

    /**
     * 支付方式 API https://api-staging-current.ebates.cn/docs.html#tags-payments-get
     */
    fetchPaymentsApi(opt){
        return (dispatch) => {
            if (this.$paymentsDataArr.size > 0) {
                return;
            }

            let url = RequestUtil.getStagingOrProductionHost() + 'tags/payments';
            RequestUtil.GET(url, null,
                (header) => {
                    commonApiHeaderAppend(header)
                },
            ).then((responseData) => {

                // new SMSTimer({//模拟 拿到数据后, Loading状态的列表 切到 成功状态
                //     timerNums: 5,
                //     callBack: (time) => {
                //         Log.log('time===' + time);
                //         if (time == -1) {
                //
                //         }
                //     }
                // }).start();

                {
                    Log.log('BizApi  fetchPaymentsApi 全部商家页 payments  接口OK, responseData.data .length=' + Log.writeObjToJson(responseData.data.length));

                    responseData.data.map(
                        (model, i) => {
                            {
                                model.isSelect = false;//给每个mode 加 是否被选中 属性
                                // this.paymentsDataArr.push(model)
                                this.$paymentsDataArr = this.$paymentsDataArr.set(this.$paymentsDataArr.size, model);
                            }
                        }
                    );

                    this.isPaymentsApiOk = true;
                    dispatch(this.CombineData(opt));

                }

            }).catch((error) => {
                Log.log('BizApi  fetchPaymentsApi 全部商家页 payments 接口失败 =' + error)
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

    },

    /**
     * 如果2个接口都OK ,开始组合此下拉列表的数据数据
     * @constructor
     */
    CombineData(opt){
        return (dispatch) => {
            if (this.isShipsApiOk && this.isPaymentsApiOk) {

                this.$FilterListDataArray = this.$FilterListDataArray.set(this.$FilterListDataArray.size, {
                    name: '只看返利商家',
                    index: 0,
                    isSelect: false
                });
                this.$FilterListDataArray = this.$FilterListDataArray.set(this.$FilterListDataArray.size, {
                    name: '收藏的商家',
                    index: 1,
                    isSelect: false
                });
                this.$FilterListDataArray = this.$FilterListDataArray.set(this.$FilterListDataArray.size, {
                    shipsDataArr: this.$shipsDataArr,
                    index: 2
                });
                this.$FilterListDataArray = this.$FilterListDataArray.set(this.$FilterListDataArray.size, {
                    paymentsDataArr: this.$paymentsDataArr,
                    index: 3
                });
                // this.$FilterListDataArray = this.$FilterListDataArray.set(this.$FilterListDataArray.size, {name:'清空确定cell',index:4});

                this.isLoading = false;

                if (this.isThisCompDidMount) {//列表正在挂载
                    dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                        couldLoadMore: false,
                        newContentArray: this.$FilterListDataArray.toJS(),
                    }));

                    dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizDropDownMenuAndListApi.ApiName, GlobalStyles.AllMerchantPageFilterListH /*不想动态算了,先写死 *//*this.$FilterListDataArray.size *
                     GlobalStyles.AllMerchantPageDropDownListCellH*/))
                }
            }
        }

    },

    /**
     * 为 直邮方式 网格视图 拿 数据源
     * @returns {function(*)}
     */
    fetchShipsGridViewData(){
        return (dispatch) => {
            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.shipsApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, this.$shipsDataArr.toJS()));
        }
    },

    /**
     * 为 支付方式 网格视图 拿 数据源
     * @returns {function(*)}
     */
    fetchPaymentsGridViewData(){
        return (dispatch) => {
            Log.log('BizApi fetchPaymentsGridViewData this.$paymentsDataArr.size=' + this.$paymentsDataArr.size)
            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.paymentsApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, this.$paymentsDataArr.toJS()));
        }
    },

    /**
     * 筛选 下拉列表 点击 清空 后 调
     */
    clearSelectData(){
        return (dispatch) => {
            Log.log('BizApi clearSelectData ');

            {//重置 0和1 号 cell
                let model0 = this.$FilterListDataArray.get(0);
                model0.isSelect = false;
                this.$FilterListDataArray = this.$FilterListDataArray.set(0, model0);

                let model1 = this.$FilterListDataArray.get(1);
                model1.isSelect = false;
                this.$FilterListDataArray = this.$FilterListDataArray.set(1, model1);

                dispatch(BaseListActions.ChangeListNumsItemAction(BaseListActions.BaseListFetchDataType.REFRESH, this.ApiName, {
                    indexArr: [0, 1],
                    newDataArr: [{...model0}, {...model1}]
                }));
            }

            this.$FilterListDataArray = this.$FilterListDataArray.set(this.$FilterListDataArray.size, {
                name: '只看返利商家',
                index: 0,
                isSelect: false
            });

            this.tagsArr = [];

            this.$shipsDataArr.toJS().map(
                (model, i) => {
                    model.isSelect = false;
                    this.$shipsDataArr = this.$shipsDataArr.set(i, model);
                }
            );
            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.shipsApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, this.$shipsDataArr.toJS()));

            this.$paymentsDataArr.toJS().map(
                (model, i) => {
                    model.isSelect = false;
                    this.$paymentsDataArr = this.$paymentsDataArr.set(i, model);
                }
            );
            dispatch(BaseGridViewActions.changeBaseGridViewStates(this.paymentsApiName, BaseGridViewActions.BaseGridViewStates.fetchOk, this.$paymentsDataArr.toJS()));

        }
    },

    /**
     * 重置 筛选 接口的 数据 和 其 列表的 高度,在 整个大的筛选控件 卸载时 调
     * @returns {function(*)}
     */
    releaseFilterListData(){
        return (dispatch) => {
            this.$FilterListDataArray = this.$FilterListDataArray.clear();
            this.isLoading = false;
            this.isThisCompDidMount = false;
            this.$paymentsDataArr = this.$paymentsDataArr.clear();
            this.$shipsDataArr = this.$shipsDataArr.clear();
            this.tagsArr = [];
            this.isShipsApiOk = false;//直邮方式 接口是否OK
            this.isPaymentsApiOk = false;
        }

    }
}

/**
 * 通用的 包含 menu和 下拉列表的 控件的 api
 * @type {{ApiName: string}}
 */
export const BizDropDownMenuAndListApi = {
    ApiName: 'BizDropDownMenuAndListApi',
}


/**
 * 初步分解 BaseListComp 发起的 列表 通用的 各种API
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
        case MerchantPageApi.ApiName: {
            return MerchantPageApi.fetchData(opt);
        }
            break;
        case MerchantDetailPageApi.ApiName: {
            return MerchantDetailPageApi.fetchPageData(opt, BaseListCompProps);
        }
            break;
        case HomePageHotCouponListApi.ApiName: {
            return HomePageHotCouponListApi.fetchPageData(opt, BaseListCompProps);
        }
            break;
        case HomePageHotClickCouponListApi.ApiName: {
            return HomePageHotClickCouponListApi.fetchListData(opt, BaseListCompProps);
        }
            break;
        case EBCouponListApi.ApiName: {
            return EBCouponListApi.fetchListData(opt, BaseListCompProps);
        }
            break;
        case AllMerchantPageListApi.ApiName: {
            return AllMerchantPageListApi.SearchMerchants(opt, BaseListCompProps);

        }
            break;
        case AllMerchantPageCategoryListApi.ApiName: {
            return AllMerchantPageCategoryListApi.fetchCategoryList(opt, BaseListCompProps);

        }
            break;
        case AllMerchantPageCountryListApi.ApiName: {
            return AllMerchantPageCountryListApi.fetchCountryList(opt, BaseListCompProps);

        }
            break;
        case AllMerchantPageSortDropDownListApi.ApiName: {
            return AllMerchantPageSortDropDownListApi.fetchSortList(opt, BaseListCompProps);

        }
            break;
        case AllMerchantPageFilterDropDownListApi.ApiName: {
            return AllMerchantPageFilterDropDownListApi.fetchFilterList(opt, BaseListCompProps);

        }
            break;
        case AllCouponPageApi.AllCouponPageCategoryListApi.ApiName: {
            return AllCouponPageApi.AllCouponPageCategoryListApi.fetchCategoryList(opt);

        }
            break;
        case AllCouponPageApi.AllCouponPageListApi.ApiName: {
            return AllCouponPageApi.AllCouponPageListApi.SearchCoupon(opt, BaseListCompProps);

        }
            break;
        case AllCouponPageApi.AllCouponPageSortDropDownListApi.ApiName: {
            return AllCouponPageApi.AllCouponPageSortDropDownListApi.fetchSortList(opt);

        }
            break;
        case CouponDetailPageApi.CouponDetailPageApi.ApiName: {
            return CouponDetailPageApi.CouponDetailPageApi.fetchPageList(opt, BaseListCompProps);
        }
            break;
        case PersonalPageApi.PersonalPageApi.ApiName: {
            return PersonalPageApi.PersonalPageApi.fetchPageList(opt, BaseListCompProps);
        }
            break;
        case SettingPageApi.SettingPageApi.ApiName: {
            return SettingPageApi.SettingPageApi.fetchPageList(opt, BaseListCompProps);
        }
            break;
        case AboutEbatesCnPageApi.AboutEbatesCnPageApi.ApiName: {
            return AboutEbatesCnPageApi.AboutEbatesCnPageApi.fetchPageList(opt, BaseListCompProps);
        }
            break;
    }
}
