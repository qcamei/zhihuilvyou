/**
 *主界面
 */
import React from 'react';
import
{
    StyleSheet,
    Text,
    TouchableOpacity,
    DrawerLayoutAndroid,
    Image,
    Platform,
    View,
    ScrollView,
    ListView,
    BackAndroid,
    ToastAndroid,
    InteractionManager,
    Alert,
} from 'react-native';

import AMapLocationManager from '../amap/AMapLocationManager';
import * as AudioManager from '../utils/AudioManager';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import DrawerLayout from 'react-native-drawer-layout';
import Map from './Map';
import HeadBar from '../components/HeadBar';
import DrawerView from "../components/DrawerView";
import webviewPage from './WebViewPage';
import scenic_info from './scenic_info';
import ProgressView from '../components/ProgressView'
import { isEqual, naviGoBack } from '../utils/CommonUtil';
import { wndWidth, drawerWidth,wndHeight } from '../Global'
import QR from '../group/Qrinfo'
const bw1 = require('../imgs/icons/biwan1.png');
const bw2 = require('../imgs/icons/biwan2.png');
import CodePush from 'react-native-code-push';
import * as WS from '../Net/webSocket';
//import * as AudioManager from "../utils/AudioManager"
const SCROLL_MAX_SIZE = 275;

class Main_1 extends React.Component
{
    constructor(props)
    {
        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        let ds2 = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        this.state = {
            ds: ds,
            ds_ac: ds2,
            sa_img: this.props.sa_info && this.props.sa_info.photoinfo && this.props.sa_info.photoinfo.length > 0 ? this.props.sa_info.photoinfo[0].img : "",
            need: false
        };
        //地图图片缓存
        if (this.props.sa_info && this.props.sa_info.overlay_img)
        {
            Image.prefetch(this.props.sa_info.overlay_img);
        }
    }
    /**点击drawer菜单的回调 */
    onPressDrawerItem(name)
    {
        this.drawer.closeDrawer();
    }
    codePushStatusDidChange(syncStatus)
    {
        // console.warn('syncStatus',syncStatus);
        let SyncStatus= {
            UP_TO_DATE: 0, // The running app is up-to-date
            UPDATE_INSTALLED: 1, // The app had an optional/mandatory update that was successfully downloaded and is about to be installed.
            UPDATE_IGNORED: 2, // The app had an optional update and the end-user chose to ignore it
            UNKNOWN_ERROR: 3,
            SYNC_IN_PROGRESS: 4, // There is an ongoing "sync" operation in progress.
            CHECKING_FOR_UPDATE: 5,
            AWAITING_USER_ACTION: 6,
            DOWNLOADING_PACKAGE: 7,
            INSTALLING_UPDATE: 8
        };
        switch (syncStatus)
        {
            case SyncStatus.DOWNLOADING_PACKAGE:
                // console.warn('Downloading',syncStatus);
                this.setState({ syncMessage: "Downloading package." });

                break;
            case SyncStatus.AWAITING_USER_ACTION:
                // console.warn('Awaiting',syncStatus);
                this.setState({ syncMessage: "Awaiting user action." });
                break;
            case SyncStatus.INSTALLING_UPDATE:
                // console.warn('INSTALL',syncStatus);
                this.rou.setState({ bShow: false });
                break;

        }
    }

    codePushDownloadDidProgress(progress)
    {
        // console.warn(1)
        this.rou.togglePr(true, progress)
    }





    renderItem_ac(rawData)
    {
        Image.prefetch(rawData.short_img);
        return (
            <TouchableOpacity onPress={() => this.openWebviewPage(rawData.art_id, rawData.art_title, 2)}>
                <View style={styles.containerItem}>
                    <Image
                        style={styles.itemImg}
                        source={{ uri: rawData.short_img }}
                        resizeMode={'stretch'} />
                    <Text style={{position:'absolute',right:10,bottom:5,color:'#FFFFFF',backgroundColor:'transparent',fontSize:17}}>这是景区标题</Text>
                </View >
            </TouchableOpacity>
        )
    }
    renderItem(rawData)
    {
        Image.prefetch(rawData.image);
        return (
            <TouchableOpacity onPress={() => this.openWebviewPage(rawData.pointid, rawData.name, 1)}>
                <View style={styles.containerItem}>
                    <Image
                        style={styles.itemImg}
                        source={{ uri: rawData.image }}
                         />
                    <Text style={{position:'absolute',right:10,bottom:5,color:'#FFFFFF',backgroundColor:'transparent',fontSize:17}}>这是景区标题</Text>
                </View >
            </TouchableOpacity>
        )
    }


    render()
    {
        let renderSpList = this.renderSpList.bind(this);
        let renderActivityList = this.renderActivityList.bind(this);
        let renderScenic = this.renderScenic.bind(this);
        const { navigator } = this.props;
        return (
            <View style={{ width:wndWidth,height: wndHeight }}>
                <ProgressView
                    ref={(ref) => { this.rou = ref; } }
                    onPressItem1={(a) => this.sync()} />

                <DrawerLayout style={{ width: wndWidth }}
                              ref={(ref) => { this.drawer = ref; } }
                              drawerWidth={drawerWidth}
                              drawerPosition={Platform.OS === 'android' ? DrawerLayoutAndroid.positions.Left : 'left'}
                              renderNavigationView={() => { return <DrawerView navigator={navigator} onPressDrawerItem={this.onPressDrawerItem.bind(this)} /> } }
                >
                    <View style={styles.container}>
                        <ScrollView onScroll={this._onScroll.bind(this)} scrollEventThrottle={5} bounces={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false}>
                            <IndicatorViewPager style={styles.headerPic} >
                                <View>
                                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, paddingBottom: 10 }}
                                                      onPress={() => this.props.scrollToMap()}>
                                        <Image source={{ uri: this.state.sa_img }} style={styles.image} resizeMode={'stretch'} />
                                        <View style={{ flex: 1, height: 60, width: wndWidth, position: 'absolute', bottom: 10, backgroundColor: `rgba(0,0,0,0.5)`, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={styles.btnEnterMap}>立即导览</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </IndicatorViewPager>
                            <View style={{height: 100,width:wndWidth,flexDirection:'row',backgroundColor:'#f0f8ff'}}>
                                <TouchableOpacity style={styles.clickBtn}>
                                    <Text style={{textAlign:'center'}}>我的游记</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.clickBtn}>
                                    <Text style={{textAlign:'center'}}>旅游圈</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.clickBtn}>
                                    <Text style={{textAlign:'center'}}>结伴游</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.myMapBtn}>
                                    <Text style={{textAlign:'center'}}>地图导览</Text>
                                </TouchableOpacity>
                            </View>
                            {renderScenic()}
                            {renderSpList()}
                            {renderActivityList()}
                        </ScrollView>
                    </View>
                    <HeadBar headStyle={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                             ref="titleBarComp"
                             leftIcon={require('../imgs/icons/menu1.png')}
                             rightIcon={require('../imgs/icons/menu3.png')}
                             leftIconStyle={{ width: 40, height: 40 }}
                             rightIconStyle={{ width: 40, height: 40 }}
                             headHeight={60}
                             bgColor={`rgba(156, 151, 139,0)`}
                             navigator={this.props.navigator}
                             leftClick={() => this.drawer.openDrawer()}
                             rightClick={() => this.qrcodeOpen()}
                    />
                </DrawerLayout>
            </View>
        );
    }

    qrcodeOpen()
    {
        this.props.navigator.push({ component: QR, name: "qrinfo1" })
    }
    // <TouchableOpacity style={{ flexDirection: 'row2', alignItems: 'center' }} onPress={() => this.enterScnicInfo()}>
    //           <Text style={{ fontSize: 17, color: '#272727', marginRight: 10 }}>景区介绍</Text>
    //           <Image source={bw2} style={{ height: 13, width: 7 }} resizeMode={'stretch'} />
    //         </TouchableOpacity>
    renderScenic()
    {
        return (
            <View>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 10, marginLeft: 12, marginRight: 12, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={bw1} style={{ height: 19, width: 3 }} resizeMode={'stretch'} />
                        <Text style={{ fontSize: 17, color: '#272727', marginLeft: 10 }}>景区介绍</Text>
                    </View>

                </View>
                <View style={{ flex: 1, height: 240 }}>
                    {
                        this.props.sa_info == null || this.props.sa_info.length <= 0 ? null :
                            <View style={{ marginLeft: 10, backgroundColor: "#f2f4f7", marginRight: 18 }}>
                                <TouchableOpacity onPress={() => this.enterScnicInfo()}>
                                    <View style={styles.containerItem}>
                                        <Image
                                            style={styles.itemImg}
                                            source={{ uri: this.props.sa_info.image }}
                                            resizeMode={'stretch'} />
                                        <Text style={{position:'absolute',right:10,bottom:5,color:'#FFFFFF',backgroundColor:'transparent',fontSize:17}}>{this.props.sa_info.name}</Text>
                                    </View >
                                </TouchableOpacity>
                            </View>

                    }
                </View>
            </View>
        )
    }
    renderSpList()
    {
        return (
            <View>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 10, marginLeft: 12, marginRight: 12, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={bw1} style={{ height: 19, width: 3 }} resizeMode={'stretch'} />
                        <Text style={{ fontSize: 17, color: '#272727', marginLeft: 10 }}>热门景区</Text>
                    </View>

                </View>
                <View style={{ flex: 1, height: 240 }}>
                    {
                        this.props.sp_article_list == null || this.props.sp_article_list.length <= 0 ? null :
                            <ListView
                                initialListSize={1}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                enableEmptySections={true}
                                dataSource={this.state.ds}
                                renderRow={this.renderItem.bind(this)}
                                style={{marginLeft: 10, backgroundColor: "#f2f4f7",width:wndWidth  }}>
                            </ListView>
                    }
                </View>
            </View>
        )
    }

    renderActivityList()
    {
        return (
            <View style={{ marginBottom: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Image source={bw1} style={{ height: 19, width: 3 }} resizeMode={'stretch'} />
                    <Text style={{ fontSize: 18, color: '#272727', marginLeft: 10 }}>主题推荐</Text>
                </View>
                <View style={{ flex: 1, height: 240 }}>
                    {
                        this.props.sa_activity_list == null || this.props.sa_activity_list.length <= 0 ? null :
                            <ListView
                                initialListSize={1}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                enableEmptySections={true}
                                dataSource={this.state.ds_ac}
                                renderRow={this.renderItem_ac.bind(this)}
                                style={{ marginLeft: 10, backgroundColor: "#f2f4f7",width:wndWidth  }}>
                            </ListView>
                    }
                </View>
            </View>

        )
    }

    //滑动的时候headBar栏颜色渐变效果及能滑动的最大距离
    _onScroll(event)
    {
        let offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > SCROLL_MAX_SIZE)
        {
            offsetY = SCROLL_MAX_SIZE;
        }
        let opacity = offsetY / SCROLL_MAX_SIZE;
        opacity = opacity > 0.8 ? 0.8 : opacity;
        this.refs.titleBarComp.setBgColor && this.refs.titleBarComp.setBgColor(`rgba(62, 156, 233, ${opacity})`);
    }
    //cate_id：0-景区 1-景点 2-活动
    openWebviewPage(spid, title, cate_id)
    {
        this.props.navigator.push({ component: webviewPage, name: "WebViewPage", params: { spid, title, cate_id } })
    }
    enterScnicInfo()
    {
        this.props.navigator.push({ component: scenic_info, name: "scenic_info" })
    }


    sync()
    {

    if (Platform.OS == 'android'){
        CodePush.sync(null, this.codePushStatusDidChange.bind(this),

            this.codePushDownloadDidProgress.bind(this),
            this.rou.setState({ download: true }));
    }

    }
    componentDidMount()
    {
        if (Platform.OS == 'android'){
            CodePush.checkForUpdate('CuPpIHqbo6M-F1NpBdxyGmNVATZ341mBqxc_G').then((update) =>
            {
                // console.warn("up", update)
                if (!update)
                {
                    // console.warn("dd", buyong)
                }
                else
                {
                    if (update.failedInstall) { this.rou.togglePr(false) }
                    else { this.rou.togglePr(true) }
                }
            });
        }

        InteractionManager.runAfterInteractions(() =>
        {
            this.updateArticleList(this.props.sp_article_list);
            this.updateActivityList(this.props.sa_activity_list);
        });
    }
    /**属性变化 */
    componentWillReceiveProps(nextProps)
    {
        if (nextProps.sp_article_list && !isEqual(nextProps.sp_article_list, this.props.sp_article_list))
        {
            this.updateArticleList(nextProps.sp_article_list);
        }
        if (nextProps.sa_activity_list && !isEqual(nextProps.sa_activity_list, this.props.sa_activity_list))
        {
            this.updateActivityList(nextProps.sa_activity_list);
        }
        if (nextProps.sa_info && nextProps.sa_info.photoinfo && nextProps.sa_info.photoinfo.length > 0 && !isEqual(nextProps.sa_info.photoinfo[0].img, this.state.sa_img))
        {
            this.setState({ "sa_img": nextProps.sa_info.photoinfo[0].img });
            Image.prefetch(nextProps.sa_info.photoinfo[0].img);
            /**地图贴图 */
            Image.prefetch(nextProps.sa_info.overlay_img);
        }
    }
    /**更新文章列表 */
    updateArticleList(articleList)
    {
        if (articleList == null)
            return;
        let will_play = [];
        for (let i = 0; i < articleList.length; i++)
        {
            if (articleList[i].isrecommond == 1)
            {
                will_play.push(articleList[i]);
            }
        }
        this.setState({ "ds": this.state.ds.cloneWithRows(will_play) });
    }
    /**更新活动列表 */
    updateActivityList(ac_list)
    {
        if (ac_list == null)
            return;
        this.setState({ "ds_ac": this.state.ds_ac.cloneWithRows(ac_list) })
    }
    shouldComponentUpdate(nextProps, nextState)
    {
        if (isEqual(nextState, this.state) && isEqual(nextProps.sa_info.sa_img, this.props.sa_info.sa_img) &&
            isEqual(nextProps.sp_article_list, this.props.sp_article_list) && isEqual(nextProps.sa_activity_list, this.props.sa_activity_list))
        {
            return false;
        }
        return true;
    }
}

function select(store)
{
    return {
        sa_info: store.scenicStore.sa_info,
        sp_article_list: store.scenicStore.sp_article_list,
        sa_activity_list: store.scenicStore.sa_activity_list
    }
}
let First = connect(select)(Main_1);


import { setShowGroupPosFun } from '../Global';
export default class Main extends React.Component
{
    constructor(props)
    {
        super(props);
        this.currShowPage = "first";
        this.state = {
            bMapOpen: false,
            isJumpFromTeamcenter: false,
        };
        setShowGroupPosFun(this.showGroupPos.bind(this));
    }
    render()
    {

        return (
            <ScrollView
                horizontal
                pagingEnabled
                automaticallyAdjustContentInsets={false}
                ref={(ref) => { this.scrollView = ref; } }
                scrollsToTop={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                alwaysBounceVertical={false}
            >

                <First
                    ref={(ref) => { this.first = ref; } }
                    navigator={this.props.navigator}
                    scrollToMap={() => this.scrollToPage("map")} />
                <Map
                    isJumpFromTeamcenter={this.state.isJumpFromTeamcenter}
                    bMapOpen={this.state.bMapOpen}
                    navigator={this.props.navigator}
                    ref={(ref) => { this.amap = ref; } }
                    onMapLeftClick={() => this.onMapLeftClick()} />
            </ScrollView>
        )
    }
    onMapLeftClick()
    {
        if (this.isMapFromTc)
        {
            const {navigator} = this.props;
            //跳回团队中心
            navigator.jumpTo(navigator.getCurrentRoutes()[navigator.getCurrentRoutes().length - 1]);
            this.showGroupPos(false);
        }
        else
        {
            this.scrollToPage("first");
        }
    }
    scrollToPage(page, animated = true, exState = {})
    {
        this.currShowPage = page;
        if (page == "map")
        {
            this.scrollView.scrollTo({ x: wndWidth, y: 0, animated });
            if (!this.state.bMapOpen)
            {
                this.setState({...exState, bMapOpen:true});
            }
            else if (exState)
            {
                this.setState(exState);
            }
        }
        else
        {
            this.scrollView.scrollTo({ x: 0, y: 0, animated });
            if (exState)
            {
                this.setState(exState);
            }
        }
    }
    showGroupPos(bshow)
    {
        if (bshow)
        {
            this.isMapFromTc = true;
            this.scrollToPage("map", false, { isJumpFromTeamcenter: true });
        }
        else
        {
            this.isMapFromTc = false;
            this.setState({ isJumpFromTeamcenter: false });
        }

    }
    componentDidMount()
    {
        BackAndroid.addEventListener('hardwareBackPress', this.backHandler.bind(this));
    }
    backHandler()
    {
        if (this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length - 1].name != "main" && !this.isMapFromTc)
        {
            //最近2秒内按过back键，可以退出应用。
            AMapLocationManager.stopUpdatingLocation();
            AudioManager.stopAll(true);
            WS.close();
            // clientModel.logout(false);
            return false;
        }
        if (this.currShowPage == "first")
        {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now())
            {
                //最近2秒内按过back键，可以退出应用。
                AMapLocationManager.stopUpdatingLocation();
                AudioManager.stopAll();
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
        else
        {
            this.onMapLeftClick();
            return true;
        }
    }
    componentWillUnmount()
    {
        BackAndroid.removeEventListener('hardwareBackPress', this.backHandler);
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f2f4f7',

    },
    containerItem: {
        height: 160,
        flexDirection: 'column',
        backgroundColor: '#fcfcfc',
        margin: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        // borderBottomLeftRadius:20,
        // borderBottomRightRadius:20
    },
    itemImg: {
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        width: wndWidth - 50,
        height: 160,
        marginBottom: 10,
        overflow: "hidden"
    },
    itemTitle: {
        flex: 1,
        marginLeft: 5,
        fontSize: 16
    },
    itemContent: {
        flex: 1,
        marginLeft: 10,
        width: wndWidth - 70,
        fontSize: 15
    },
    headerPic: {
        height: wndWidth + 50,
        width: wndWidth,
    },
    titledec: { flexDirection: 'row', height: 20, },
    image: { flex: 1, height: wndWidth, width: wndWidth, },
    btnEnterMap: { textAlign: 'center', color: "#ffffff", paddingLeft: 30, paddingRight: 30, paddingBottom: 10, paddingTop: 10, borderColor: '#ffffff', borderRadius: 20, borderWidth: 1 },
    clickBtn:{
        height:50,
        width:50,
        marginTop:25,
        marginLeft:30,
        padding:10,
        backgroundColor:'#7fff00'
    },
    myMapBtn:{
        height:60,
        width:60,
        borderRadius:30,
        borderWidth:1,
        padding:10,
        position:'absolute',
        right:20,
        top:20,
        backgroundColor:'#7fff00',
        borderColor: '#7fff00'
    }
});

