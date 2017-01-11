/**
 * Created by Ebates on 17/1/11.
 * BaseListActions
 * 通用列表的 actions
 */

/**
 * 通用列表 的马上进入的不同状态,此 actions 跟UI 相关,跟 API 接口 无 关
 * @type {{INITIALIZE: string, START: string, SUCCESS: string, FAILURE: string}}
 */
export const BaseListStatus = {
    INITIALIZE: 'fetch_list_data_status_initialize', // 第一次 获取 列表 数据,此时不画列表控件,而是画个菊花, 和 列表刷新时的 UI 不一样
    START: 'fetch_list_data_status_start', //列表准备获取数据
    Refreshing:'Refreshing',//正准备进入 下拉刷新的UI 状态
    SUCCESS: 'fetch_list_data_status_success', //列表成功获取到数据
    FAILURE: 'fetch_list_data_status_failure', //列表获取数据失败
    NODATA: 'fetch_list_data_status_nodata', //列表获取到无缓存数据
    ADD: 'fetch_list_data_status_addOneData',//列表添加一条数据
    REMOVE:'fetch_list_data_status_removeOneData',//列表删除一条数据
    CHANGEITEMSTATE:'fetch_list_data_status_changeItemState',//列表一条数据改变状态
};

/**
 * 列表获取数据的方式, 跟 API 接口有关
 * @type {{REFRESH: number, MORE: number}}
 */
export const BaseListFetchDataType = {
    INITIALIZE: 0,//第一次获取 列表的数据
    REFRESH: 1,//刷新 首页数据
    MORE: 2, // 获取更多数据
};


/**
 * 通用列表的 获取数据 成功 action
 * opt: LIST_FETCH_TYPE 类型,描述 获取数据的方式
 * ApiName; 不同接口的tag
 */
export function SuccessFetchinglist(opt, ApiName, newData) {
    return { type: BaseListStatus.SUCCESS, opt, ApiName,  newData };
}