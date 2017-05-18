/**
 * Created by os on 17/4/20.
 */
import React from 'react';
import {
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
    TextInput
} from 'react-native';
import default_headerIcon from '../../imgs/new_icons/default-header@3x.png'
import sexIcon from '../../imgs/new_icons/nickNameIcon@3x.png'
import settingIcon from  '../../imgs/new_icons/setIcon@3x.png'
import signatureIcon from  '../../imgs/new_icons/signatureIcon@3x.png'
import mineBgIcon from '../../imgs/new_icons/MineBgIcon@3x.png'
import { scaleSize } from '../../ScreenUtils'
import youjiIcon from '../../imgs/new_icons/youjiIcon@3x.png'
import attentionIcon from '../../imgs/new_icons/attentionIcon@3x.png'
import messageIcon from '../../imgs/new_icons/messageIcon@3x.png'
import aboutIcon from '../../imgs/new_icons/aboutIcon@3x.png'
import rightIcon from '../../imgs/new_icons/nextIcon@3x.png'
 
import { wndWidth, drawerWidth,wndHeight } from '../../Global'

let menu_0 = [{ img: youjiIcon, lbl: '我的游记', name: 'youji' },
    { img: attentionIcon, lbl: '关注的游记', name: 'attention' },
    { img: messageIcon, lbl: '我的消息', name: 'message', isBottom: true }];
let menu_1 =[{img: aboutIcon, lbl: '关于', name: 'about' }];

export default class MineFragment extends React.Component
{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render(){
        let renderMenuItem = this.renderMenuItem.bind(this);
        let pages_0 = [];

        for (let i = 0; i < menu_0.length; i++)
        {
            if (!menu_0[i].isBottom) {

                pages_0.push(renderMenuItem(menu_0[i], i));
            }else {
                pages_0.push(renderMenuItem(menu_0[i], i));
            }
        }
        let pages_1 =[];
        for (let i = 0; i<menu_1.length;i++)
        {
            pages_1.push(renderMenuItem(menu_1[i],i));
        }

        return(
            <View style={{flex: 1,backgroundColor:'#f5f5f5'}}>
                <TouchableOpacity>
                    <Image style={{height: scaleSize(430),width:wndWidth}} source={mineBgIcon}/>

                </TouchableOpacity>
                <View style={{backgroundColor:'#dcdcdc',height:scaleSize(120),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'#474646',fontFamily:'PingFang Medium',fontSize:scaleSize(24)}}>"一个人的旅行,在路上遇见最真实的自己"</Text>
                    <Image style={{height: scaleSize(40),width:scaleSize(40),marginLeft:scaleSize(10)}} source={signatureIcon}/>
                </View>

                <View style={{position:'absolute',top: scaleSize(78),flexDirection:'row-reverse',justifyContent:'center',
                      alignItems:'center',width: wndWidth,backgroundColor:'transparent',height:scaleSize(48)}}>
                    <Image style={{height: scaleSize(48),width:scaleSize(48),position:'absolute',left:scaleSize(40)}} source={settingIcon}/>
                    <Image style={{height:scaleSize(30),width:scaleSize(30),marginLeft:scaleSize(10)}} source={sexIcon}></Image>
                    <Text style={{backgroundColor:'transparent',color:'#FFFFFF',fontSize:scaleSize(30)}}>米米蜜蜜</Text>
                </View>
                <View style={{height:scaleSize(120),width:wndWidth,position:'absolute',backgroundColor:'transparent',top:scaleSize(340),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                      <TouchableOpacity style={{flexDirection:'column-reverse',position:'absolute',left:(wndWidth/2-scaleSize(120))/2,top: 0}}>
                          <Text style={{color: '#ffffff',fontSize:scaleSize(24),textAlign:'center'}}>粉丝</Text>
                          <Text style={{color: '#ffffff',fontSize:scaleSize(30),textAlign:'center'}}>30</Text>
                      </TouchableOpacity>
                    <Image style={{borderRadius:scaleSize(60),height: scaleSize(120),width: scaleSize(120),borderWidth:1,borderColor:'#ffffff'}} source={default_headerIcon}/>
                    <TouchableOpacity style={{flexDirection:'column-reverse',position:'absolute',right:(wndWidth/2-scaleSize(120))/2,top: 0}}>
                        <Text style={{color: '#ffffff',fontSize:scaleSize(24),textAlign:'center'}}>关注</Text>
                        <Text style={{color: '#ffffff',fontSize:scaleSize(30),textAlign:'center'}}>36</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height:scaleSize(304),backgroundColor:'#FFFFFF'}}>
                    {pages_0}
                </View>
                <View style={{flex:1,marginTop:scaleSize(20),backgroundColor:'#ffffff'}}>
                    {pages_1}
                </View>

            </View>
        )
    }

    renderMenuItem(data, idx)
    {
        return (
            <TouchableOpacity key={idx} style={data.isBottom?styles.drawerBottomContent:styles.drawerContent}
                              onPress={() => { clickMenuItem(data.name) } }>
                <Image style={styles.drawerIcon} source={data.img} resizeMode="stretch"/>
                <Text style={styles.drawerText}>
                    {data.lbl}
                </Text>
                <Image source={rightIcon} style={{height:scaleSize(40),width:scaleSize(40),position:'absolute',right:scaleSize(18),top:scaleSize(28)}}></Image>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    drawerText: {
        fontSize: scaleSize(30),
        marginLeft: scaleSize(14),
        textAlign: 'left',
        color: '#595858',
        fontWeight:'bold'
    },
    drawerIcon: {
        width: scaleSize(44),
        height: scaleSize(44),
    },
    drawerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height:scaleSize(100),
        borderBottomWidth: scaleSize(2),
        borderBottomColor: '#e2e2e2',
        width:wndWidth-scaleSize(30),
        marginLeft:scaleSize(30)
    },
    drawerBottomContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height:scaleSize(100),
        width:wndWidth-scaleSize(30),
        marginLeft:scaleSize(30)
    },
});