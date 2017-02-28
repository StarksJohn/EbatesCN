/**
 * Created by Ebates on 17/2/27.
 * BizFilterMenuView 全部商家页 的 筛选控件  的 menu 容器
 */
import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, Text, TextInput, Platform, Image} from 'react-native';
import {connect} from 'react-redux'
import Colors from '../../Utils/Colors'
import BaseGridView from '../Base/BaseGridView'
import BizFilterMenuBtView from './BizFilterMenuBtView'
import *as BizViews from './BizViews'

export class BizFilterMenuView extends Component {
    static propTypes = {
        onItemPress: PropTypes.func,
    };
    static defaultProps = {
        onItemPress: (index) => {
        },
    };

    constructor(props) {
        super(props);
        this.BizFilterMenuBtViewRefArr = [];//装 BizFilterMenuBtView 控件的 ref
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    onItemPress(index) {
        if (this.props.onItemPress) {
            this.props.onItemPress(index);
        }

        this.BizFilterMenuBtViewRefArr.map((v, i) => {
            if (index != i) {//改变非 点击 按钮的 箭头方向
                v.chengeArrowDir(0);
            }
        });
    }

    render() {
        let dataArray = this.props.FilterMenuReducer.$dataArray.toJS();
        return (
            <BaseGridView
                items={Array.from(dataArray)}//数组元素是 {img:'',title:''}
                containerStyle={{
                    paddingLeft: 0, height: 44, paddingRight: 0, paddingTop: 0, paddingBottom: 0,
                    backgroundColor: Colors.white
                }}
                renderItem={(model/*此处的model类似是 {id:0,title:'母婴'}  结构*/) => {
                    return (
                        <View style={{
                            flex: 1, flexDirection: 'row', //alignItems:'center' ,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            <BizFilterMenuBtView
                                ref={(r) => {
                                    this.BizFilterMenuBtViewRefArr.push(r);
                                }}
                                model={model}
                                onItemPress={ (index) => {
                                    this.onItemPress(index);
                                } }
                            >
                            </ BizFilterMenuBtView >
                            {model.id != dataArray.length - 1 ? BizViews.renderVerticalLine({
                                    flex: 0,
                                    fontSize: 15,
                                    marginLeft: 0.5,
                                    alignSelf: 'center',
                                    lineHeight: 15
                                }) : null}
                        </View>
                    );
                }}
            />
        );
    }
}

function mapStateToProps(state) {

    // 把 state里的 homePageReducer 注入到 this.props里
    const {FilterMenuReducer}=state;
    return {FilterMenuReducer};
}

export default connect(mapStateToProps)(BizFilterMenuView)