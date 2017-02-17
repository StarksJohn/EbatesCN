/**
 * Created by Ebates on 17/2/17.
 * MerchantPageListComp 商家页列表
 */
import React, {Component} from 'react';
import {
    View, Text, Image
} from 'react-native';
import Colors from '../../Utils/Colors'
import BaseListComp from '../Base/BaseListComp';
import BaseBt from '../Base/BaseBt'
import GlobalStyles from '../../Global/GlobalStyles'
import BaseGridView from '../Base/BaseGridView'

export default class MerchantPageListComp extends Component {
    constructor(props) {
        super(props);
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        if (rowID == 0) {

            return (
                <BaseGridView
                    items={Array.from(rowData)}//数组元素是 {img:'',title:''}
                    containerStyle={{
                        paddingLeft: 25,
                        paddingRight: 25, paddingTop: 15, paddingBottom: 15,
                        backgroundColor: Colors.white
                    }}
                    renderItem={(model/*此处的model是 {img:'',title:''} 结构*/) => {
                        return (
                            <BaseBt
                                style={ {
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    width: (GlobalStyles.window.width - 50 ) / 4,
                                    height: (200 - 30 ) / 2,
                                    //backgroundColor: Colors.getRandomColor()
                                }}
                                activeOpacity={0.6}
                                disabled={false}
                                onPress={ () => {
                                    //callback(rowData);
                                } }
                            >
                                <Image source={model.img} style={{width: 55, height: 55, alignSelf: 'center'}}/>
                                <Text style={{
                                    marginLeft: 0, marginTop: 10, fontSize: 13, color: '#404040', alignSelf: 'center',
                                    //backgroundColor: Colors.getRandomColor()
                                }} numberOfLines={1} textAlign="center"
                                >{model.title}</Text>
                            </ BaseBt >
                        );
                    }}
                />
            );
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    renderRow={
                        this.renderRow
                    }

                />
            </View>

        );
    }
}