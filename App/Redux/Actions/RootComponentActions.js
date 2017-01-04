/**
 * Created by Ebates on 16/12/27.
 * 带左屏的 跟页面 的  actions
 */

// export const registerBtStates={
//     unable:{
//         disabled:true,
//         backColor:Colors.halfOpacityAppUnifiedBackColor
//     },
//     enable:{
//         disabled:false,
//         backColor:Colors.appUnifiedBackColor
//     },
// }

/**
 * 跟页面左图改变 nav
 * @type {string}
 */
export const  changeNavAction='changeNavAction';
export function changeNavActions(nav) {
    return {
        type:changeNavAction,
        newNav:nav,
    }
}
