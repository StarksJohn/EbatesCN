/**
 * 跨平台 根页面的容器组件 ,包装 其 展示组件 RootPages,为其提供数据
 */
import React from 'react';
import {connect} from 'react-redux';
import RootPages from '../../Pages/RootPages'
// import {showToast} from '../comp/CommonComp';
// import CodePush from 'react-native-code-push';

class RootPagesContainer extends React.Component {
    componentDidMount() {
        // CodePush.sync({
        //     deploymentKey: 'P9wn1CWxaei8aKfpsHJ33_F1-vGxN1KoBmCm-',
        //     updateDialog: {
        //         optionalIgnoreButtonLabel: '稍后',
        //         optionalInstallButtonLabel: '立即更新',
        //         optionalUpdateMessage: '儿食记 有新版本了，是否更新？',
        //         title: '更新提示'
        //     },
        //     installMode: CodePush.InstallMode.IMMEDIATE
        // });
    }

    render() {
        return (
            <RootPages {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    const {RootPageReducer} = state;
    return {
        RootPageReducer  //
    };
}

export default connect(mapStateToProps)(RootPagesContainer);
