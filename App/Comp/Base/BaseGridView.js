/**
 * 网格view,可 外部自定义 绘制每个 格子的逻辑
 * 借鉴 曹神的 reading
 */
import React, {PropTypes, Component} from 'react';
import {
    View,
    StyleSheet,
    ListView
} from 'react-native';

import *as BaseGridViewActions from '../../Redux/Actions/BaseGridViewActions'


export  default class BaseGridView extends Component {
    static propTypes = {
        // items: PropTypes.array,//数据源
        renderItem: PropTypes.func,//怎么画每个数据源
        renderLoadingStateView:PropTypes.func,//画 加载状态的 视图
        renderFailStateView:PropTypes.func,//画 无数据 状态
        fetchApi:PropTypes.func,//外部 container 决定 调哪个api 获取数据
        containerStyle: View.propTypes.style,//拿到数据后,fetchOk 状态的 容器样式
    };

    static defaultProps = {
        // items: [],
        renderItem: null,
        containerStyle: undefined,
        renderLoadingStateView:()=>{},
        renderFailStateView:()=>{},
        fetchApi:()=>{}
    };

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        // this.props.dispatch(this.props.fetchApi());
        // this.props.fetchApi();


    }

    fetchData(){
        this.props.dispatch(this.props.fetchApi());
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        Log.log('BaseGridView render()')
        const {renderItem, containerStyle,renderLoadingStateView,renderFailStateView}=this.props;
        const {state, dataArray}=this.props.baseReducer;

        let content = null;

        switch (state) {
            case BaseGridViewActions.BaseGridViewStates.Loading: {
                content=renderLoadingStateView();
            }
                break;

            case BaseGridViewActions.BaseGridViewStates.fetchOk: {
                content=dataArray.map((model) => {
                    return renderItem(model);
                });
            }
                break;

            case BaseGridViewActions.BaseGridViewStates.fetchFail: {
                content=renderFailStateView();

            }
                break;
        }


        return (
            //画容器
            <View style={[styles.container, containerStyle]}>
                {content}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {//最大的容器 默认
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    }
});


