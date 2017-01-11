/**
 * Created by Ebates on 17/1/11.
 * BizApi
 *  * 业务逻辑需要的所有接口
 */
import *as BaseListActions from '../../Redux/Actions/BaseListActions'

/**
 * 搜索页 列表的 API
 * @type {{ApiName: string}}
 */
export const SearchPageListApi={
    ApiName:'SearchPageListApi',
    fetchData(opt){
        let data=[{},{}];
        return (dispatch) => {

            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, data));

        };
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