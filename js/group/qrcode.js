'use strict';

import React, { Component } from 'react'
import Barcode from 'react-native-smart-barcode'
import { wndWidth, wndHeight } from '../Global'
import HeadBar from '../components/HeadBar'
import
{
  Vibration,
  AppRegistry,
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  Platform,
  InteractionManager
} from 'react-native';
import { toastShort } from '../utils/ToastUtil';
import * as clientModel from '../Net/clientModel';
import Toast from '@remobile/react-native-toast'
export default class BarcodeScannerApp extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      show: false
    };
  }


  _onBarCodeRead = (e) =>
  {
    Vibration.vibrate();
    let val = e.nativeEvent.data.code;
    try{
      let obj = JSON.parse(val);
      if(!obj.IMEI)
      {
        //toastShort('请扫设备二维码');
        Toast.showShortBottom("请扫设备二维码");
        return;
      }
      clientModel.bund_device({ "group_id": this.props.groupid, "id": this.props.memberid, "device_num": obj.IMEI });
      this._stopScan();
      this.props.navigator.pop();
    }
    catch(e)
    {
      //toastShort('请扫设备二维码');
      Toast.showShortBottom("请扫设备二维码");
    }
  };
  
  // sendinfo(code)
  // {
  //   clientModel.bund_device({ "group_id": this.props.groupid, "id": this.props.memberid, "device_num": code });
  // }
  _stopScan = (e) =>
  {
    this._barCode.stopScan()
  };
  componentDidMount()
  {
    InteractionManager.runAfterInteractions(() =>
    {
      this.setState({ show: true });
    })
  }
  componentWillUnMonut()
  {
    this._stopScan();
    this.setState({ show: false })
  }
  render()
  {

    const {navigator} = this.props;
    if (!this.state.show)
    {
      return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />
    }
    return (
      <View style={styles.container}>
        <HeadBar
          title='设备二维码'
          leftIcon={require('../imgs/icons/backIcon@2x.png')}
          leftText='返回'
          navigator={navigator}
          />

        <Barcode style={{ flex: 1, }}
          ref={component => this._barCode = component}
          onBarCodeRead={this._onBarCodeRead} />
      </View>
    )

  }
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  statusBar: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  statusBarText: {
    fontSize: 20,
  },
});