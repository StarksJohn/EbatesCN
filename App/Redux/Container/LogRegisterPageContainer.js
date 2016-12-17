/*
登录注册页 的容器组件,用于 redux
 */
import React from 'react';
import {connect} from 'react-redux';
import LogRegisterPage from '../../Pages/LogRegisterPage'

class LogRegisterPageContainer extends React.Component{

    render(){
        return (
            <LogRegisterPage {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    //把 state里的 homePageReducer 注入到 HomePage.props里
    const {LogRegisterPageReducer}=state;
    return {LogRegisterPageReducer};

}

export default connect(mapStateToProps)(LogRegisterPageContainer);