/**
 商家 列表,可能在 搜索结果页 画,也可能 在 商家页 画
 */

import React, {Component, PropTypes} from 'react';
import {
    View, Text, Image
} from 'react-native';
import BaseListComp from '../Base/BaseListComp';
import Colors from '../../Utils/Colors'
import *as BizViews from '../BizCommonComp/BizViews'
import *as Math from '../../Utils/Math'


export default class MerchantListComp extends Component {

    static propTypes = {
        renderNoDataView: PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Image.getSize('http://mmbiz.qpic.cn/mmbiz/z7kZjMoQ3yF06A6zTMZbI4Fp35KtDtTSNBD9Ysfjmb3ePlicYNPHJic8LQaYDbU5Y8fx3dBRb2AKuD2KTbG4QxZA/0?wx_fmt=jpeg', (width, height) => {
            Log.log('MerchantListComp componentDidMount width==' + width + '  height==' + height);
        });
    }

    /**
     * 当前控件的cell的自定义绘制
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param highlightRow
     * @returns {XML}
     */
    renderRow = (rowData, sectionID, rowID, highlightRow)=> {

        Log.log('MerchantListComp rowID==' + rowID);
        // let str='rowID  '+rowID;

        return (
            <View style={{
                flex: 1,
                backgroundColor: Colors.getRandomColor()
            }}>
                {/*横线上边的view*/}
                <View style={{
                    flexDirection: 'row', backgroundColor: Colors.getRandomColor()
                }}>
                    {/*用 www.ebates.com 里的logo,如 https://www.ebates.com/merchant_images/large/icon_ashford.gif ,宽高和美工约定好了*/}
                    <Image source={ {uri: 'https://www.ebates.com/merchant_images/large/icon_ashford.gif'}} style={{
                        width: 140, height: 30, alignSelf: 'center'/*logo 在 顶部到 分割线 之间 上下居中*/,
                        backgroundColor: Colors.getRandomColor()
                    }}/>
                    {/*右边 的title等*/}
                    <View style={{
                        height: Math.randomNums(30,100), backgroundColor: Colors.getRandomColor()
                    }}>

                    </View>

                </View>
                {/*横线*/}
                {BizViews.baseSpeLine({marginLeft: 15, marginRight: 15})}
                {/*横线下边的view*/}
                <View style={{
                    height: 30, backgroundColor: Colors.getRandomColor()
                }}>

                </View>
            </View>

            //     <Image source={require('../../Img/common_icon_logo.png')} style={{marginTop: 20}}/>
            // <Text style={{
            //     marginTop: 10, fontSize: 18, fontWeight: 'bold', color: 'rgba(255, 115,' +
            //     ' 12, 1)',
            //     //backgroundColor:Colors.getRandomColor()
            // }}>最好的海淘返利网站</Text>
            // <Text style={{marginTop: 3, fontSize: 12, color: 'rgba(136, 136, 136, 1)'}}>{str}</Text>
        );

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    initialListSize={5}
                    scrollRenderAheadDistance={300}
                    renderRow={
                        this.renderRow
                    }
                    renderNoDataView={(props) => {
                        return this.props.renderNoDataView(props);
                    }
                    }
                />
            </View>

        );
    }

}