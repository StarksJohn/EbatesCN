/**
 * Created by Ebates on 17/3/9.
 * SearchPageGridViewContainer 在 搜索  页用的 网格控件的 数据源
 */
import React, {Component} from 'react';
import {
    View, Text, Image
} from 'react-native';
import {connect} from 'react-redux';
import BaseGridView from '../../Comp/Base/BaseGridView'
import *as BizApi from '../../NetWork/API/BizApi'
import Colors from '../../Utils/Colors'
import Spinner from 'react-native-spinkit'
import BaseTitleBt from '../../Comp/Base/BaseTitleBt'
import *as GlobalStyles from '../../Global/GlobalStyles'


class SearchPageGridViewContainer extends React.Component {



    render() {
        return (
            <BaseGridView {...this.props}
                          ref={(r) => {
                              this.BaseGridViewRef = r;
                          }}
                          fetchApi={() => {
                              return (dispatch) => {
                                  dispatch(BizApi.SearchPageListApi.fetchHotSearchBtData())
                              }
                          }}
                          containerStyle={{
                              paddingLeft: 10,
                              paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                              //backgroundColor: Colors.getRandomColor()
                          }}

            />
        );
    }
}

function mapStateToProps(state) {
    //推荐此种  解构赋值的写法
    const {SearchPageGridViewReducer}=state;
    return {baseReducer: SearchPageGridViewReducer};

}
export default connect(mapStateToProps)(SearchPageGridViewContainer);