/**
 * Created by Ebates on 16/12/15.
 *
 * 跟页面里需要的action
 */
import {AllContainers} from '../Container/AllPageContainers';

export const Switch_bottomTab = 'switch_bottomTab'; //切换跟页面的底部tabbar
/**
 * 跨平台的底部tabbar的信息
 * @type {Array}
 */
export const arrBottomTabInfo = Object.keys(AllContainers);

/**
 * 双平台: 切换底部tabbar 的动作
 * @param tab
 * @returns {{type, tab: *}}
 */
export function switchBottomTabAction(tab) {
    return {
        type: Switch_bottomTab,
        tab: tab,
    }
}
