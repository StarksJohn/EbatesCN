/**
 * 跟组件的 推荐好友 这个 一级页面的 根nav的 Container
 */
import React from 'react';
import {connect} from 'react-redux';
import RootNavigator from '../../Root/RootNavigator'

class RooRecommendFriendNavContainer extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <RootNavigator {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    const {RootRecommendFriendNavReducer} = state;
    return {
        initialRoute: RootRecommendFriendNavReducer.initialRoute  //
    };
}

export default connect(mapStateToProps)(RooRecommendFriendNavContainer);
