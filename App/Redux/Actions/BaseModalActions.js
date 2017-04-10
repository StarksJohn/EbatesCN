/**
 * Created by Ebates on 2017/4/7.
 * BaseModalActions.js
 */

export const changeModelContainerVisiable='changeModelContainerVisiable'
/**
 * 根据 ApiName 来 确定改变某个Modal 控件 里的 父节点 的 state
 * @param ApiName
 * @param isVisiable
 * @returns {{type: string, isVisiable: *, ApiName: *}}
 */
export function changeModelContainerVisiableAction(ApiName,isVisiable) {
    return {type:changeModelContainerVisiable,ApiName,isVisiable,}
}

export const changeModalVisiable='changeModalVisiable'
/**
 * 根据 ApiName 来 确定改变某个Modal 控件 里的 modal子节点 的 state
 * @param ApiName
 * @param isVisiable
 * @returns {{type: string, isVisiable: *, ApiName: *}}
 */
export function changeModalVisiableAction(ApiName,isVisiable) {
    return {type:changeModalVisiable,isVisiable,ApiName}
}


//测试BaseModelBranch 分支新加的内容