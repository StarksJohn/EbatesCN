/**
 * Created by Ebates on 17/1/4.
 *
 * 跟组件
 */
import React, {Component} from 'react';
import {} from 'react-native';
import RootNavigator from './RootNavigator'
import LeftDrawerComponent from './LeftDrawerComponent/LeftDrawerComponent'

export default class RootComponent extends Component {

    render() {
        return (
            <LeftDrawerComponent
            >
                <RootNavigator
                />
            </LeftDrawerComponent>
        );
    }
}


