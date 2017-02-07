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
    INITIALIZE: 'fetch_list_data_status_initialize', // 第一次 获取 列表 数据,此时不画列表控件,而是画个菊花, 和 列表刷新时的 UI 不一样, 之后变成
    // 一开始加载第一页数据时, 直接画 列表的 footerview,而不是 不画 列表
    Loading: 'fetch_list_data_status_Loading', //列表正在获取(第一页|下页)数据,到 收到网络数据|网络请求失败 为止
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
 * 控件在 componentDidMount 时 回调的 ,避免 之前此控件的 $dataArray 里有数据, 故 负责把 $dataArray 里的数据 清空
 * @param ApiName
 * @returns {{type: string, ApiName: *}}
 * @constructor
 */
export function InitListDataSource( ApiName) {
    return { type: BaseListStatus.INITIALIZE,  ApiName };
}

/**
 * 切换 列表的 状态 为 BaseListStatus.Loading 状态, 可能是 第一次获取列表数据时的Loading, 也可能是 刷新列表 时的 Loading, 也可能是 加载 更多时的 Loading,具体看 opt
 * @param opt : BaseListFetchDataType 类型
 * @param ApiName : 哪个列表
 * @returns {{type: string, opt: *, ApiName: *}}
 * @constructor
 */
export function Loadinglist(opt, ApiName) {
    return { type: BaseListStatus.Loading, opt, ApiName };
}

/**
 * 切换列表的 状态 为 通用列表的 获取数据 成功 action
 * opt: LIST_FETCH_TYPE 类型,描述 获取数据的方式
 * ApiName; 不同接口的tag
 */
export function SuccessFetchinglist(opt, ApiName, newData) {
    return { type: BaseListStatus.SUCCESS, opt, ApiName,  newData };
}