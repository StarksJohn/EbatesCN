/**
 * Created by Ebates on 17/1/11.
 * BizApi
 *  * 业务逻辑需要的所有接口
 */
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import *as HistorySearchDB from '../../DB/BizDB/HistorySearchDB'


/**
 * 搜索页 列表的 API
 * @type {{ApiName: string}}
 */
export const SearchPageListApi = {
    ApiName: 'SearchPageListApi',

    //搜索 页 最大列表  的  数据源, 9个按钮+热门搜索 text 是一个 cell, 默认是 热门搜索cell 和 底部留白cell 2个 数据源
    // searchPageListData: [{key: [{title: 'GNC'}, {title: 'Walgreens'}, {title: '普丽普莱'}, {title: '黑五'}, {title: '雅诗兰黛'}, {title: 'shoebuy'}, {title: 'Amazon'}, {title: '联名卡'}, {title: 'shoebuy2'}]},
    //     {key: '底部为了留白的cell'}],
    hotSearchCellData: [{title: 'GNC'}, {title: 'Walgreens'}, {title: '普丽普莱'}, {title: '黑五'}, {title: '雅诗兰黛'}, {title: 'shoebuy'}, {title: 'Amazon'}, {title: '联名卡'}, {title: 'shoebuy2'}],

    /**
     * 历史搜索 列表 第一次 挂载时| commit后 刷新列表时 获取数据源
     * @param opt
     * @returns {function(*)}
     */
    fetchData(opt){
        return (dispatch) => {
            let data = [this.hotSearchCellData, '底部为了留白的cell'];

            //rawData:  缓存的 关键词
            HistorySearchDB.loadHistoryDB().then((rawData)=> {
                if (rawData.length > 0) {//有缓存
                    data = this.packageCachedDataToListDataSource(rawData, data);
                    dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, data));
                }
            }).catch(err => {
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, data));

            });
        }
    },

    /**
     * 把 缓存里更新过的 数据 组装到 列表的 数据源 里
     * @param rawData
     * @param data
     * @returns {boolean}
     */
    packageCachedDataToListDataSource(rawData, data){
        data.splice(1, 0, '历史搜索' );//数组倒数第二个元素插入一个 元素
        rawData.map(
            (v, i)=> {
                data.splice(-1, 0, v);//数组倒数第二个下标 循环 插入一个 关键字
            }
        );
        return data;
    },

    /**
     * 清除 关键词 列表
     * @param opt
     * @returns {function(*)}
     */
    clearAllHistorySearch(opt){
        return (dispatch) => {
            let data = [this.hotSearchCellData, '底部为了留白的cell'];

            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, data));
        }
    },

    /**
     * 删除某个 关键词
     * @param word
     * @returns {function(*)}
     */
    deleteOneKeyWord(word, opt){
        return (dispatch) => {
            let data = [this.hotSearchCellData, '底部为了留白的cell'];

            HistorySearchDB.deleteOneKeyWordFromHistoryDB(word).then((rawData)=> {
                if (rawData.length > 0) {//有缓存
                    data = this.packageCachedDataToListDataSource(rawData, data);
                }
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, data));
            }).catch(err => {
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, data));

            });
        }
    }

}


/**
 * 初步分解 各种API
 * @param opt
 * @param pageNo
 * @param ApiName
 * @returns {*}
 */
export function fetchApi(opt, pageNo, ApiName) {
    switch (ApiName) {
        case SearchPageListApi.ApiName: {
            // if (opt == BaseListActions.BaseListFetchDataType.INITIALIZE){
            //     return SearchPageListApi.fetchData(opt);
            // }else if(opt == BaseListActions.BaseListFetchDataType.REFRESH)
            return SearchPageListApi.fetchData(opt);
        }
            break;
    }
}