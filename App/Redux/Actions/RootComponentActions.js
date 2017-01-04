/**
 * Created by Ebates on 16/12/27.
 * 带左屏的 跟页面 的  actions
 */

export const registerBtStates={
    unable:{
        disabled:true,
        backColor:Colors.halfOpacityAppUnifiedBackColor
    },
    enable:{
        disabled:false,
        backColor:Colors.appUnifiedBackColor
    },
}

/**
 * 注册页面初始化state,避免 record 类型的数据 不因页面Pop而 重置
 * @type {string}
 */
export const  registerPageInitState='registerPageInitState';
export function registerPageInitStateActions() {
    return {
        type:registerPageInitState,
    }
}
