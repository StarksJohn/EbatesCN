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
import *as _Math from '../../Utils/Math'
// export const UpdateTabUnderlineWidthEventName = 'updateTabUnderlineWidthEventName';//任何地方都可发送的 获取 当前 横线所在tabbar的 Text 控件的 宽高信息的 事件名字
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
        this.UnderlineW = 0; //@cham 下横线 移动到新的 tabbar 区域后, 只要 curTabIndex 改变,UnderlineW 就根据新的 Text 控件 重新计算
        this.UnderlineLeft = 0;
        this.preValue = 0;//记录 此控件的 父控件 ScrollableTabView 的 onScroll 回调函数里返回的 上次 的 value
        this.isNeedUpdataCurTabIndex=true;//点击 另一个 tabbar时 ,不需要再 调 updataCurTabIndex 函数 给 this.curTabIndex 赋值, 直接赋值
        return {
            _leftTabUnderline: new Animated.Value(0),
            _widthTabUnderline: new Animated.Value(0),
            _containerWidth: null,
        };
    },

    componentDidMount() {
        this.props.scrollValue.addListener(this.updateView);//监听 ScrollableTabView 的 scrollValue
        // this.updateTabUnderlineWidth();
        // window.setTimeout(this.updateTabUnderlineWidth, 1);//延迟一毫秒执行tempfuc

        // this.updateTabUnderlineWidthEventListener = new EventListener({
        //     eventName: UpdateTabUnderlineWidthEventName, eventCallback: ()=> {
        //         Log.log('BizSearchResultPagScrollableTabBar eventCallback updateTabUnderlineWidth()执行')
        //         this.updateTabUnderlineWidth();
        //     }
        // });
    },
    componentWillUnmount() {
        // if (this.updateTabUnderlineWidthEventListener) {
        //     this.updateTabUnderlineWidthEventListener.removeEventListener();
        // }
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

            // Log.log('BizSearchResultPagScrollableTabBar updateView  updateTabUnderline 随着 滚动 一直  执行 ')

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

    /**
     * @cham 下横线 移动到新的 tabbar 区域后, 只要 curTabIndex 改变,UnderlineW 就根据新的 Text 控件 重新计算, 不能在 横线 的 移动中 一直 调 measure 方法,否则 安卓真机卡
     */
    updateTabUnderlineWidth(){
        // Log.log('BizSearchResultPagScrollableTabBar updateTabUnderlineWidth begin')

        this.refs[this.props.customRefs[this.curTabIndex]]/*@cham 根据 curTabIndex 拿到 refs 里的 text 控件,计算 其 宽度*/.measure((fx, fy, width, height, px, py)=> {
            this.UnderlineW = width;//@cham
            this.UnderlineLeft = px;
            // Log.log('BizSearchResultPagScrollableTabBar updateTabUnderlineWidth done width='+width)

            // this.state._leftTabUnderline.setValue(/*lineLeft*/ px);
            this.state._widthTabUnderline.setValue(/*newLineRight - newLineLeft*/ width);

        })
    },

    /**
     * 更新 curTabIndex
     * @param value
     */
    updataCurTabIndex(value){
        if (!this.isNeedUpdataCurTabIndex){
            Log.log('BizSearchResultPagScrollableTabBar updataCurTabIndex return ')
            return ;
        }

        if (Math.abs(value - this.preValue) > 0.1  ) {//暂时定 0.1, 越小月卡, 越大可能出现左右滚动或 快速 点击切换 tabbar时, 横线位置不对

            // Log.log('SearchResultPage onScroll value ==' + value+ '  preValue='+this.preValue);

            let i = _Math.Math_parseInt((value + 0.5) % this.props.customRefs.length);// 根据哪个 BizSearchResultPagScrollableTabBar.tabbar.Text 控件的宽 计算 横线的 宽, 比下边的 if else 快捷
            // if (value<0.5){
            //     i=0;
            // }else if(value>0.5&&value<1.5){
            //     i=1;
            // } else if(value>1.5 && value<2.5){
            //     i=2
            // } else if( value>2.5){
            //     i=3
            // }
            // Log.log('SearchResultPage onScroll i=='+i);

            if (this.curTabIndex != i) {
                this.curTabIndex = i;
                this.updateTabUnderlineWidth();
                Log.log('BizSearchResultPagScrollableTabBar updataCurTabIndex curTabIndex =='+i);

            }
        }

        this.preValue=value;
    },

    /**
     * 横线左右移动时一直回调
     * @param position
     * @param pageOffset
     * @param tabCount
     */
    updateTabUnderline(position, pageOffset, tabCount) {
        const lineLeft = this._tabsMeasurements[position].left;
        // const lineRight = this._tabsMeasurements[position].right;

        //@cham 为了 Ebates 中国 项目 ,改了此处的 源码 start
        let UnderlineW = this.UnderlineW
        let UnderlineLeft = lineLeft;

        if (position < tabCount - 1) {

            const nextTabLeft = this._tabsMeasurements[position + 1].left;//下次要移动到的 按钮的 left
            // const nextTabRight = this._tabsMeasurements[position + 1].right;

            const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
            // const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

            this.state._leftTabUnderline.setValue(newLineLeft + 20 /*@cham 按钮的 宽总比 其 里边的Text 宽 40 */);
            this.state._widthTabUnderline.setValue(/*newLineRight - newLineLeft*/ UnderlineW);

            // Log.log('BizSearchResultPagScrollableTabBar updateTabUnderline  (position < tabCount - 1) curTabIndex==' + this.curTabIndex + '   newLineLeft==' + newLineLeft + '  UnderlineW=' + UnderlineW);

        } else {
            UnderlineLeft = this.UnderlineLeft//px;

            this.state._leftTabUnderline.setValue(/*lineLeft*/ UnderlineLeft);
            this.state._widthTabUnderline.setValue(/*lineRight - lineLeft*/ UnderlineW /*@cham 按钮的 宽总比 其 里边的Text 宽 40 */);
            // Log.log('BizSearchResultPagScrollableTabBar updateTabUnderline  curTabIndex==' + this.curTabIndex + '  UnderlineLeft==' + UnderlineLeft + '   UnderlineW==' + UnderlineW);

        }

        {
            /*this.refs.merchent*/
            /*@cham 根据 curTabIndex 拿到 refs 里的 text 控件,计算 其 宽度*/
            {/*this.refs[this.props.customRefs[this.curTabIndex]].measure((fx, fy, width, height, px, py)=> {*/
            }
            {/*UnderlineW = width;//@cham*/
            }

            {/*// Log.log('BizSearchResultPagScrollableTabBar updateTabUnderline curTabIndex=='+this.curTabIndex)*/
            }

            {/*if (position < tabCount - 1) {*/
            }

            //         const nextTabLeft = this._tabsMeasurements[position + 1].left;//下次要移动到的 按钮的 left
            //         // const nextTabRight = this._tabsMeasurements[position + 1].right;
            //
            //         const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
            //         // const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);
            //
            //         this.state._leftTabUnderline.setValue(newLineLeft + 20 /*@cham 按钮的 宽总比 其 里边的Text 宽 40 */);
            //         this.state._widthTabUnderline.setValue(/*newLineRight - newLineLeft*/ UnderlineW);
            //
            //         Log.log('BizSearchResultPagScrollableTabBar updateTabUnderline  (position < tabCount - 1) curTabIndex==' + this.curTabIndex + '   newLineLeft==' + newLineLeft + '  UnderlineW=' + UnderlineW);
            //
            //     } else {
            //         UnderlineLeft = px;
            //
            //         this.state._leftTabUnderline.setValue(/*lineLeft*/ UnderlineLeft);
            //         this.state._widthTabUnderline.setValue(/*lineRight - lineLeft*/ UnderlineW /*@cham 按钮的 宽总比 其 里边的Text 宽 40 */);
            //         Log.log('BizSearchResultPagScrollableTabBar updateTabUnderline  curTabIndex==' + this.curTabIndex + '  UnderlineLeft==' + UnderlineLeft + '   UnderlineW==' + UnderlineW);
            //
            //     }
            // })
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
                //@cham
                if (this.curTabIndex != page) {
                    this.curTabIndex = page;
                    this.isNeedUpdataCurTabIndex=false;
                    this.updateTabUnderlineWidth();

                }
                {/*Log.log('BizSearchResultPagScrollableTabBar renderTabOption onPress page=='+page);*/
                }
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

    /**
     * 每次重绘Text前都回调
     * @param page
     * @param event
     */
    measureTab(page, event) {
        const {x, width, height,} = event.nativeEvent.layout;
        this._tabsMeasurements[page] = {left: x, right: x + width, width, height,};

        // Log.log('BizSearchResultPagScrollableTabBar measureTab updateView  很少执行')

        this.updateTabUnderlineWidth();
        this.updateView({value: this.props.scrollValue._value,});
    },

    render() {
        // Log.log('BizSearchResultPagScrollableTabBar render()');
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
        // Log.log('BizSearchResultPagScrollableTabBar onTabContainerLayout updateView 很少执行 ')

        // this.updateTabUnderlineWidth();

        this.updateView({value: this.props.scrollValue._value,});
    },

    onContainerLayout(e) {
        this._containerMeasurements = e.nativeEvent.layout;

        // Log.log('BizSearchResultPagScrollableTabBar onContainerLayout updateView 很少执行 ')
        // this.updateTabUnderlineWidth();

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
