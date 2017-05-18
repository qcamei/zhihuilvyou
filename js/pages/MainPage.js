/**
 * Created by os on 17/4/14.
 */
import React, {Component} from 'react';
import {Text, View, BackAndroid, ToastAndroid} from 'react-native';
import TabBar from '../components/TabBar';

export default class MainScene extends  React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }

    render(){
        return(
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <TabBar navigator={this.props.navigator}/>
            </View>
        );
    }
}