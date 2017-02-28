/**
 * Created by Ebates on 16/12/22.
 * FilterMenuInitialState
 * BizFilterMenuReducer 的 初始 Immutable 状态, 参考 snowflake 项目 的 authInitialState,
 */
'use strict'
const {Record, fromJS} = require('immutable') //导入  Immutable.js 的 Record API
// import *as ForgetPassPageActions from '../Actions/ForgetPassPageActions'


let InitialState = Record({
    $dataArray: fromJS([{id: 0, title: '母婴'}, {id: 1, title: '国家'}, {id: 2, title: '排序'}, {
        id: 3,
        title: '筛选'
    }]), //已经拿到的数据,immutable.Array 结构 , 里边放 model, toJS()可转成JS 数组
});
export default InitialState