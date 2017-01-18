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

/**
 *  展示组件
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

    componentDidMount() {

    }

    componentWillUnmount() {
        Log.log('SearchResultPage componentWillUnmount')
    }

    onSubmit(value) {

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
        // let searchList= <SearchPageListComp ref="searchList" {...this.props }
        //                                     onSubmit={(value)=>{
        //                                         this.onSubmit(value)
        //                                     }
        //                                     }
        // />;

        return (
            <View style={GlobalStyles.pageContainer}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                {/*{searchList}*/}
            </View>
        );
    }

}

// function mapStateToProps(state) {
//
//     //推荐此种  解构赋值的写法
//     const {SearchPageListReducer}=state;
//     return {baseReducer: SearchPageListReducer};
// }
export default connect()(SearchResultPage);