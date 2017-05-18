/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  Linking,
  View,
    TouchableOpacity,
    Platform
} from 'react-native';

// import {checkVersion} from '../Global'
import { connect } from 'react-redux';
import HeadBar from '../components/HeadBar';
import Button from '../components/Button';
import DeviceInfo from 'react-native-device-info'
const aboutLogo = require('../imgs/ic_launcher.png');
const aboutMobile = require('../imgs/icons/about_mobile.png');
// const rightIcon = require('../imgs/icons/rightNextIcon@2x.png');

import {wndWidth} from '../Global';

class About extends React.Component {
  // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {
      };
    }
  // onPress(num) {

  //   Linking.openURL("tel:"+(this.props.sa_info&&this.props.sa_info.telephone?this.props.sa_info.telephone:""));
  // }
  render() {
    const { navigator } = this.props;
    return (
      <View style={[styles.container,{backgroundColor:'#fafafa'}]}>
        <HeadBar
          title="关于"
          leftIcon={require('../imgs/icons/backIcon@2x.png')}
          leftText="返回"
          navigator = {navigator}
        />
        <View style={styles.content}>
          <View style={styles.center}>
            <Image
              style={styles.logo}
              source={aboutLogo}
            />
            <Text style={styles.title}>
              胡里山 智慧旅行
            </Text>
            <Text style={styles.version}>
              {"版本：" + DeviceInfo.getVersion()}
            </Text>
          </View>
          {
          //  Platform.OS == 'android'?
          //      <TouchableOpacity style={{backgroundColor:'#ffffff',width:wndWidth,justifyContent:'center',height:53,marginTop:10}} onPress={checkVersion}>
          //        <Text style={[styles.textContent,{marginLeft:30}]}>检查更新</Text>
          //        <Image style={{height:20,width:10,position:'absolute',right:10,top:16.5}} source ={rightIcon}/>
          //      </TouchableOpacity>
          //      :
          //      null
          }
          <View style={styles.bottomContainer}>
              
            <Text style={[styles.disclaimer, { color: '#c2c2c2', marginTop:17}]}>
              开发者信息
            </Text>
            <View style={{backgroundColor:'#ffffff',width:wndWidth,alignItems:'center',height:53,justifyContent:'center',marginTop:10}}>
              <Text style={styles.textContent}>厦门日华网络科技有限公司</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
        /*<Text style={[styles.disclaimer, { color: '#c2c2c2' }]}>
                联系我们
              </Text>
            <View style={styles.sourceContent}>
              <View style={{backgroundColor:'#ffffff',flexDirection:'column',width:wndWidth}}>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center',height:53}} onPress={this.onPress.bind(this)}>
                  <Image style={{height:30,width:30,marginLeft:10}} source={aboutMobile}/>
                  <Text style={[styles.textContent,{marginLeft:15}]}>{this.props.sa_info&&this.props.sa_info.telephone?this.props.sa_info.telephone:""}</Text>
                  <Text style={[styles.textContent,{marginRight:10}]}>胡里山服务中心</Text>
                  <Image style={{height:20,width:10,position:'absolute',right:10,top:16.5}} source ={rightIcon}/>
                </TouchableOpacity>
                
              </View>
            </View>*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    // backgroundColor: '#fcfcfc',
    justifyContent: 'center',
    paddingBottom: 10
  },
  center: {
    //flex: 1,
    alignItems: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 47,
    borderRadius:10
  },
  version: {
    fontSize: 17,
    textAlign: 'center',
    color: '#d5d5d5',
    marginTop: 15
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#535353',
    marginTop: 22
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4e4e4e'
  },
  disclaimerContent: {
    flexDirection: 'column'
  },
  disclaimer: {
    fontSize: 17,
    textAlign: 'center',
    marginLeft:10
  },
  sourceContent: {
    flexDirection: 'row',
    marginTop: 10
  },
  source: {
    fontSize: 12,
    textAlign: 'center'
  },
  bottomContainer: {
    alignItems: 'flex-start',
    flex:1,
    marginTop:20
  },
  textContent:{
    color:'#4b4b4b',
    fontSize:16
  }
});

// function select(store)
// {
//     return {
//         sa_info: store.scenicStore.sa_info,
//     }
// }
// export default connect(select)(About);
export default About;
