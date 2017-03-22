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
import *as MerchantDetailPageActions from '../../Redux/Actions/MerchantDetailPageActions'

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
                        exclude: 'merchant'/*优惠及折扣 列表 因在商家详情页,故此列表的优惠cel的左下角不需要展示商家名称,故加 exclude:'merchant' 这个参数 */,
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
            // Log.log('BizApi MerchantDetailPageApi fetchPageData opt=' + opt)

            if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE) {//一开始 挂载

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
                        newData: responseData.data
                    }));


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
    }
}
