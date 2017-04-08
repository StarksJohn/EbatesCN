/**
 * 所有 containers 的集合
 * AllPageContainers.js
 */
import React from 'react';

import HomePageContainer from './HomePageContainer';
import MerchantPageContainer from './MerchantPageContainer'
import SearchPageContainer from './SearchPageContainer'
import PersonalPageContainer from './PersonalPageContainer';

export const AllContainers = {
    HomePageContainer: {tabBarName: '首页', comp: HomePageContainer, badgeText: '0',requireNormalIcon:require('../../Img/common_toolbar_icon_home_normal@2x.png'), requireSelectIcon: require("../../Img/common_toolbar_icon_home_pressed@2x.png") },
    MerchantPageContainer: {tabBarName: '商家', comp: MerchantPageContainer, badgeText: '0',requireNormalIcon:require('../../Img/common_toolbar_icon_stores_normal@2x.png'), requireSelectIcon: require("../../Img/common_toolbar_icon_stores_pressed@2x.png") },
    SearchPageContainer: {tabBarName: '搜索', comp: SearchPageContainer, badgeText: '0',requireNormalIcon:require('../../Img/common_toolbar_icon_search_normal@2x.png'), requireSelectIcon: require("../../Img/common_toolbar_icon_search_pressed@2x.png")},
    PersonalPageContainer: {tabBarName: '我的', comp: PersonalPageContainer, badgeText: '0',requireNormalIcon:require('../../Img/common_toolbar_icon_account_normal@2x.png'), requireSelectIcon: require("../../Img/common_toolbar_icon_account_pressed@2x.png") }
}


/**
 * 根据key 获取对应的container 控件
 * @param nav
 * @param Comp
 * @returns {XML}
 */
export function getOneContainer(nav, Comp) {

    return ( < Comp navigator={ nav }/>
    );
}