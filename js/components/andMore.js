/**
 * Created by os on 17/4/18.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { wndWidth, drawerWidth,wndHeight } from '../Global'
import px2dp from '../utils/px2dp';
import moreIcon  from '../imgs/new_icons/moreIcon@2x.png'
import morePlayIcon from '../imgs/new_icons/morePlay@3x.png'
import pageIcon from  '../imgs/new_icons/icon-1@2x.png'

export default class andMoreView extends React.Component{
    static propTypes = {


        ...View.propTypes,
    }

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }

    render()
    {
        return
        (
         <View style={{backgroundColor:'blue',alignItems:'center'}}>
           <TouchableOpacity style={{width:wndWidth,height:60 ,borderBottomWidth:1,borderBottomColor:'#dadada',flexDirection:'row'}}>
                <Text style={{color: '#df7c4b',fontSize:18}}>厦门各类玩法攻略</Text>
               <Image style={{marginLeft:11}} source={require(moreIcon)}/>
               <Image style={{position:'absolute',right:px2dp(30),height: px2dp(50),width:px2dp(50)}} source={require(morePlayIcon)}/>
           </TouchableOpacity>
             <View style={{backgroundColor:'red',marginTop:px2dp(15),height:px2dp(80),width:px2dp(wndWidth-30)}}>
                 <Image style={{height:px2dp(80),width:px2dp(160)}} source={pageIcon}/>
                 <Text style={{height:px2dp(40),width:px2dp((wndWidth-30)/2),color:'#222226',fontSize:15}}>[鼓浪屿夜景]鼓浪屿的夜显得清净幽雅.尤其是夜的嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿诶</Text>
             </View>
         </View>
        )
    }
}
