/**
 * Created by os on 16/12/22.
 */
import React from 'react';
import
{
    View,
    Text,
    Image,
    TextInput,
    ListView,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';

import HeadBar from '../../components/HeadBar'
import { toastShort } from '../../utils/ToastUtil';
import * as clientModel from '../../Net/clientModel'
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker' //时间
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import rent_mobile from '../../imgs/icons/rent_mobile.png'
import rent_num from '../../imgs/icons/rent_num.png'
import rent_time from '../../imgs/icons/rent_time.png'
import rent_backtime from '../../imgs/icons/rent_backtime.png'
import rent_add from '../../imgs/icons/rent_add.png'
import rent_sub from '../../imgs/icons/rent_sub.png'
import rent_money from '../../imgs/icons/rent-money.png'
import rent_next from '../../imgs/icons/rent_next.png'
import { formatTime } from '../../utils/FormatUtil';
import {httpServerAdd} from '../../config';
import {infoLoaded,wndHeight,wndWidth} from "../../Global";
import {isEqual} from "../../utils/CommonUtil"


class rent_device extends React.Component
{
    // 构造
    constructor(props)
    {
        super(props);
        // 初始状态
        this.state = {
            tagBtn: 0, //用来标识选中的是那一个时间选择器
            device_num: 1,
            price:this.props.device_information.member_price,   //会员单价
            caozuo_price:this.props.device_information.member_price,
            beginTime: '',
            endTime: '',
            imgArr:this.props.device_information.datas,
            isDateTimePickerVisible: false,
            dateTag:'', //用来标识时间选择器的模式
            ZDate:'',//2个用作时间判断
            EDate:''

        };
    }
    _renderDotIndicator()
    {
        return <PagerDotIndicator pageCount={this.state.imgArr.length} />;
    }

    componentDidMount()
    {
        // if(infoLoaded.LOAD_device_information==false){
            clientModel.rent_device();
        // }

    }
    renderImg() {
        var imageViews = [];
        if (this.state.imgArr){
            for (var i = 0; i < this.state.imgArr.length; i++) {

                var imgIndex = this.state.imgArr[i];
                Image.prefetch(httpServerAdd+encodeURI(imgIndex.src_img));
                    imageViews.push(
                        <View key={i}>
                            <Image style={{flex:1}}
                                source={{uri:httpServerAdd+encodeURI(imgIndex.src_img)}}
                            />
                        </View>
                    );

            }
        }
        return imageViews;
    }


        render()
        {
            return (
                <View style={{ flex: 1, backgroundColor: '#f3f4f6', flexDirection: 'column' }}>
                    <HeadBar
                        title='设备租赁'
                        leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                        leftText="返回"
                        navigator={this.props.navigator}
                    />
                    <ScrollView style={{height: wndHeight-120}}>
                        <View style={{ height: 160, backgroundColor: 'white' }}>
                            {this.state.imgArr?<IndicatorViewPager
                                style={{ height: 160 }}
                                indicator={this._renderDotIndicator()}
                            >
                                {this.renderImg()}
                            </IndicatorViewPager>:null}

                        </View>
                        <Text style={styles.TextTitle}>租赁设备信息</Text>
                        <View style={[styles.TextViewBack, { marginTop: 8 }]}>
                            <Image style={[styles.ImageVC, { marginLeft: 14 }]} source={rent_mobile}/>
                            <Text style={styles.TextLeft}>设备名称</Text>
                            <Text
                                style={[styles.TextRight, { position: 'absolute', right: 14, top: 11 }]}>{this.props.device_information.name}</Text>
                        </View>
                        <View style={styles.ViewLine}></View>
                        <View style={styles.TextViewBack}>
                            <Image style={[styles.ImageVC, { marginLeft: 14 }]} source={rent_num}/>
                            <Text style={styles.TextLeft}>订购数量</Text>
                            <View style={{position:'absolute',right: 110,height:46,width:50,flexDirection: 'row', alignItems: 'center'}}>
                                <Image style={{height: 18,width: 16}} source={rent_money} resizeMode="stretch"></Image>
                                <Text style={{fontSize:16,marginLeft:5,color:'#7C7C7C'}}>{this.state.price}</Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', right: 14 ,width:80,height:46}}>
                                <TouchableOpacity onPress={this._onPressSub.bind(this)}>
                                    <Image style={styles.ImageVC} source={rent_sub}/>
                                </TouchableOpacity>
                                {
                                    Platform.OS == 'android'?
                                        <TextInput style={{ textAlign: 'center' ,width :46,height: 46}}
                                                   keyboardType="numeric"
                                                   underlineColorAndroid='transparent'
                                                   onChangeText={(device_num) => this._as(device_num)}
                                        >{this.state.device_num}</TextInput>
                                        :
                                        <TextInput style={{ textAlign: 'center' ,width :36,height: 46,color: '#7C7C7C'}}
                                                   keyboardType="numeric"
                                                   underlineColorAndroid='transparent'
                                                   value = {this.state.device_num.toString()}
                                                   onChangeText={(device_num) => this._as(device_num)}
                                        ></TextInput>
                                }

                                <TouchableOpacity onPress={this._onPressAdd.bind(this)}>
                                    <Image style={styles.ImageVC} source={rent_add}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.ViewLine}></View>

                        <TouchableOpacity style={styles.TextViewBack} onPress={this._showDatePicker.bind(this, 1)}>
                            <Image style={[styles.ImageVC, { marginLeft: 14 }]} source={rent_time}/>
                            <Text style={styles.TextLeft}>预约时间</Text>
                            <Text style={{ position: 'absolute', right: 44, top: 12 }}>{this.state.beginTime}</Text>
                            <Image style={{ height: 20, width: 20, position: 'absolute', right: 14, top: 12 }}
                                   source={rent_next}/>
                        </TouchableOpacity>

                        <View style={styles.ViewLine}></View>

                        <TouchableOpacity style={styles.TextViewBack} onPress={this._showDatePicker.bind(this, 2)}>
                            <Image style={[styles.ImageVC, { marginLeft: 14 }]} source={rent_backtime}/>
                            <Text style={styles.TextLeft}>归还时间</Text>
                            <Text style={{ position: 'absolute', right: 44, top: 12 }}>{this.state.endTime}</Text>
                            <Image style={{ height: 20, width: 20, position: 'absolute', right: 14, top: 12 }}
                                   source={rent_next}/>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#f3f4f6', flexDirection: 'column',flex:1}}>
                            <Text style={[styles.TextTitle, { marginTop: 10, fontSize: 14 }]}>注意事项：</Text>
                            <Text
                                style={[styles.TextTitle, { marginTop: 2, fontSize: 13, lineHeight: 20 }]}>{this.props.device_information.short_content}</Text>
                        </View>

                    </ScrollView>
                    <View style={[styles.TextViewBack, {height: 60,width:wndWidth}]}>
                        <Text style={{ marginLeft: 14, fontSize: 20 }}>订单金额:</Text>
                        <Text
                            style={{ fontSize: 20, color: '#fb941c', marginLeft: 15 }}>{this.state.caozuo_price ? this.state.caozuo_price +'元' : 0.00 + '元'}</Text>

                        <TouchableOpacity style={{ position: 'absolute', right: 0, backgroundColor: '#02b3d3', height: 60, width: 120, alignItems: 'center', justifyContent: 'center'}}
                                          onPress={this._onPressCommit.bind(this)}
                        >
                            <Text style={{ fontSize: 20, color: '#fffefe', textAlign: 'center' }}>提交订单</Text>

                        </TouchableOpacity>

                    </View>




                    <View style={{ flex: 1 }}>
                        <DateTimePicker
                            cancelTextIOS = '取消'
                            confirmTextIOS = '确定'
                            titleIOS = '时间选择'
                            mode={this.state.dateTag ==1 ?"datetime":"datetime"}
                            minimumDate={this.state.dateTag ==1?new Date():new Date(this.state.ZDate)}
                            date={new Date()}
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked.bind(this)}
                            onCancel={this._hideDateTimePicker.bind(this)}
                        />
                    </View>


                </View>

            )
        }



        _showDatePicker = (tag) => this.setState({
            dateTag:tag,
            isDateTimePickerVisible: true,
            tagBtn: tag
        });

        _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

        _handleDatePicked = (date) => {
            if (this.state.tagBtn == 1) {
                this.setState({
                    beginTime:formatTime(date.getTime()),
                    ZDate:date
                })
            }
            if (this.state.tagBtn == 2) {
                this.setState({
                    endTime:formatTime(date.getTime()),
                    EDate:date
                })
            }

            this._hideDateTimePicker();
        };

        _as(num)
        {
            this.setState({
                device_num: num,
                caozuo_price: num * this.state.price
            })
        }

        _onPressCommit()
        {
            var re = /^[1-9]+[0-9]*]*$/;
            var oDate1 = new Date(this.state.ZDate);
            var oDate2 = new Date(this.state.EDate);
            if(oDate1.getTime()<Date.now())
            {
                toastShort('不能预约过去的时间');
                return;
            }
            if(oDate1.getDate()!=oDate2.getDate() || oDate1.getFullYear()!=oDate2.getFullYear() || oDate1.getMonth() != oDate2.getMonth())
            {
                toastShort('归还时间必须与预约时间在同一天');
                return;
            }
            if (re.test(this.state.device_num)) {
                if (this.state.device_num > 0 && this.state.beginTime && this.state.endTime) {
                    if (oDate1.getTime() < oDate2.getTime())
                    {
                        let allData =
                        {
                            product_id:this.props.device_information.id,
                            quality: this.state.device_num,
                            rent_begin: this.state.beginTime,
                            rent_end: this.state.endTime,

                        };
                        clientModel.commit_order(allData);
                    }else
                    {
                        toastShort('归还时间不能在预约时间之前')
                    }

                } else {
                    toastShort('时间不能为空')
                }
            } else {
                toastShort('订购数量不能小于1')
            }


        }
        _onPressAdd()
        {
            this.setState({
                device_num: this.state.device_num + 1,
                caozuo_price: (this.state.device_num + 1) * this.state.price
            })


        }
        _onPressSub()
        {
            if (this.state.device_num > 1) {
                this.setState({
                    device_num: this.state.device_num - 1,
                    caozuo_price: (this.state.device_num - 1) * this.state.price
                })
            } else {
                toastShort('订购数量不能为0')
            }

        }
        componentWillReceiveProps(nextprops)
        {
            if(nextprops.device_information)
            {
                this.setState({
                    imgArr: nextprops.device_information.datas,
                    price:nextprops.device_information.member_price,
                    caozuo_price:nextprops.device_information.member_price
                })
            }
            if (nextprops.operateNotify && nextprops.operateNotify.indexOf('orderSuc')>=0 && !isEqual(nextprops.operateNotify,this.props.operateNotify)){
                this.props.navigator.pop();
            }
        }

}

const styles = {
    TextViewBack: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        flexDirection: 'row',
        height: 46
    },
    ViewLine: {
        height: 0.5,
        backgroundColor: '#d5d5d5'
    },
    ImageVC: {
        height: 18,
        width: 18,
    },
    TextLeft: {
        fontSize: 15,
        color: '#a1a1a1',
        marginLeft: 10
    },
    TextRight: {
        fontSize: 16,
        color: '#656565'
    },
    TextTitle: {
        marginTop: 8,
        marginLeft: 14,
        fontSize: 16,
        color: '#acacac'
    },

};

function select(store){
    return {
        device_information:store.userStore.device_information,
        operateNotify:store.userStore.operateNotify

    }
}
export default connect(select)(rent_device);