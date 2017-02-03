/**
 * Created by Ebates on 17/1/18.
 *
 *  搜索结果页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView, Platform} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import GlobalStyles from '../Global/GlobalStyles'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import BaseSearchBar from '../Comp/Base/BaseSearchBar/BaseSearchBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import BizSearchResultPagScrollableTabBar from '../Comp/BizCommonComp/BizSearchResultPagScrollableTabBar'
import SearchResultPageMerchantListContanier from '../Redux/Container/SearchResultPageMerchantListContanier'
import *as BizApi from '../NetWork/API/BizApi'
import *as SearchResultPageActions from '../Redux/Actions/SearchResultPageActions'

/**
 *
 */
export class SearchResultPage extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e)=> baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.SearchResultPage
            });
        }
    }

    componentWillMount() {
        this.props.dispatch(SearchResultPageActions.getDefultTabLabelsAction());
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        Log.log('SearchResultPage componentWillUnmount')
    }

    onSubmit(value) {
        this.props.dispatch(SearchResultPageActions.updateTabLabelsAction(BizApi.SearchResultPageMerchantListAPI.tabLabel, 111110));

    }

    render() {
        const {navigator} = this.props;

        let searchBar = <BaseSearchBar value={this.props.route.value}
                                       onSubmit={(value)=>this.onSubmit(value)
                                       }
                                       customContainerStyle={{paddingLeft: 10}}
                                       customSearchStyle={{left: 16}}
                                       defaultPaddingRight={50}
                                       onFocusPaddingRight={37}
        />;
        //
        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.white} }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                leftButton={NavBarButton.getBackButton(()=>baseOnBackPress(navigator, this.backAndroidEventListener))}
                searchBar={searchBar}
                hide={false}/>;

        let content =
            <ScrollableTabView
                ref="scrollableTabView"
                renderTabBar={() =>
                    <BizSearchResultPagScrollableTabBar
                        style={{height: 45, borderWidth: 0, elevation: 0.1}}
                        tabStyle={{height: 45}}
                        activeTextColor='rgba(54, 166, 66, 1)'
                        tabBarBackgroundColor={Colors.white}
                        tabBarUnderlineColor={Colors.appUnifiedBackColor}
                        inactiveTextColor={Colors.BizCommonBlack}
                        textStyle={{
                            fontSize: 14,
                            //backgroundColor: Colors.getRandomColor()
                        }}
                        underlineColor='rgba(67, 187, 78, 1)'
                        underLineBottom={10}
                        underlineHeight={2}/>}
            >
                <SearchResultPageMerchantListContanier {...this.props}
                                                       tabLabel={this.props.baseReducer.merchantListTabLable }
                />
                <SearchResultPageMerchantListContanier {...this.props}
                                                       tabLabel={this.props.baseReducer.merchantListTabLable }
                />
            </ScrollableTabView>

        return (
            <View style={GlobalStyles.pageContainer}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                {content}
            </View>
        );
    }

}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {SearchResultPageReducer}=state;
    return {baseReducer: SearchResultPageReducer};
}
export default connect(mapStateToProps)(SearchResultPage);