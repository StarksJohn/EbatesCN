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

    //热门搜索 cell 的  数据源
    hotSearchCellData: [{hotSearchCell: [{title: 'GNC'}, {title: 'Walgreens'}, {title: '普丽普莱'}, {title: '黑五'}, {title: '雅诗兰黛'}, {title: 'shoebuy'}, {title: 'Amazon'}, {title: '联名卡'}, {title: 'shoebuy2'}]},
        {bottomForPaddingCell: '底部为了留白的cell'}],

    /**
     * 第一次 | 刷新 获取数据
     * @param opt
     * @returns {function(*)}
     */
    fetchData(opt){
        return (dispatch)=> {

            let data = this.hotSearchCellData;

            HistorySearchDB.loadHistoryDB().then((rawData)=> {
                if (rawData.length > 0) {
                    if (opt==BaseListActions.BaseListFetchDataType.INITIALIZE){
                        data.splice(-1, 0, {historySearchCell: '历史搜索'});//数组倒数第二个元素插入一个 元素
                    }

                    rawData.map(
                        (v, i)=> {
                            data.splice(-1, 0, v);//数组倒数第二个元素 循环 插入一个 关键字
                        }
                    );
                    dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, data));

                }
            }).catch(err => {
                dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, data));

            });
        }
            ;
    },

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
            return SearchPageListApi.fetchData(opt);
        }
            break;
    }
}