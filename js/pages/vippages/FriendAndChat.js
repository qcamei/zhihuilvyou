/**
 * Created by os on 17/4/20.
 */
import React from 'react';
import
{
    View,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    Navigator,
    Platform
} from 'react-native';
import { scaleSize } from '../../ScreenUtils'
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
let statusbarHeight = (Platform.OS === 'android' && Platform.Version <= 19) ? (Platform.OS === 'android' ? 0 : 0) : scaleSize(60);
export default class MineFragment extends React.Component
{
    // 构造

    render()
    {
        return (
            <ScrollableTabView
                renderTabBar={() => <DefaultTabBar />}
                ref={(tabView) => { this.tabView = tabView; } }

                tabBarUnderlineStyle={{
                    position: 'absolute',
                    width: scaleSize(90),
                    height: scaleSize(4),
                    backgroundColor: '#abde77',
                    bottom: 0,
                }}
                style={{ marginTop: statusbarHeight }}
                tabBarBackgroundColor='#FFFFFF'
                tabBarActiveTextColor='#abde77'
                tabBarInactiveTextColor='#585858' 
                textStyle={{ fontSize: scaleSize(32) }}
                >

                <PageOne tabLabel="旅行圈" />
                <Text tabLabel="聊天" />
            </ScrollableTabView>
        )
    }



}
class PageOne extends React.Component
{
    // 构造

    render()
    {


        return (
            <ScrollableTabView
                renderTabBar={() => <DefaultTabBar />}
                tabBarBackgroundColor='#FFFFFF'
                tabBarActiveTextColor='#abde77'
                tabBarInactiveTextColor='#585858'
                 
                >
                <Page1 tabLabel="全部" />
                <Page2 tabLabel="附近" />
                <Page3 tabLabel="关注" />
                <Page4 tabLabel="结伴" />
                <Page5 tabLabel="视频" />
                <Page6 tabLabel="游记" />
            </ScrollableTabView>
        )
    }
}