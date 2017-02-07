/**
 * 根据 Ebates 中国 项目的 UI 需求, 改的 react-native-scrollable-tab-view 库 的 ScrollableTabBar 文件的代码
 * 用于 搜索结果页的 左右滚动 tabbar
 */

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Animated,
    StyleSheet,
    ScrollView,
    Text,
    Platform,
    Dimensions,
} = ReactNative;
import Button from 'react-native-scrollable-tab-view/Button'//用 react-native-scrollable-tab-view 的 Button 组件
import *as BizViews from './BizViews'

const WINDOW_WIDTH = Dimensions.get('window').width;

const BizSearchResultPagScrollableTabBar = React.createClass({
    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
        underlineColor: React.PropTypes.string,
        underlineHeight: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        activeTextColor: React.PropTypes.string,
        inactiveTextColor: React.PropTypes.string,
        scrollOffset: React.PropTypes.number,
        style: View.propTypes.style,
        tabStyle: View.propTypes.style,
        tabsContainerStyle: View.propTypes.style,
        textStyle: Text.propTypes.style,
        renderTabName: React.PropTypes.func,
        underLineBottom: React.PropTypes.number,
        customRefs: React.PropTypes.array,//@cham 装 renderTabName 方法里 不同 Text 控件的ref, 因 Text 控件的宽 可能不一样,每次 切换 tab,
        // 都得重新计算底部 横线的宽
    },

    getDefaultProps() {
        return {
            scrollOffset: 52,
            activeTextColor: 'navy',
            inactiveTextColor: 'black',
            underlineColor: 'navy',
            backgroundColor: null,
            underlineHeight: 4,
            style: {},
            tabStyle: {},
            tabsContainerStyle: {},
            renderTabName: this.renderTabName,
            underLineBottom: 0,
        };
    },

    getInitialState() {
        this._tabsMeasurements = [];
        this.curTabIndex = 0;//@cham 当前 选中的 下标,用于 计算 2个 tab的 text 控件 内容不一样宽时, 每次 切换 tab前,都得重新计算 下横线的 宽

        return {
            _leftTabUnderline: new Animated.Value(0),
            _widthTabUnderline: new Animated.Value(0),
            _containerWidth: null,
        };
    },

    componentDidMount() {
        this.props.scrollValue.addListener(this.updateView);
    },

    updateView(offset) {
        const position = Math.floor(offset.value);
        const pageOffset = offset.value % 1;
        const tabCount = this.props.tabs.length;
        const lastTabPosition = tabCount - 1;

        if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
            return;
        }

        if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
            this.updateTabPanel(position, pageOffset);
            this.updateTabUnderline(position, pageOffset, tabCount);
        }
    },

    necessarilyMeasurementsCompleted(position, isLastTab) {
        return this._tabsMeasurements[position] &&
            (isLastTab || this._tabsMeasurements[position + 1]) &&
            this._tabContainerMeasurements &&
            this._containerMeasurements;
    },

    updateTabPanel(position, pageOffset) {
        const containerWidth = this._containerMeasurements.width;
        const tabWidth = this._tabsMeasurements[position].width;
        const nextTabMeasurements = this._tabsMeasurements[position + 1];
        const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
        const tabOffset = this._tabsMeasurements[position].left;
        const absolutePageOffset = pageOffset * tabWidth;
        let newScrollX = tabOffset + absolutePageOffset;

        // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
        newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
        newScrollX = newScrollX >= 0 ? newScrollX : 0;

        if (Platform.OS === 'android') {
            this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false,});
        } else {
            const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
            newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
            this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false,});
        }

    },

    updateTabUnderline(position, pageOffset, tabCount) {
        const lineLeft = this._tabsMeasurements[position].left;
        const lineRight = this._tabsMeasurements[position].right;

        //@cham 为了 Ebates 中国 项目 ,改了此处的 源码 start
        let UnderlineW = 0
        let UnderlineLeft = lineLeft;

        {
            /*this.refs.merchent*/
            this.refs[this.props.customRefs[this.curTabIndex]]/*@cham 根据 curTabIndex 拿到 refs 里的 text 控件,计算 其 宽度*/.measure((fx, fy, width, height, px, py)=> {
                UnderlineW = width;//@cham

                // Log.log('BizSearchResultPagScrollableTabBar updateTabUnderline curTabIndex=='+this.curTabIndex)

                if (position < tabCount - 1) {

                    const nextTabLeft = this._tabsMeasurements[position + 1].left;//下次要移动到的 按钮的 left
                    const nextTabRight = this._tabsMeasurements[position + 1].right;

                    const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
                    const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

                    this.state._leftTabUnderline.setValue(newLineLeft + 20 /*@cham 按钮的 宽总比 其 里边的Text 宽 40 */);
                    this.state._widthTabUnderline.setValue(/*newLineRight - newLineLeft*/ UnderlineW);

                    // Log.log('BizSearchResultPagScrollableTabBar updateTabUnderline  (position < tabCount - 1) curTabIndex=='+this.curTabIndex)

                } else {
                    UnderlineLeft = px;

                    this.state._leftTabUnderline.setValue(/*lineLeft*/ UnderlineLeft);
                    this.state._widthTabUnderline.setValue(/*lineRight - lineLeft*/ UnderlineW /*@cham 按钮的 宽总比 其 里边的Text 宽 40 */);
                    // Log.log('BizSearchResultPagScrollableTabBar updateTabUnderline  curTabIndex=='+this.curTabIndex)

                }
            })
        }
    },

    renderTabOption(name, page) {
        const isTabActive = this.props.activeTab === page;

        return <Button
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => /*this.props.goToPage(page)*/ {
                {/*this.curTabIndex = page;//@cham*/}
                {/*Log.log('BizSearchResultPagScrollableTabBar renderTabOption onPress page=='+page);*/}
                this.props.goToPage(page);
            }}
            onLayout={this.measureTab.bind(this, page)}
        >
            {this.renderTabName(name, page, isTabActive)}
        </Button>;
    },

    renderTabName(name, page, isTabActive) {
        const {activeTextColor, inactiveTextColor, textStyle,} = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'normal' : 'normal';

        return <View style={[styles.tab, this.props.tabStyle,]}>
            <Text /*@cham*/ ref={this.props.customRefs[page]} style={[{color: textColor, fontWeight,}, textStyle,]}>
                {name}
            </Text>
        </View>;
    },

    measureTab(page, event) {
        const {x, width, height,} = event.nativeEvent.layout;
        this._tabsMeasurements[page] = {left: x, right: x + width, width, height,};
        this.updateView({value: this.props.scrollValue._value,});
    },

    _onMomentumScrollEnd(e) {
        Log.log('ScrollableTabView _onMomentumScrollBeginAndEnd e=' + e);
        const offsetX = e.nativeEvent.contentOffset.x;
        const page = Math.round(offsetX / this.state.containerWidth);
        // if (this.state.currentPage !== page) {
        //     this._updateSelectedPage(page);
        // }
    },

    render() {
        const tabUnderlineStyle = {
            position: 'absolute',
            height: this.props.underlineHeight,
            backgroundColor: this.props.underlineColor,
            bottom: this.props.underLineBottom,
        };

        const dynamicTabUnderline = {
            left: this.state._leftTabUnderline,
            width: this.state._widthTabUnderline,
        };

        return <View
            style={[styles.container, {backgroundColor: this.props.backgroundColor,}, this.props.style,]}
            onLayout={this.onContainerLayout}
        >
            <ScrollView
                ref={(scrollView) => {
                    this._scrollView = scrollView;
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                directionalLockEnabled={true}
                bounces={false}
                scrollsToTop={false}
                onMomentumScrollEnd={this._onMomentumScrollEnd}
            >
                <View style={{flex: 1}}>
                    <View
                        style={[styles.tabs, {width: this.state._containerWidth,}, this.props.tabsContainerStyle,]}
                        ref={'tabContainer'}
                        onLayout={this.onTabContainerLayout}
                    >
                        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                        <Animated.View style={[tabUnderlineStyle, dynamicTabUnderline,]}/>
                    </View>
                    {BizViews.renderShadowLine({bottom: 0.5})}
                </View>


            </ScrollView>
        </View>;
    },

    onTabContainerLayout(e) {
        this._tabContainerMeasurements = e.nativeEvent.layout;
        let width = this._tabContainerMeasurements.width;
        if (width < WINDOW_WIDTH) {
            width = WINDOW_WIDTH;
        }
        this.setState({_containerWidth: width,});
        this.updateView({value: this.props.scrollValue._value,});
    },

    onContainerLayout(e) {
        this._containerMeasurements = e.nativeEvent.layout;
        this.updateView({value: this.props.scrollValue._value,});
    },
});

module.exports = BizSearchResultPagScrollableTabBar;

const styles = StyleSheet.create({
    tab: {
        height: 49,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    container: {
        height: 50,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: '#ccc',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
