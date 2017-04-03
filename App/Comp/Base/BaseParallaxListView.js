/*
 通用的 带 视差效果的 listview 控件,
 */
import React, {Component, PropTypes} from 'react';
import {
    Dimensions,
    Image,
    ListView,
    PixelRatio,
    StyleSheet,
    Text,
    View,
    Platform,
} from 'react-native';
import Colors from '../../Utils/Colors'
import GlobalStyles from '../../Global/GlobalStyles'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import BaseListComp from './BaseListComp'
import *as CouponDetailPageApi from '../../NetWork/API/CouponDetailPageApi'


// export const PARALLAX_HEADER_HEIGHT = 350;//能下拉的视图的 headerView的高,下拉的view一般是 image
export const STICKY_HEADER_HEIGHT = GlobalStyles.statusBarAndNavBarH;//状态栏+导航栏
export const window = Dimensions.get('window');


export default class BaseParallaxListView extends Component {
    static propTypes = {
        renderRow: PropTypes.func.isRequired,
        backgroundColor: PropTypes.string,//顶部 header 的背景色
        stickyHeaderHeight: PropTypes.number,////如果 renderStickyHeader 设置了, 就不用画 nav 了 ,此stickyHeaderHeight 就是 renderStickyHeader 要画的高, 代替nav
        parallaxHeaderHeight: PropTypes.number,//视差图view的高度,在 renderStickyHeader 下边显示,看上去就在nav 下边
        backgroundSpeed: PropTypes.number,
        renderBackground: PropTypes.func,//画  parallax header 的 背景, 包括背景图和  其遮盖层
        renderForeground: PropTypes.func,//画 视差Img的 前景层,包括头像等
        renderStickyHeader: PropTypes.func, //画 替代 nav的控件,包括 title
        renderFixedHeader: PropTypes.func,//在 顶部 替代导航栏的 控件里 画一些固定的控件

    };

    static defaultProps = {
        backgroundColor: Colors.appUnifiedBackColor,
        stickyHeaderHeight: STICKY_HEADER_HEIGHT,
        parallaxHeaderHeight: 100,
        backgroundSpeed: 10,
        renderBackground: () => {
        },
        renderForeground: () => {
        },
        renderStickyHeader: () => {
        },
        renderFixedHeader: () => {
        },
        // ParallaxScrollView: () => {
        // }
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(CouponDetailPageApi.CouponDetailPageApi.fetchPageList(0));

    }

    render() {
        // const {} = this.props;

        return (
            <ListView
                style={{
                    flex: 1,
                    backgroundColor: 'red',
                    // margin:10
                }}
                dataSource={ this.props.baseReducer.dataSource }
                renderRow={
                    this.props.renderRow
                }
                renderScrollComponent={
                    (props) => (
                        <ParallaxScrollView
                            //onScroll={onScroll}
                            /*headerBackgroundColor="#333"*/
                            backgroundColor={this.props.backgroundColor}
                            stickyHeaderHeight={ this.props.stickyHeaderHeight }
                            parallaxHeaderHeight={ this.props.parallaxHeaderHeight }
                            backgroundSpeed={this.props.backgroundSpeed}

                            renderBackground={this.props.renderBackground}

                            renderForeground={this.props.renderForeground}

                            renderStickyHeader={this.props.renderStickyHeader}

                            renderFixedHeader={this.props.renderFixedHeader}

                        />

                    )

                }
                {...this.props }

            />

        );
    }
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'red',
//         // margin:10
//     },
// });