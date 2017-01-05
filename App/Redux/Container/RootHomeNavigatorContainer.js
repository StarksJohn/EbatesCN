/**
 * 跟组件的 主页 这个 一级页面的 根nav的 Container
 */
import React from 'react';
import {connect} from 'react-redux';
import RootNavigator from '../../Root/RootNavigator'

class RootHomeNavigatorContainer extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <RootNavigator {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    const {RootHomeNavReducer} = state;
    return {
        initialRoute: RootHomeNavReducer.initialRoute  //
    };
}

export default connect(mapStateToProps)(RootHomeNavigatorContainer);
