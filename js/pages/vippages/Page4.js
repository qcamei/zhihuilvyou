import React, { Component } from 'react';
import
{
    View,
    StyleSheet,
} from 'react-native';
export default class Page1 extends Component
{
    // 构造


    render()
    {
        // 不同的Page,需要修改下面的这个数组, 通过数组控制导航栏条目显示状态

        return (
            <View style={styles.container}>
                <View style={styles.whatLeft} />
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    whatLeft: {  // 组件定义了一个上边框
        flex: 1,
         
        backgroundColor: 'green' //每个界面背景颜色不一样
    }
});