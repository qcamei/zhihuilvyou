import React, { Component } from 'react';
import
{
    View,
    Platform

} from 'react-native'
import QRCode from 'react-native-qrcode'
import DeviceInfo from 'react-native-device-info'
import HeadBar from '../components/HeadBar'
import { wndWidth, wndHeight } from '../Global'

export default class QrInfo extends Component
{
    constructor(props)
    {
        super(props);
        if (Platform.OS == 'android')
        {
            this.qrinfo={uniqueid:DeviceInfo.getIMEI(),IMEI:DeviceInfo.getIMEI()};
        }else {
            this.qrinfo={uniqueid:DeviceInfo.getUniqueID(),IMEI:DeviceInfo.getUniqueID()};
        }

    }
    render()
    {
        const {navigator} = this.props;
        return (
            <View style={{ height: wndHeight, width: wndWidth, backgroundColor: '#f3f4f6' }}>
                <HeadBar
                    title='设备二维码'
                    leftIcon={require('../imgs/icons/backIcon@2x.png')}
                    leftText='返回'
                    navigator={navigator}
                    />
                <View style={{ width: wndWidth, height: 0.8*wndHeight ,alignItems:'center',justifyContent:'center'}} >
                    <QRCode
                    
                        value={JSON.stringify(this.qrinfo) }
                        size={200}
                        bgColor='#000000'
                        fgColor='white' />
                </View>
            </View>
        );
    };
}