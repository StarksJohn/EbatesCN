/**
 * Created by Ebates on 16/12/27.
 */
import {
    ListView,
} from 'react-native';
import InitialState, {loadMore} from '../InitialState/ListInitialState'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
const {List,fromJS} = require('immutable') //导入  Immutable.js 的 Record API


const initialState = new InitialState()/*通用列表的初始UI状态*/
/*搜索页列表的 特殊状态*/
    .setIn(['ApiName'], BizApi.SearchPageListApi.ApiName)
    .setIn(['isRenderRefreshControl'], false)
    .setIn(['isRenderFooterView'], false);

export default function SearchPageListReducer(state = initialState, action) {
    if (state.ApiName && state.ApiName != action.ApiName) {
        return state;
    }

    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case BaseListActions.BaseListStatus.SUCCESS: {

            // {
            //     let $dataArray = fromJS
            //     ([ [{title: 'GNC'}, {title: 'Walgreens'}, {title: '普丽普莱'}, {title: '黑五'}, {title: '雅诗兰黛'}, {title: 'shoebuy'}, {title: 'Amazon'}, {title: '联名卡'}, {title: 'shoebuy2'}],'底部为了留白的cell' ] );
            //     $dataArray=$dataArray.insert(1, '历史搜索');
            //     // let data = [];
            //     // for (let i = 0; i < $dataArray.size; i++) {
            //     //     data.push($dataArray.get(i));
            //     // }
            //     Log.log($dataArray._tail.array);
            // }




            let allContent = action.opt === BaseListActions.BaseListFetchDataType.MORE ? loadMore(state.dataArray, action.newData) : action.newData;

            let nextState = state
                .setIn(['dataArray'], allContent)
                .setIn(['dataSource'], state.dataSource.cloneWithRows(allContent))
                .setIn(['status'], BaseListActions.BaseListStatus.SUCCESS)
                .setIn(['opt'], action.opt);

            return nextState;
        }
            break;
    }

    /**
     * ## Default
     */
    return state;
}