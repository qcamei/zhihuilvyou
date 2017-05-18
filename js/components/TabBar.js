/**
 * Created by wangdi on 4/11/16.
 */
'use strict';

import React, { Component } from 'react';
import { Text, StyleSheet, Image, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';
import HomeFragment from '../pages/vippages/HomeFragment';
import MineFragment from '../pages/vippages/MineFragment'
import FriendAndChat from '../pages/vippages/FriendAndChat'
//import CompassFragment from '../page/CompassFragment';
//import MeFragment from '../page/MeFragment';
//import NotifyFragment from '../page/NotificationFragment';
import px2dp from '../utils/px2dp';
import indexIcon from '../imgs/new_icons/index@2x.png';
import s_indexIcon from '../imgs/new_icons/s_index@2x.png'
import findIcon from '../imgs/new_icons/find@2x.png'
import s_findIcon from '../imgs/new_icons/s_find@2x.png'
import friendIcon from '../imgs/new_icons/friend@2x.png'
import s_friendIcon from '../imgs/new_icons/s_friend@2x.png'
import myIcon from '../imgs/new_icons/my@2x.png'
import s_myIcon from '../imgs/new_icons/s_my@2x.png'
import { scaleSize } from '../ScreenUtils'

export default class TabBar extends Component
{
    static defaultProps = {
        selectedColor: 'rgb(22,131,251)',
        normalColor: '#a9a9a9'
    };

    constructor(props)
    {
        super(props);
        this.state = {
            selectedTab: 'home',
            tabName: ['首页', '发现', '星记', '我的']
        }
    }

    render()
    {
        const {selectedColor} = this.props;
        const {tabName} = this.state;
        return (
            <TabNavigator
                hidesTabTouch={true}
                tabBarStyle={styles.tabbar}
                sceneStyle={{ paddingBottom: styles.tabbar.height }}>
                <TabNavigator.Item
                    tabStyle={styles.tabStyle}
                    title={tabName[0]}
                    selected={this.state.selectedTab === 'home'}
                    selectedTitleStyle={{ color: selectedColor }}
                    renderIcon={() => <Image style={styles.tab} source={this.state.homeNormal} />}
                    renderSelectedIcon={() => <Image style={styles.tab} source={this.state.homeSelected} />}
                    onPress={() => this.setState({ selectedTab: 'home' })}>
                    {<HomeFragment navigator={this.props.navigator} />}
                </TabNavigator.Item>
                <TabNavigator.Item
                    tabStyle={styles.tabStyle}
                    title={tabName[1]}
                    selected={this.state.selectedTab === 'compass'}
                    selectedTitleStyle={{ color: selectedColor }}
                    renderIcon={() => <Image style={styles.tab} source={this.state.compassNormal} />}
                    renderSelectedIcon={() => <Image style={styles.tab} source={this.state.compassSelected} />}
                    onPress={() => this.setState({ selectedTab: 'compass' })}>
                    {<View />}
                </TabNavigator.Item>
                <TabNavigator.Item
                    tabStyle={styles.tabStyle}
                    title={tabName[2]}
                    selected={this.state.selectedTab === 'notification'}
                    selectedTitleStyle={{ color: selectedColor }}
                    renderIcon={() => <Image style={styles.tab} source={this.state.notificationNormal} />}
                    renderSelectedIcon={() => <Image style={styles.tab} source={this.state.notificationSelected} />}
                    onPress={() => this.setState({ selectedTab: 'notification' })}>
                    {<FriendAndChat navigator={this.props.navigator} />}
                </TabNavigator.Item>
                <TabNavigator.Item
                    tabStyle={styles.tabStyle}
                    title={tabName[3]}
                    selected={this.state.selectedTab === 'me'}
                    selectedTitleStyle={{ color: selectedColor }}
                    renderIcon={() => <Image style={styles.tab} source={this.state.meNormal} />}
                    renderSelectedIcon={() => <Image style={styles.tab} source={this.state.meSelected} />}
                    onPress={() => this.setState({ selectedTab: 'me' })}>
                    {<MineFragment navigator={this.props.navigator} />}
                </TabNavigator.Item>
            </TabNavigator>
        );
    }

    componentWillMount()
    {
        const {selectedColor, normalColor} = this.props;
        Icon.getImageSource('md-notifications', scaleSize(100), normalColor).then((source) => this.setState({ notificationNormal: friendIcon }));
        Icon.getImageSource('md-notifications', scaleSize(100), selectedColor).then((source) => this.setState({ notificationSelected: s_friendIcon }));
        Icon.getImageSource('md-home', scaleSize(100), normalColor).then((source) => this.setState({ homeNormal: indexIcon }));
        Icon.getImageSource('md-home', scaleSize(100), selectedColor).then((source) => this.setState({ homeSelected: s_indexIcon }));
        Icon.getImageSource('md-person', scaleSize(100), normalColor).then((source) => this.setState({ meNormal: myIcon }));
        Icon.getImageSource('md-person', scaleSize(100), selectedColor).then((source) => this.setState({ meSelected: s_myIcon }));
        Icon.getImageSource('md-compass', scaleSize(100), normalColor).then((source) => this.setState({ compassNormal: findIcon }));
        Icon.getImageSource('md-compass', scaleSize(100), selectedColor).then((source) => this.setState({ compassSelected: s_findIcon }));
    }
}

const styles = StyleSheet.create({
    tabbar: {
        height: scaleSize(108),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    tabStyle: {
        padding: scaleSize(10)
    },
    tab: {
        width: scaleSize(50),
        height: scaleSize(50)
    }
});