/**
 * Created by Ebates on 17/3/9.
 * AllMerchantPageFilterListShipsMenuGridViewContainer  在 全部商家页 筛选下拉列表里 直邮方式API 显示的 MENU 网格控件的 数据源
 */
import React, {Component, PropTypes} from 'react';
import {
    View, Text, Image
} from 'react-native';
import {connect} from 'react-redux';
import BaseGridView from '../../Comp/Base/BaseGridView'
import *as BizApi from '../../NetWork/API/BizApi'
import Colors from '../../Utils/Colors'
import Spinner from 'react-native-spinkit'
import BaseTitleBt from '../../Comp/Base/BaseTitleBt'
import GlobalStyles from '../../Global/GlobalStyles'
import BaseBt from '../../Comp/Base/BaseBt'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
import BizFilterMenuBtView from '../../Comp/BizCommonComp/BizFilterMenuBtView'


export class AllMerchantPageFilterListShipsGridViewContainer extends React.Component {
    static propTypes = {
        onItemPress: PropTypes.func,
    };
    static defaultProps = {
        onItemPress: (key) => {
        },
    };

    constructor(props) {
        super(props);
        this.BizFilterMenuBtViewRefArr = [];//装 BizFilterMenuBtView 控件的 ref
    }

    onItemPress(model) {
        model.isSelect = !model.isSelect;

        if (this.props.onItemPress) {
            this.props.onItemPress(model.key);
        }
    }

    render() {
        const {baseReducer}=this.props;

        Log.log('AllMerchantPageFilterListShipsGridViewContainer  render()')

        return (
            <BaseGridView {...this.props}
                          ref={(r) => {
                              this.BaseGridViewRef = r;
                          }}
                          fetchApi={() => {
                              return (dispatch) => {
                                  dispatch(BizApi.AllMerchantPageFilterDropDownListApi.fetchShipsGridViewData())
                              }
                          }}
                          containerStyle={[{
                              marginTop: 5,
                              marginLeft: 10,
                              marginRight: 10,
                              paddingRight: 0,
                              paddingTop: 0,
                              paddingBottom: 0,
                              paddingLeft: 0,
                              //backgroundColor: Colors.getRandomColor()
                          }, this.props.containerStyle]}
                          renderItem={(model/*此处的model类似是  {
                           "name": "直邮中国",
                           "key": "direct_ship_to_CN"
                           }
                           结构*/) => {
                              Log.log('AllMerchantPageFilterListShipsGridViewContainer render renderItem model='+Log.writeObjToJson(model));
                              return (
                                  <BaseTitleBt
                                      key={model.name}
                                      isSelect={model.isSelect}
                                      renderChildren={
                                          (state) => {
                                              return state.isSelect ? <Image
                                                      source={ require('../../Img/common_filter_arrow_btn_selected.png') }
                                                      style={{
                                                          position: 'absolute', right: 0, bottom: 0,
                                                          width: 14, height: 14,
                                                          resizeMode: 'contain',
                                                      }}>
                                                  </Image> : null
                                          }
                                      }
                                      btStyle={[{
                                          width: (GlobalStyles.window.width - 30 - 20) / 3 - 0.1 /*减0.1是因为大屏上,/3后的值可能
                                           比 实际的值大, 避免 一行大屏 里 一行显示不下3个按钮*/,
                                          borderRadius: 4,
                                          margin: 5,
                                          height: 44,
                                          alignItems: 'center',
                                          borderColor: 'rgba(210, 210, 210, 1)',
                                          borderWidth: 0.5,
                                          justifyContent: 'center',
                                          backgroundColor: Colors.white,
                                      }]}
                                      selectBtStyle={{
                                          width: (GlobalStyles.window.width - 30 - 20) / 3 - 0.1 /*减0.1是因为大屏上,/3后的值可能
                                           比 实际的值大, 避免 一行大屏 里 一行显示不下3个按钮*/,
                                          borderRadius: 4,
                                          margin: 5,
                                          height: 44,
                                          alignItems: 'center',
                                          borderColor: Colors.appUnifiedBackColor,
                                          borderWidth: 0.5,
                                          justifyContent: 'center',
                                          backgroundColor: Colors.white,
                                      }}
                                      onPress={() => this.onItemPress(model)}
                                      textStyle={{
                                          fontSize: 13,
                                          color: 'rgba(64, 64, 64, 1)',
                                      }}
                                      selectTextStyle={
                                          {
                                              fontSize: 14 ? 14 : 13,
                                              color: 'rgba(54, 166, 66, 1)',
                                          }
                                      }
                                      title={model.name}
                                      disabled={false}
                                  >
                                  </BaseTitleBt>
                              );
                          }}

            />
        );
    }
}

function mapStateToProps(state) {
    //推荐此种  解构赋值的写法
    const {AllMerchantPageFilterListShipsGridViewReducer}=state;
    return {baseReducer: AllMerchantPageFilterListShipsGridViewReducer};

}
export default connect(mapStateToProps)(AllMerchantPageFilterListShipsGridViewContainer);