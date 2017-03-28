/**
 * Created by Ebates on 2017/3/28.
 * BizDropDownMenuAndListInit
 */
const {Record, fromJS} = require('immutable') //导入  Immutable.js 的 Record API

export const defaultH=100;
let InitialState = Record({
    DropDownListHeight:defaultH,//下拉列表的高
    ApiName:'',
});
export default InitialState