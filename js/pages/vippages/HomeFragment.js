/**
 * Created by os on 17/4/14.
 */
import React from 'react';
import
{
    View,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    ListView,
    Platform,
    InteractionManager,
    BackAndroid,
    TextInput,
    PixelRatio
} from 'react-native';
import { wndWidth, drawerWidth, wndHeight } from '../../Global'
import { scaleSize, setSpText } from '../../ScreenUtils'
import HeadBar from '../../components/HeadBar';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import Map from '../Map';
import { connect } from 'react-redux';
import AMapLocationManager from '../../amap/AMapLocationManager';
import * as AudioManager from '../../utils/AudioManager';
import webviewPage from '../WebViewPage';
import scenic_info from '../scenic_info';
import { isEqual, naviGoBack } from '../../utils/CommonUtil';
import SearchBar from 'react-native-search-bar'
import px2dp from '../../utils/px2dp';
import startIcon from '../../imgs/new_icons/start@3x.png'
const SCROLL_MAX_SIZE = 275;
import right_LineIcon from '../../imgs/new_icons/index_rightLine@3x.png'
import left_LineIcon from '../../imgs/new_icons/index_leftLine@3x.png'
import andMorePage from '../../components/andMore'
import moreIcon from '../../imgs/new_icons/moreIcon@2x.png'
import morePlayIcon from '../../imgs/new_icons/morePlay@3x.png'
import pageIcon from '../../imgs/new_icons/icon-1@2x.png'
import eatPlayLocationIcon from '../../imgs/new_icons/eatPlayLocationIcon@3x.png'
import activityIcon from '../../imgs/new_icons/activityIcon@2x.png'
import activityMoreIcon from '../../imgs/new_icons/activityMoreIcon@2x.png'
import pageIcon2 from '../../imgs/new_icons/icon-2@3x.png'
import activityRightIcon from '../../imgs/new_icons/activityRightIcon@3x.png'
import tuijinLocationIcon from '../../imgs/new_icons/tuijinLocationIcon@3x.png'
import searchIcon from '../../imgs/new_icons/searchIcon@3x.png'
//import SearchBar from 'react-native-material-design-searchbar'
//import SearchBar from 'react-native-search-bar'

class HomeFragment_1 extends React.Component
{
    // 构造
    constructor(props)
    {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        let ds2 = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        this.state = {
            ds: ds,
            ds_ac: ds2,
            sa_img: this.props.sa_info && this.props.sa_info.photoinfo && this.props.sa_info.photoinfo.length > 0 ? this.props.sa_info.photoinfo[0].img : "",
            need: false,
        };
        //地图图片缓存
        if (this.props.sa_info && this.props.sa_info.overlay_img)
        {
            Image.prefetch(this.props.sa_info.overlay_img);
        }
    }
    render()
    {
        let recommend = this.recommend.bind(this);
        let eatPlayList = this.eatPlayList.bind(this);
        let GameStrategy = this.GameStrategy.bind(this);
        let activityParty = this.activityParty.bind(this);

        return (


            <View style={{ width: wndWidth, height: wndHeight - scaleSize(60) }}>

                <View style={styles.container}>
                    <ScrollView onScroll={this._onScroll.bind(this)} scrollEventThrottle={5} bounces={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false}
                        >
                        <IndicatorViewPager style={styles.headerPic} >
                            <View>
                                <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}
                                    onPress={() => this.props.scrollToMap()}>
                                    <Image source={{ uri: this.state.sa_img }} style={styles.image} resizeMode={'stretch'} />
                                </TouchableOpacity>
                            </View>
                        </IndicatorViewPager>
                        <View style={{ flexDirection: 'row', height: scaleSize(106), width: wndWidth, alignItems: 'center', backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', borderWidth: scaleSize(2), width: wndWidth-scaleSize(60), height: scaleSize(60), borderColor: '#70aa5e', alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: scaleSize(28), height: scaleSize(28) }} source={searchIcon} />
                                <Text style={{ fontSize: scaleSize(28), color: '#5c5c5c', marginLeft: scaleSize(10) }}>搜索活动/景点/夜间生活</Text>
                            </View>
                        </View>
                        {recommend()}
                        {eatPlayList()}
                        {GameStrategy()}
                        {activityParty()}
                    </ScrollView>
                </View>
                <HeadBar headStyle={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                    ref="titleBarComp"
                    leftIconStyle={{ width: 40, height: 40 }}
                    rightIconStyle={{ width: 40, height: 40 }}
                    headHeight={60}
                    bgColor={`rgba(156, 151, 139,0)`}
                    navigator={this.props.navigator}
                    leftClick={() => this.drawer.openDrawer()}
                    rightClick={() => this.qrcodeOpen()}
                    />
            </View>
        );
    }

    // openSearchView()
    // {
    //     alert('open search!');
    // }

    activityParty()
    {
        return (
            <View style={{ alignItems: 'center', marginTop: scaleSize(20), height: 300, backgroundColor: '#ffffff' }}>
                <TouchableOpacity style={{ width: wndWidth - scaleSize(60), height: scaleSize(120), flexDirection: 'row', marginTop: scaleSize(30), borderWidth: scaleSize(1), alignItems: 'center', borderColor: '#d3d3d3' }}>
                    <Text style={{ color: '#adff2f', fontSize: scaleSize(34), marginLeft: scaleSize(22), fontWeight: 'bold' }}>厦门各类玩法攻略</Text>
                    <Image style={{ marginLeft: scaleSize(22) }} source={activityMoreIcon} />
                    <Image style={{ position: 'absolute', right: scaleSize(60), height: scaleSize(100), width: scaleSize(100), top: scaleSize(10) }} source={activityRightIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: scaleSize(30), height: scaleSize(160), width: wndWidth - scaleSize(60), flexDirection: 'row' }}>
                    <Image style={{ height: scaleSize(160), width: scaleSize(320) }} source={pageIcon} />
                    <View style={{ marginLeft: scaleSize(25), flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#222226', fontSize: scaleSize(26), fontWeight: 'bold' }} numberOfLines={2}>[鼓浪屿夜景]鼓浪屿的夜显得清净幽雅.尤其是夜的嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿诶</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image style={{ height: scaleSize(34), width: scaleSize(36) }} source={activityIcon} />
                                <Text style={{ color: '#7a7a7a', fontSize: scaleSize(24), marginLeft: scaleSize(5) }}>时间11月6号</Text>
                            </View>
                            <Text style={{ color: '#70ad5d', fontWeight: 'bold', fontSize: scaleSize(24) }}>查看景区</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 1, width: wndWidth - scaleSize(60), backgroundColor: '#d3d3d3', marginTop: scaleSize(30) }}></View>
                <TouchableOpacity style={{ marginTop: scaleSize(30), height: scaleSize(160), width: wndWidth - scaleSize(60), flexDirection: 'row' }}>
                    <Image style={{ height: scaleSize(160), width: scaleSize(320) }} source={pageIcon} />
                    <View style={{ marginLeft: scaleSize(25), flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#222226', fontSize: scaleSize(26), fontWeight: 'bold' }} numberOfLines={2}>[鼓浪屿夜景]鼓浪屿的夜显得清净幽雅.尤其是夜的嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿诶</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image style={{ height: scaleSize(34), width: scaleSize(36) }} source={activityIcon} />
                                <Text style={{ color: '#7a7a7a', fontSize: scaleSize(24), marginLeft: scaleSize(5) }}>时间11月6号</Text>
                            </View>
                            <Text style={{ color: '#70ad5d', fontWeight: 'bold', fontSize: scaleSize(24) }}>查看景区</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>


        )
    }

    GameStrategy()
    {
        return (
            <View style={{ alignItems: 'center', marginTop: scaleSize(20), backgroundColor: '#ffffff' }}>
                <TouchableOpacity style={{ width: wndWidth - scaleSize(60), height: scaleSize(120), flexDirection: 'row', marginTop: scaleSize(30), borderWidth: scaleSize(1), alignItems: 'center', borderColor: '#d3d3d3' }}>
                    <Text style={{ color: '#df7c4b', fontSize: scaleSize(34), marginLeft: scaleSize(22), fontWeight: 'bold' }}>厦门各类玩法攻略</Text>
                    <Image style={{ marginLeft: scaleSize(22) }} source={moreIcon} />
                    <Image style={{ position: 'absolute', right: scaleSize(60), height: scaleSize(100), width: scaleSize(120), top: scaleSize(5) }} source={morePlayIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: scaleSize(30), height: scaleSize(160), width: wndWidth - scaleSize(60), flexDirection: 'row' }}>
                    <Image style={{ height: scaleSize(160), width: scaleSize(320) }} source={pageIcon} />
                    <View style={{ marginLeft: scaleSize(25), flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#222226', fontSize: scaleSize(26), fontWeight: 'bold' }} numberOfLines={2}>[鼓浪屿夜景]鼓浪屿的夜显得清净幽雅.尤其是夜的嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿诶</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image style={{ height: scaleSize(34), width: scaleSize(26) }} source={eatPlayLocationIcon} />
                                <Text style={{ color: '#7a7a7a', fontSize: scaleSize(24), marginLeft: scaleSize(5) }}>距离2.3km</Text>
                            </View>
                            <Text style={{ color: '#70ad5d', fontWeight: 'bold', fontSize: scaleSize(24) }}>查看景区</Text>
                        </View>
                    </View>


                </TouchableOpacity>
                <View style={{ height: 1, width: wndWidth - scaleSize(60), backgroundColor: '#d3d3d3', marginTop: scaleSize(30) }}></View>
                <TouchableOpacity style={{ marginTop: scaleSize(30), marginBottom: scaleSize(30), height: scaleSize(160), width: wndWidth - scaleSize(60), flexDirection: 'row' }}>
                    <Image style={{ height: scaleSize(160), width: scaleSize(320) }} source={pageIcon} />
                    <View style={{ marginLeft: scaleSize(25), flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#222226', fontSize: scaleSize(26), fontWeight: 'bold' }} numberOfLines={2}>[鼓浪屿夜景]鼓浪屿的夜显得清净幽雅.尤其是夜的嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿诶</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image style={{ height: scaleSize(34), width: scaleSize(26) }} source={eatPlayLocationIcon} />
                                <Text style={{ color: '#7a7a7a', fontSize: scaleSize(24), marginLeft: scaleSize(5) }}>距离2.3km</Text>
                            </View>
                            <Text style={{ color: '#70ad5d', fontWeight: 'bold', fontSize: scaleSize(24) }}>查看景区</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    //*****************************智能推荐*********************
    recommend()
    {
        return (
            <View style={{ width: wndWidth, height: scaleSize(312), marginTop: scaleSize(20), backgroundColor: '#FFFFFF' }}>
                {
                    this.props.sp_article_list == null || this.props.sp_article_list.length <= 0 ? null :
                        <ListView
                            initialListSize={1}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            enableEmptySections={true}
                            dataSource={this.state.ds}
                            renderRow={this.renderItem.bind(this)}
                            style={{ marginTop: scaleSize(20), width: wndWidth }}>
                        </ListView>
                }
                < View style={{ backgroundColor: '#FFFFFF', alignItems: "center", justifyContent: 'center', opacity: 0.7, position: 'absolute', height: scaleSize(60), width: wndWidth, left: 0, top: scaleSize(20) }}>
                    <Text style={{ color: '#70aa5e', backgroundColor: 'transparent', fontSize: scaleSize(34), fontWeight: 'bold' }}>智能推荐</Text>
                </View>
                <View style={{ backgroundColor: 'transparent', position: 'absolute', left: scaleSize(46), flexDirection: 'row', bottom: scaleSize(46) }}>
                    <Text style={{ color: '#ffffff', fontSize: scaleSize(24), backgroundColor: 'transparent' }}>木绵绵的水果店</Text>
                    <Image style={{ marginLeft: scaleSize(26), marginRight: scaleSize(10) }} source={tuijinLocationIcon} />
                    <Text style={{ color: '#ffffff', backgroundColor: 'transparent', fontSize: scaleSize(24) }}>1.03km</Text>
                </View>
            </View>
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

                </View >
            </TouchableOpacity>
        )
    }
    //*****************************************************************************

    //***********************吃喝玩乐**********************************
    eatPlayList()
    {

        return (
            <View style={{ marginTop: scaleSize(20), backgroundColor: '#ffffff', height: scaleSize(650), width: wndWidth, flexDirection: 'column', alignItems: 'center' }}>
                <Text style={{ color: '#a9dd4d', fontSize: scaleSize(34), marginTop: scaleSize(20), fontWeight: 'bold' }}>吃喝玩乐</Text>
                <View style={{ width: wndWidth / 2, backgroundColor: '#ffffff', marginTop: scaleSize(10), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ marginRight: scaleSize(22) }} source={left_LineIcon} />
                    <Text style={styles.fontSS}>旅行就是玩好吃好</Text>
                    <Image style={{ marginLeft: scaleSize(22) }} source={right_LineIcon} />
                </View>
                <View style={{ height: scaleSize(480), marginBottom: scaleSize(22), backgroundColor: '#FFFFFF', marginTop: scaleSize(30) }}>
                    {
                        this.props.sp_article_list == null || this.props.sp_article_list.length <= 0 ? null :
                            <ListView
                                initialListSize={1}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                enableEmptySections={true}
                                dataSource={this.state.ds}
                                renderRow={this.eatPlay.bind(this)}
                                style={{ width: wndWidth }}>
                            </ListView>
                    }

                </View>
            </View>
        )
    }
    eatPlay(rawData)
    {
        Image.prefetch(rawData.image);
        return (
            <TouchableOpacity onPress={() => this.openWebviewPage(rawData.pointid, rawData.name, 1)} style={{ height: scaleSize(480), width: scaleSize(280), marginLeft: scaleSize(30) }}>
                <View style={{ width: scaleSize(280), height: scaleSize(480), }}>
                    <Image
                        style={{ width: scaleSize(280), height: scaleSize(330) }}
                        source={{ uri: rawData.image }}
                        />
                    <Text style={{ color: '#70aa5e', marginTop: scaleSize(12), fontWeight: 'bold', fontSize: scaleSize(26) }}>小筱咖啡厅</Text>
                    <Text style={{ marginTop: scaleSize(16), color: '#222226', fontSize: scaleSize(18), fontWeight: 'bold' }}>咖啡与甜点的碰撞,曼妙的</Text>

                    <View style={{ backgroundColor: 'transparent', flexDirection: 'row', marginTop: scaleSize(16), }}>
                        <Image source={startIcon} style={{ width: scaleSize(140), }} resizeMode='stretch'></Image>
                        <Text style={{ marginLeft: scaleSize(50), color: '#70ad5d', fontSize: scaleSize(22) }}>5条评价</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    //***************************************************************************************

    andMore()
    {

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

    componentDidMount()
    {
        // if (Platform.OS == 'android'){
        //     CodePush.checkForUpdate('CuPpIHqbo6M-F1NpBdxyGmNVATZ341mBqxc_G').then((update) =>
        //     {
        //         // console.warn("up", update)
        //         if (!update)
        //         {
        //             // console.warn("dd", buyong)
        //         }
        //         else
        //         {
        //             if (update.failedInstall) { this.rou.togglePr(false) }
        //             else { this.rou.togglePr(true) }
        //         }
        //     });
        // }

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
let First = connect(select)(HomeFragment_1);

import { setShowGroupPosFun } from '../../Global';
export default class HomeFragment extends React.Component
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
    if (this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length - 1].name != "HomeFragment" && !this.isMapFromTc)
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
        backgroundColor: '#f3f4f6',
        position: 'relative',
        flex: 1
    },
    headerPic: {
        height: scaleSize(500),
        width: wndWidth,
    },
    btnEnterMap: {
        textAlign: 'center',
        color: "#ffffff",
        paddingLeft: scaleSize(60),
        paddingRight: scaleSize(60),
        paddingBottom: scaleSize(20),
        paddingTop: scaleSize(20),
        borderColor: '#ffffff',
        borderRadius: scaleSize(40),
        borderWidth: 1
    },
    image: {
        height: scaleSize(500),
        width: wndWidth,
    },
    itemImg: {
        width: wndWidth - scaleSize(60),
        height: scaleSize(260),
        overflow: "hidden",
        marginLeft: scaleSize(30),
        marginRight: scaleSize(30)
    },
    containerItem: {
        height: scaleSize(260),
        flexDirection: 'column',
        width: wndWidth
    },
    fontSS: { color: '#a0dd4d', fontSize: scaleSize(27) },
});