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
    FAILURE: 'fetch_list_data_status_failure', //列表获取数据失败,可能是网络异常引起
    NODATA: 'fetch_list_data_status_nodata', //列表获取到无缓存数据
    ADD: 'fetch_list_data_status_addOneData',//列表添加一条数据
    REMOVE:'fetch_list_data_status_removeOneData',//列表删除一条数据
    RemoveNums:'RemoveNums',//列表删除多条数据
    ChangeOneItem:'fetch_list_data_status_changeItemState',//列表一条数据改变
    WillUnmount:'WillUnmount',//列表将要被 从 DOM移除
    InsertOneItem:'InsertOneItem',// 列表 插入一条 数据
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

/**
 * 改变列表里一个item
 * @param opt
 * @param ApiName
 * @param newData {index:'被改变item 的下标 ',newData:'新的数据源'}
 * @returns {{type: string, opt: *, ApiName: *, newData: *}}
 * @constructor
 */
export function ChangeListOneItemAction(opt, ApiName, newData) {
    return { type: BaseListStatus.ChangeOneItem, opt, ApiName,  newData };
}

/**
 * 列表里插入一个item
 * @param opt
 * @param ApiName
 * @param newData {index:'被插入item 的下标 ',newData:'新的数据源'}
 * @returns {{type: string, opt: *, ApiName: *, newData: *}}
 * @constructor
 */
export function ListInsertOneItemAction(opt, ApiName, newData) {
    return { type: BaseListStatus.InsertOneItem, opt, ApiName,  newData };
}

/**
 * 读取接口失败,可能是 网络异常导致
 * @param opt
 * @param ApiName
 * @returns {{type: string, opt: *, ApiName: *}}
 * @constructor
 */
export function FailureFetchinglist(opt, ApiName) {
    return { type: BaseListStatus.FAILURE, opt, ApiName };
}

/**
 * 删除列表里某条数据
 * @param ApiName
 * @param newData {index:xxx} index是被删除数据在列表里的下标
 * @returns {{type: string, ApiName: *, newData: *}}
 * @constructor
 */
export function RemoveOneItemFromlist( ApiName,newData) {
    return { type: BaseListStatus.REMOVE,  ApiName,newData };
}

/**
 * 删除列表里多条连续的数据
 * @param ApiName
 * @param newData:{fromIndex:xxx,toIndex:xxx} 被删除的 model 在数组的起始和 结束 下标
 * @returns {{type: string, ApiName: *, newData: *}}
 * @constructor
 */
export function RemoveNumsItemFromlist( ApiName,newData) {
    return { type: BaseListStatus.RemoveNums,  ApiName,newData };
}

/**
 * 列表将要被 从 DOM移除
 * @param ApiName
 * @returns {{type: string, ApiName: *}}
 * @constructor
 */
export function WillUnmount( ApiName) {
    return { type: BaseListStatus.WillUnmount, ApiName };
}