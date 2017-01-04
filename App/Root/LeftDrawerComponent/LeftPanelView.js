import React, {Component} from 'react';
import {
    SwitchIOS,
    View,
    Text
} from 'react-native';
import BaseTitleBt from '../../Comp/Base/BaseTitleBt'
import Colors from '../../Utils/Colors'


//左图
export default class LeftPanelView extends Component {

    onBtSelect() {
        showToast('onBtSelect  type==');
        // switch (type) {
        //
        // }
    }

    render() {
        return (
            <View style={{
                marginTop: 20, justifyContent: 'center', marginRight: 15, alignItems: 'center',
                backgroundColor: Colors.getRandomColor()
            }}>
                <BaseTitleBt
                    btStyle={[{
                        borderRadius: 4,
                        height: 44,
                        alignItems: 'center',
                        marginLeft: 15,
                        marginRight: 15,
                        justifyContent: 'center',
                        backgroundColor: Colors.getRandomColor(),
                        marginTop: 15
                    }]}
                    onPress={()=>this.onBtSelect()}
                    textStyle={{
                        fontSize: 15,
                        color: Colors.white,
                    }}
                    title='首页'
                    disabled={false}
                >
                </BaseTitleBt>

                <BaseTitleBt
                    btStyle={[{
                        borderRadius: 4,
                        height: 44,
                        alignItems: 'center',
                        marginLeft: 15,
                        marginRight: 15,
                        justifyContent: 'center',
                        backgroundColor: Colors.getRandomColor(),
                        marginTop: 15
                    }]}
                    onPress={()=>this.onBtSelect()}
                    textStyle={{
                        fontSize: 15,
                        color: Colors.white,
                    }}
                    title='推荐好友'
                    disabled={false}
                >
                </BaseTitleBt>
            </View>

        )
    }
}
