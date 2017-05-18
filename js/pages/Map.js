/**
 * Created by chenjunsheng on 16/7/17.
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import
{
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    Linking,
    Modal,
    TouchableHighlight,
    InteractionManager,
    Dimensions,
    Platform,
    TouchableOpacity,
    Animated,
    Easing
} from 'react-native';
import { connect } from 'react-redux';
import HeadBar from '../components/HeadBar';
import AMapLocationManager from '../amap/AMapLocationManager';
import AMapView from '../amap/AMapView';
import * as clientModel from '../Net/clientModel';
// import { AudioPlayer } from 'react-native-audio';
import * as AudioManager from '../utils/AudioManager';
import SpDetail from '../components/SpDetail';
import { toastShort, toastLong } from '../utils/ToastUtil';
import webviewPage from './WebViewPage';
import { isEqual } from '../utils/CommonUtil';
import { ImageButton } from '../components/Common'
import ReRoute from '../components/ReRoute'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import SeLanguage from '../components/SeLanguage'
import Chat from './Chat';
import { headBarPt, wndWidth, showGroupPosFun, lastSendPosTime, setLocationPos, locationPos } from '../Global';
import { findPathAny } from '../amap/pathFind';
const { width, height } = Dimensions.get('window')
import SearchBar from 'react-native-search-bar'
class Map extends Component
{
    constructor(props)
    {
        super(props);
        this.animatedValue = new Animated.Value(0.3),
        this.firstid = 0;
        this.index = 0;
        this.langid = 101;
        this.wcShow = false;
        this.scShow = false;
        /**当前所在景点信息 */
        this.curSpInfo = null;
        /**在请求的景点声音图文信息的ID */
        this.applyingSpId = 0;

        this.state = {
            isAnimateOver: false,
            visible: false,
            btnShow:true,
            isShowSearchView:false,
        };
    }
    render()
    {
        const opacity = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0]
        })
        if (this.state.isAnimateOver)
            return (
                <View style={{ width: wndWidth }}>
                    <AMapView style={styles.container} compassEnabled={false}
                              defaultRegion={{ "latitude": this.props.sa_info.cen_posy, "longitude": this.props.sa_info.cen_posx, "latitudeDelta": 0.5, "longitudeDelta": 0.5, "zoomLevel": 18.5 }}
                              ref={(ref) => { this.amap = ref; } }
                        // myLocationEnabled={true}
                        //地图旋转
                              rotateGesturesEnabled={false}
                              tiltGesturesEnabled={false}
                              onMove={(e) => { this.spdlg.toggleDlg(false); } }
                        //
                              onMapReady={this.onMapReady.bind(this)}
                        //marker点击
                              onMarkerPress={(e) => this.onMarkerPress(e)}
                              onAnimationOver={e =>
                        {
                            //__打开窗口
                            if (this.openDlgInfo)
                            {
                                this.spdlg.toggleDlg(true, this.openDlgInfo.spid, this.openDlgInfo.name, this.openDlgInfo.content);
                                this.openDlgInfo = null;
                            }
                        } }

                    >
                        {this.state.btnShow?<View style={{ flexDirection: 'column', right: 24, top: 80,justifyContent:'flex-end',position:'absolute'}}>
                            {this.getBtnRight(require('../imgs/icons/btn_lang.png'), "lang")}
                            {this.getBtnRight(require('../imgs/icons/btn_wc.png'), "wc")}
                            {this.getBtnRight(require('../imgs/icons/btn_fwz.png'), "fwz")}
                            {this.getBtnRight(require('../imgs/icons/btn_car.png'), "car")}
                            {this.getBtnRight(require('../imgs/icons/btn_line.png'), "line")}
                        </View>:null}

                        {this.state.isShowSearchView == 'true'?<View style={{backgroundColor:'blue',marginTop:120,width: wndWidth,height:120}}></View>:null}
                    </AMapView>

                    <HeadBar
                        headStyle={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                        ref={(ref) => { this.titleBarComp = ref; } }
                        leftIcon={require('../imgs/icons/backIcon@2x.png')}
                        leftClick={() => { this.props.onMapLeftClick() } }

                    />
                    <SearchBar
                        style={{position:'absolute',top: 12,width: wndWidth-60,left: 40,height: 60}}
                        ref='searchBar'
                        placeholder='请输入景区或景点'
                        onSearchButtonPress={()=>this.refs.searchBar.unFocus()}
                        hideBackground={true}
                        onChangeText={this.setState({isShowSearchView:true})}
                        searchBarStyle="prominent"
                        enablesReturnKeyAutomatically={true}
                    />

                    <TouchableOpacity onPress={()=>this.onpressBtnShowP(this.setState({ btnShow: true }))} style={styles.btnOpenMap}>
                        <Text style={{flex:1,textAlign:'center'}}>展开</Text>
                    </TouchableOpacity>

                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.visible}
                        onRequestClose={() => this.closeModal()}
                    >
                        <TouchableOpacity onPress={() => {this.setState({ visible: false })}} style={styles.loadingImageView} >
                            <View style={styles.loadingView}></View></TouchableOpacity>


                            <View style={styles.loadingImage}>
                                <View style={{ position: 'absolute', left: 0, top: 0, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#3c93f5', height: 40, width: 0.6 * width, }}>
                                </View>
                                <TouchableHighlight onPress={() => this.openbmap()} style={{ position: 'absolute', left: 20, top: 70, width: 60, height: 60 }} underlayColor="#a9d9d4">
                                    <Image style={{ width: 60, height: 60 }} source={require('../imgs/icons/baidu.png')} />
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => this.openamap()} style={{ position: 'absolute', right: 20, top: 70, width: 60, height: 60 }} underlayColor="#a9d9d4">
                                    <Image style={{ width: 60, height: 60 }} source={require('../imgs/icons/gaode.png')} />
                                </TouchableHighlight>
                                <View style={{ position: 'absolute', left: 15, bottom: 15, }} >
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: 'white' }}>百度地图</Text>
                                </View>
                                <View style={{ position: 'absolute', right: 15, bottom: 15, }} >
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: 'white' }}>高德地图</Text>
                                </View>
                            </View>


                    </Modal>
                    <SpDetail
                        ref={(ref) => { this.spdlg = ref; } }
                        leftClick={(id) => [this.playSound(id, this.langid), this.firstid = id]}
                        rightClick={(id, name) => this.openWebviewPage(id, name, 1)}
                        centerClick={(id) => this.sp_route(id)}
                    />
                    <ReRoute
                        ref={(ref) => { this.rou = ref; } }
                        onPressItem={(arrPos, id) => { this.rou_itemclick(arrPos, id) } }
                    />
                    <SeLanguage
                        ref={(ref) => { this.langDlg = ref; } }
                        select={(id, index) => [this.langid = id, this.index = index, this.playSound(this.firstid, id)]}
                    />
                    <ImageButton
                        containerStyle={{ position: 'absolute', left: 20, bottom: 20 }}
                        onPress={() => { this.onBtnClicked('center') } }
                        source={require('../imgs/icons/btn_tocenter.png')}
                        imgStyle={styles.btnImg}
                    />
                    <ImageButton defaultVisible={AudioManager.getPlayingStatus()==1 || AudioManager.getPlayingStatus()==2?true:false}
                                 ref={(ref) => { this.voice = ref } }
                                 containerStyle={{ position: 'absolute', left: 20, top: 60 + headBarPt }}
                                 onPress={() => { this.onBtnClicked('voice') } }
                                 source={require('../imgs/icons/btn_voice.gif')}
                                 imgStyle={{width:50,height:33}}
                    />


                    <TouchableOpacity  style={styles.btnYoujiMap} onPress={()=>this._youjiOnpress()}>
                            <Text style={{flex:1,textAlign:'center'}}>游记</Text>
                    </TouchableOpacity>

                    <Animated.View
                        style={{left: 35, position: 'absolute',opacity,top: 250}}>
                        <TouchableHighlight
                            style={{height:30,width: 30}}>
                            <Text>sdsasdasds</Text>

                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{height: 30,width: 30}}>
                            <Text>sdsasdasds</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{height: 30,width: 30}}>
                            <Text>sdsasdasds</Text>
                        </TouchableHighlight>
                    </Animated.View>
                </View>

            );
        else return (<View style={{ width: wndWidth }} />);
    }

    _youjiOnpress(){
        console.warn('游记');
    }
    onpressBtnShowP(){
        this.animate()

    }

    animate () {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 5000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }

    rou_itemclick(arrPos, id)
    {
        let points = [];
        this.amap.clearMarker("route");
        this.amap.addLine(arrPos, '#ff0000'),
            this.titleBarComp.setState({ centerClicked: false })

        if (this.props.sp_recommend_route && this.props.sp_recommend_route.length > 0)
        {
            for (let i = 0; i < this.props.sp_recommend_route.length; i++)
            {
                if (this.props.sp_recommend_route[i].id == id)
                {
                    try{
                        points = JSON.parse(this.props.sp_recommend_route[i].points);
                        break;
                    }
                    catch(e)
                    {

                    }
                }
            }
        }

        let roulist = [];
        if (points && points.length > 0)
        {
            for (let i = 0; i < points.length; i++)
            {
                if (this.props.sp_position_list && this.props.sp_position_list.length > 0)
                {
                    for (let m = 0; m < this.props.sp_position_list.length; m++)
                    {
                        if (this.props.sp_position_list[m].pointid == points[i])
                        {
                            roulist.push(this.props.sp_position_list[m])
                        }
                    }
                }
            }
        }




        let tempArr = [];
        if (roulist.length > 0)
        {
            for (let i = 0; i < roulist.length; i++)
            {

                tempArr.push({
                    longitude: roulist[i].cen_posx,
                    latitude: roulist[i].cen_posy,
                    iconUri: "route",
                    title: roulist[i].name,
                    id: roulist[i].pointid.toString()
                });

            }
        }
        this.amap.addMarkers(tempArr, "route");
    }
    closeModal()
    {
        this.setState({ visible: false });
    }
    openamap()
    {
        if (Platform.OS == 'android'){
            Linking.canOpenURL('androidamap://route?sourceApplication=softname&dev=0&m=0&t=1&showType=1 ').then(supported =>
            {
                if (supported)
                {
                    Linking.openURL('androidamap://route?sourceApplication=softname&dev=0&m=0&t=1&showType=1');

                } else
                {
                    Linking.openURL('market://details?id=com.autonavi.minimap');
                }
            });
            this.setState({ visible: false });
        }else {
            Linking.canOpenURL('iosamap://myLocation?sourceApplication=applicationName').then(supported =>{
                if (supported){
                    Linking.openURL('iosamap://myLocation?sourceApplication=applicationName');
                }else {
                    Linking.openURL('https://itunes.apple.com/cn/app/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BEhd/id562136065?mt=8');
                }
            });
            this.setState({ visible: false });
        }

    }
    openbmap()
    {
        if (Platform.OS == 'android'){
            Linking.canOpenURL('baidumap://map?').then(supported =>
            {
                if (supported)
                {
                    Linking.openURL('baidumap://map?');
                } else
                {
                    Linking.openURL('market://details?id=com.baidu.BaiduMap');
                }
            });
            this.setState({ visible: false });
        }else {
            Linking.canOpenURL('baidumap://map/?').then(supported =>{
                if (supported){
                    Linking.openURL('baidumap://map/?');
                }else {
                    Linking.openURL('https://itunes.apple.com/cn/app/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE-%E4%B8%93%E4%B8%9A%E6%89%8B%E6%9C%BA%E5%9C%B0%E5%9B%BE-%E6%99%BA%E8%83%BD%E8%AF%AD%E9%9F%B3%E5%AF%BC%E8%88%AA/id452186370?mt=8');
                }
            });
            this.setState({ visible: false });
        }

    }
    sp_route(id)
    {
        if (!locationPos || !locationPos[0] || !locationPos[1])
        {
            toastShort('无法获取到您当前所在位置');
            return;
        }
        // if (locationPos[0] < 118 || locationPos[0] > 119 || locationPos[1] < 24 || locationPos[1] > 25)
        if (locationPos[0] < this.props.sa_info.overlay_top_x || locationPos[0] > this.props.sa_info.overlay_bottom_x || locationPos[1] < this.props.sa_info.overlay_top_y || locationPos[1] > this.props.sa_info.overlay_bottom_y)
        {
            toastShort('您当前不在景区范围内');
            return;
        }
        let arrPos;
        if (this.props.sp_position_list && this.props.sp_position_list.length > 0)
        {
            for (let i = 0; i < this.props.sp_position_list.length; i++)
            {
                if (this.props.sp_position_list[i].pointid == id)
                {
                    arrPos = findPathAny(locationPos[0], locationPos[1], this.props.sp_position_list[i].cen_posx, this.props.sp_position_list[i].cen_posy);
                    break;
                }
            }
        }
        if (arrPos)
        {
            let arr = [];
            for (let i = 0; i < arrPos.length; i++)
            {
                arr.push({ "longitude": arrPos[i].x, "latitude": arrPos[i].y });
            }
            this.amap.addLine(arr, '#000000')
        }
        this.spdlg.toggleDlg(false);

    }
    onMapReady()
    {
        let uri = this.props.sa_info.overlay_img;
        this.amap.addOverlay({ uri: uri, lat: this.props.sa_info.overlay_top_y, lng: this.props.sa_info.overlay_top_x, lat1: this.props.sa_info.overlay_bottom_y, lng1: this.props.sa_info.overlay_bottom_x });
        if (this.props.isJumpFromTeamcenter)
        {
            clientModel.getMembersPos(this.props.groupInfo.group_id);
            this.interval = setInterval(() =>
            {
                clientModel.getMembersPos(this.props.groupInfo.group_id);
            }, 5 * 1000);
        }
        else
        {
            this.addSpMarker(this.props.sp_position_list);
        }
        this.bMoveToScenic = true;
    }

    componentDidMount()
    {
        /**开启定位 */
        AMapLocationManager.startUpdatingLocation(true, this.onRegionChange.bind(this));
    }

    componentWillReceiveProps(nextProps)
    {
        /**每次页面切换都会触发？且nextprops对应的key都有值？__原因未知 */

        if (nextProps.bMapOpen && !this.props.bMapOpen)
        {
            this.openMapFirst();
            return;
        }
        if (!this.props.bMapOpen)
        {
            return;
        }
        if (nextProps.sp_voice_info && !nextProps.sp_voice_info.bPlayed && this.applyingSpId != 0)
        {
            /**临时做法，用来修复 网络连接失败时去播放上一次的声音 */
            nextProps.sp_voice_info.bPlayed=true;
            AudioManager.setFinishCb(this.onVoiceFinished.bind(this));
            AudioManager.setStartCb(this.onVoiceStart.bind(this));
            this.applyingSpId = 0;
        }
        if (nextProps.sp_lang_list)
        {
            this.langid = nextProps.sp_lang_list[this.index].id;
        }
        if (nextProps.isJumpFromTeamcenter != null)
        {
            if (nextProps.isJumpFromTeamcenter != this.props.isJumpFromTeamcenter)
            {
                if (nextProps.isJumpFromTeamcenter && this.amap)
                {
                    this.amap.clearMarker("all");
                    this.wcShow = false;
                    this.scShow = false;
                    if (this.interval)
                    {
                        clearInterval(this.interval);
                        this.interval = null;
                    }
                    clientModel.getMembersPos(this.props.groupInfo.group_id);
                    this.interval = setInterval(() =>
                    {
                        clientModel.getMembersPos(this.props.groupInfo.group_id);
                    }, 5 * 1000);
                }
                if (!nextProps.isJumpFromTeamcenter)
                {
                    this.amap.clearMarker();
                    this.addSpMarker(this.props.sp_position_list);
                    if (this.interval)
                    {
                        clearInterval(this.interval);
                        this.interval = null;
                    }
                }
                this.toggleRightView(!nextProps.isJumpFromTeamcenter);
            }
        }
        if (this.props.isJumpFromTeamcenter && nextProps.isJumpFromTeamcenter != false && nextProps.memberPos
            && nextProps.memberPos.pos_y && nextProps.memberPos.pos_x && nextProps.memberPos.id)
        {
            let lng = typeof(nextProps.memberPos.pos_x)=="number"?nextProps.memberPos.pos_x:parseFloat(nextProps.memberPos.pos_x);
            let lat = typeof(nextProps.memberPos.pos_y)=="number"?nextProps.memberPos.pos_y:parseFloat(nextProps.memberPos.pos_y);
            this.amap.updateMarkerPos([{ lat, lng, icon: 'grp', id: nextProps.memberPos.id.toString() }]);
        }
    }
    /**显隐右边按钮*/
    toggleRightView(show)
    {
        if (this.lang)
        {
            this.lang.setVisible(show);
        }
        if (this.wc)
        {
            this.wc.setVisible(show);
        }
        if (this.fwz)
        {
            this.fwz.setVisible(show);
        }
        if (this.car)
        {
            this.car.setVisible(show);
        }
        if (this.line)
        {
            this.line.setVisible(show);
        }
    }
    /**声音播放结束 */
    onVoiceFinished(data)
    {
        this.voice.setVisible(false);
    }
    /**声音开始播放 */
    onVoiceStart(data)
    {
        this.voice.setVisible(true);
    }

    addSpMarker(sp_position_list)
    {
        let tempArr = [];

        if (sp_position_list && sp_position_list.length > 0)
        {

            for (let i = 0; i < sp_position_list.length; i++)
            {
                if (sp_position_list[i].cate_id == 1001)
                {
                    tempArr.push({
                        longitude: sp_position_list[i].cen_posx,
                        latitude: sp_position_list[i].cen_posy,
                        iconUri: "jingdian",
                        title: "",
                        id: sp_position_list[i].pointid.toString()
                    });

                }

            }
        }
        if (this.amap)
        {
            this.amap.addMarkers(tempArr, "sp");
        }
        else
        {/**amap对象找不到，先试试看？ */
        action.members("amap对象找不到，先试试看？");
            setTimeout(() =>
            {
                if (this.amap)
                {
                    this.amap.addMarkers(tempArr, "sp")
                }
                else
                {
                    console.warn("addMarkers出错，this.amap找不到")
                }
            }, 100);
        }
    }
    addWCMarker(sp_position_list)
    {
        let wcid = [];
        let tempArr = [];
        if (sp_position_list && sp_position_list.length > 0)
        {
            for (let i = 0; i < sp_position_list.length; i++)
            {
                if (sp_position_list[i].cate_id == 1003)
                {
                    tempArr.push({
                        longitude: sp_position_list[i].cen_posx,
                        latitude: sp_position_list[i].cen_posy,
                        iconUri: "wc",
                        title: "",
                        id: sp_position_list[i].pointid.toString()
                    });
                    wcid.push(sp_position_list[i].pointid.toString())
                }
                this.wcid = wcid

            }
        }
        this.amap.addMarkers(tempArr, "wc");
    }
    addSCMarker(sp_position_list)
    {
        let scid = [];
        let tempArr = [];
        if (sp_position_list && sp_position_list.length > 0)
        {
            for (let i = 0; i < sp_position_list.length; i++)
            {
                if (sp_position_list[i].cate_id == 1004)
                {
                    tempArr.push({
                        longitude: sp_position_list[i].cen_posx,
                        latitude: sp_position_list[i].cen_posy,
                        iconUri: "severcenter",
                        title: "",
                        id: sp_position_list[i].pointid.toString()
                    });
                    scid.push(sp_position_list[i].pointid.toString())
                }
                this.scid = scid

            }
        }
        this.amap.addMarkers(tempArr, "sc");
    }


    getBtnRight(img, name)
    {
        return (
            <ImageButton
                defaultVisible={!this.props.isJumpFromTeamcenter}
                ref={(ref) => { this[name] = ref } }
                containerStyle={{ margin: 5 }}
                onPress={() => { this.onBtnClicked(name) } }
                source={img}
                imgStyle={styles.btnImg}
            />
        )
    }
    onBtnClicked(name)
    {
        switch (name)
        {
            case 'lang':

                if (this.props.sp_lang_list)
                {
                    this.langDlg.toggleLan(!this.langDlg.state.bShow, this.props.sp_lang_list);
                }

                break;
            case 'wc':
                if (!this.wcShow)
                {
                    this.amap.clearMarker();
                    this.scShow = false;
                    this.addWCMarker(this.props.sp_position_list);
                    this.wcShow = true
                } else
                {
                    this.amap.clearMarker();
                    this.wcShow = false;
                    this.scShow = false;
                }

                break;
            case 'fwz':
                if (!this.scShow)
                {
                    this.amap.clearMarker();
                    this.wcShow = false;
                    this.addSCMarker(this.props.sp_position_list);
                    this.scShow = true
                } else
                {

                    this.amap.clearMarker();
                    this.wcShow = false;
                    this.scShow = false;
                }

                break;
            case 'car':

                this.setState({ visible: true })
                break;
            case 'line':
                this.amap.clearLine();
                this.amap.clearMarker("route");

                break;
            case 'center':
                if (this.props.sa_info && this.props.sa_info.cen_posy)
                {
                    //this.amap.animateToRegion(this.props.sa_info.cen_posy, this.props.sa_info.cen_posx, 18.5, 200);
                    this.amap.startLocation();
                }
                break;
            case "voice":
                AudioManager.stop();
                this.firstid = 0;
                this.voice.setVisible(false);
                break;
        }
    }
    onMarkerPress(e)
    {
        this.amap.animateToRegion(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, 0, 200);
        let spid = e.nativeEvent.id;

        if (e.nativeEvent.type == "sp" && this.props.sp_article_list && this.props.sp_article_list.length > 0)
        {
            for (let i = 0; i < this.props.sp_article_list.length; i++)
            {
                if (this.props.sp_article_list[i].pointid == spid)
                {
                    this.openDlgInfo = { spid, name: this.props.sp_article_list[i].name, content: this.props.sp_article_list[i].shortcontent };
                    break;
                }
            }
        }
        else  if(e.nativeEvent.type == "sc" || e.nativeEvent.type == "wc")
        {
            if (!locationPos || !locationPos[0] || !locationPos[1])
            {
                toastShort('无法获取到您当前所在位置');
                return;
            }
            // if (locationPos[0] < 118 || locationPos[0] > 119 || locationPos[1] < 24 || locationPos[1] > 25)
            if (locationPos[0] < this.props.sa_info.overlay_top_x || locationPos[0] > this.props.sa_info.overlay_bottom_x || locationPos[1] < this.props.sa_info.overlay_top_y || locationPos[1] > this.props.sa_info.overlay_bottom_y)
            {
                toastShort('您当前不在景区范围内');
                return;
            }

            let arrPos = findPathAny(locationPos[0], locationPos[1], e.nativeEvent.coordinate.longitude, e.nativeEvent.coordinate.latitude);


            if (arrPos)
            {
                let arr = [];
                for (let i = 0; i < arrPos.length; i++)
                {
                    arr.push({ "longitude": arrPos[i].x, "latitude": arrPos[i].y });
                }
                this.amap.addLine(arr, '#000000')
            }
        }

    }

    onRegionChange(e)
    {
        let pos = [e.longitude, e.latitude];

        setLocationPos(pos);
        // if(Date.now() - lastSendPosTime > 60 * 1000)
        // {
        //     clientModel.commitLocationPos();
        // }
        if (!this.curSpInfo)
        {
            if (this.props.sp_position_list && this.props.sp_position_list.length > 0)
            {
                for (let i = 0; i < this.props.sp_position_list.length; i++)
                {
                    if (this.isPotinInside(pos, this.props.sp_position_list[i].area_points))
                    {
                        if(!this.curSpInfo || this.curSpInfo.pointid!=this.props.sp_position_list[i].pointid)
                        {
                            let id = this.props.sp_position_list[i].pointid;
                            if(AudioManager.getPlayingStatus() !=0 || AudioManager.getRecordingStatus()!=0 || AudioManager.isSending || AudioManager.isListening)
                            {
                                //状态：播放声音||录音||导游讲话||听导游讲解
                                toastLong("您进入了景点：" + this.props.sp_position_list[i].name);
                            }
                            else
                            {
                                Alert.alert("提示", "检测到您已进入景点：" + this.props.sp_position_list[i].name + "，是否开启语音讲解？", [
                                    { text: "是", onPress: ()=> [this.playSound(id, this.langid), this.firstid = id]},{text:"取消"}
                                ])
                            }
                        }
                        this.curSpInfo = this.props.sp_position_list[i];
                        break;
                    }

                }
            }
        }
        else
        {
            if (!this.isPotinInside(pos, this.curSpInfo.area_points))
            {
                toastShort("离开了景点：" + this.curSpInfo.name);
                this.curSpInfo = null;
            }
        }
        if (this.bMoveToScenic)
        {
            if (this.props.sa_info && this.props.sa_info.cen_posy && this.amap)
            {
                //this.amap.animateToRegion(this.props.sa_info.cen_posy, this.props.sa_info.cen_posx, 18.5, 10);
                this.amap.startLocation();
            }

            this.bMoveToScenic = false;
        }
    }
    //cate_id：0-景区 1-景点 2-活动
    openWebviewPage(spid, title, cate_id)
    {
        this.spdlg.toggleDlg(false);
        this.props.navigator.push({ component: webviewPage, name: "WebViewPage", params: { spid, title, cate_id } });
        if (this.props.isJumpFromTeamcenter)
        {
            InteractionManager.runAfterInteractions(() =>
            {
                showGroupPosFun(false);
            });
        }
    }
    playSound(id, langid)
    {
        if(this.spdlg)
            this.spdlg.toggleDlg(false);
        // if(!this.curSpInfo)
        // {
        //     toastShort("您当前不在该景点附近");
        //     return;
        // }
        clientModel.sp_voice(id, langid);
        this.applyingSpId = id;
    }
    openMapFirst()
    {
        InteractionManager.runAfterInteractions(() =>
        {
            this.setState({ isAnimateOver: true });
        })
    }

    /**判断点是否在多边形内 */
    isPotinInside(point, vs)
    {
        var x = point[0], y = point[1];
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++)
        {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };
    shouldComponentUpdate(nextProps, nextState)
    {
        if (isEqual(nextState, this.state) && isEqual(nextProps.sa_info.sp_position_list, this.props.sa_info.sp_position_list) && isEqual(nextProps.sa_info, this.props.sa_info)
            && isEqual(this.props.isJumpFromTeamcenter,nextProps.isJumpFromTeamcenter))
        {
            return false;
        }
        return true;
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
    },
    btnImg: {
        width: 40, height: 40
    },
    loadingView: {
        flex: 1,
        height,
        width,
        position: 'absolute',
        //backgroundColor: 'transparent',

    },
    loadingImage: {
        width: 0.6 * width,
        height: 0.3 * height,
        borderRadius: 5,
        backgroundColor: '#8bc0fc',
        position: 'absolute',
        top:height/2-(0.3* height/2),
        bottom:height/2-(0.3* height/2),
        left:width/2-(0.6 * width/2),
        right:width/2-(0.6 * width/2),
    },
    loadingImageView: {
        position: 'absolute',
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnYoujiMap: {  padding: 10,color: "#ffffff",borderColor: '#ffffff', borderRadius: 25, borderWidth: 1,
        backgroundColor:'#FFFFFF', height:50, width:50, left:wndWidth/2-25,position:"absolute",bottom:40
    },
    btnOpenMap: {  padding: 10,color: "#ffffff",borderColor: '#ffffff', borderRadius: 25, borderWidth: 1,
        backgroundColor:'#FFFFFF', height:50, width:50, left:20,position:"absolute", top:180
    },
    animatedContainer: {
        flex: 1,
        paddingTop: 150
    }

});
function select(store)
{
    return {
        sp_position_list: store.scenicStore.sp_position_list,
        sp_article_list: store.scenicStore.sp_article_list,
        sp_voice_info: store.scenicStore.sp_voice_info,
        sa_info: store.scenicStore.sa_info,
        sp_recommend_route: store.scenicStore.sp_recommend_route,
        sp_lang_list: store.scenicStore.sp_lang_list,
        groupInfo: store.chatStore.groupInfo,
        memberPos: store.chatStore.memberPos,
    }
}
export default connect(select, null, null, { withRef: true })(Map);
