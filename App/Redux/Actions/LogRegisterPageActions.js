/**
 * Created by Ebates on 16/12/16.
 * 登录注册页 的actions
 */

export const GET_TITLE_BAR_TAB = 'get_title_bar_tab'; //左右滚动tbv顶部 menu 的初始化
/*
 登录注册页 左右滚动tbv顶部 menu 内容的初始化
 */
export function getTitleBarTab() {
    return {
        type: GET_TITLE_BAR_TAB,
        scrollTbvMenuTitles:['登录',
            '注册']
    }
}