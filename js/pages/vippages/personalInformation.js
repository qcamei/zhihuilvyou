/**
 * Created by os on 16/12/1.
 */
import React from 'react';
import
{
    StyleSheet,
    Text,
    TouchableHighlight,
    DrawerLayoutAndroid,
    Image,
    Platform,
    View,
    DeviceEventEmitter,
    TouchableOpacity,
    CustomButton,
    Modal
} from 'react-native';
import HeadBar from '../../components/HeadBar';
import { connect } from 'react-redux';
import changeName from './changename';
import changeMobile from './changeMobile';
import ResetPassword from './reset_password'
var ImagePicker = require('react-native-image-picker');
import DateTimePicker from 'react-native-modal-datetime-picker' //时间
import backIcon from '../../imgs/icons/backIcon@2x.png'
  import rightNextIcon from '../../imgs/icons/rightNextIcon@2x.png'
import {wndWidth} from "../../Global";
import {httpServerAdd} from '../../config';
import ChinaRegionWheelPicker from 'rn-wheel-picker-china-region';
import * as clientModel from '../../Net/clientModel'
import ActionSheet from '@exponent/react-native-action-sheet';
import {toastShort} from '../../utils/ToastUtil'
var FileUpload = require('NativeModules').FileUpload;
var imageOptions = {
    title: '选择头像',
    takePhotoButtonTitle: '相机',
    chooseFromLibraryButtonTitle: '相册',
    maxWidth: 500,
    maxHeight: 500,
    quality: 1,
    allowsEditing: true,
    cancelButtonTitle:'取消'
};


class personalInformation extends React.Component {

    constructor(props) {
        super(props);
        let now = new Date();
        this.state = {
            modalVisible: false,
            pro: '',   //省
            con: '',     //市
            phonenum: this.props.user.mobile, //存储手机号码
            year: '',
            month: '',
            day: '',
            isDateTimePickerVisible: false,
            isPickerVisible: false,
            // userid:this.props.user.userid,
            userface: this.props.user.userface,
            nickname: this.props.user.nickname,
            sex: this.props.user.sex,
            birthdate: this.props.user.birthdate && this.props.user.birthdate.split("-") && this.props.user.birthdate.split("-").length > 0 ? now.getFullYear() - parseInt(this.props.user.birthdate.split("-")[0]) : 0,
            mobile: this.props.user.mobile ? this.props.user.mobile.substring(0, 3) + '****' + this.props.user.mobile.substring(7, 11) : "",
            address: this.props.user.address,
            showPicke: false,
            // isrenter:this.props.user.isrenter,
             istourguide:this.props.user.istourguide,
            // travelofficeid:this.props.user.travelofficeid
        };
        this.renderCell = this.renderCell.bind(this);
        this._onPressPhoto = this._onPressPhoto.bind(this);
        this._onUpdateData = this._onUpdateData.bind(this);
        this._customBtn = this._customBtn.bind(this);
    }


    //title:String 可以传字符串
    _pressButton(index) {
        const {navigator} = this.props;
        switch (index) {
            case 0:
            {

                this._onPressPhoto()
            }
                break;
            case 1:
                navigator.push({
                    component: changeName,
                    name: 'changeName',
                    params: {
                        text: this.state.nickname
                    }
                });
                break;
            case 2:
            {
                if (this.state.istourguide != 1){ //判断是否是导游
                    this._customBtn()
                }else {
                    toastShort('已从导游信息获取')
                }

            }
                break;
            case 3:
            {
                if (this.state.istourguide != 1){
                    this._showDateTimePicker()
                }else {
                    toastShort('已从导游信息获取')
                }

            }
                break;
            case 4:
                this.setState({isPickerVisible: true}); //显示城市选择器(一定要)
                break;
            case 5:
                navigator.push({
                    component: changeMobile,
                    name: 'changeMobile',
                    params: {
                        mobile: this.state.phonenum,
                    }
                });
                break;
            case 6:
                navigator.push({
                    component: ResetPassword,
                    name: 'ResetPassword'
                });
                break;
            default:
                break;
        }

    }
    /***************性别**************/

    _customBtn() {

        this.setModalVisible(true)
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    onselectSex(sex) {
        let newData = {
            ...this.props.user,
            sex: sex,
        };
        this._onUpdateData(newData);
        this.setModalVisible(false)
    }
    /********************************/
    //选择图片上传
    _onPressPhoto() {

        ImagePicker.showImagePicker(imageOptions, (response) => {
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            }
            else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            }
            else {
                 //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                //let userface = response.uri;
                if (Platform.OS === 'ios') {
                    let userface = response.uri.replace('file://', '');
                    this.uploadImage(userface);
                }else {
                    this.uploadImage(response.path);
                }


            }
        })
    }

    uploadImage(path) {
        let temp = path.split(".");
        let filename;
        if (temp.length > 1)
            filename = this.props.user.userid.toString() + "." + temp[temp.length - 1];
        var obj = {
            uploadUrl: httpServerAdd + "upload/userface",
            method: 'POST', // default 'POST',support 'POST' and 'PUT'
            headers: {
                'Accept': 'application/json',
            },
            fields: {
                'userid': filename,
            },
            files: [
                {
                    // name: this.props.user.userid, // optional, if none then `filename` is used instead
                    filename: filename, // require, file name
                    filepath: path, // require, file absoluete path
                    // filetype: 'images', // options, if none, will get mimetype from `filepath` extension
                },
            ]
        };
        let self = this;
        FileUpload.upload(obj, function (err, result) {
            if (err) {


                toastShort("图片上传失败！1")
            }
            else {
                try {
                    let data = JSON.parse(result.data);
                    if (data && data.status == 0) {
                        let userface = data.path + "?v=" + Math.round(Math.random() * 10000);
                        let newData = {
                            ...self.props.user,
                            userface

                        };
                        self._onUpdateData(newData);
                    }
                    else {
                        toastShort("图片上传失败2");
                    }
                }
                catch (e) {
                    toastShort("图片上传失败3");
                }
            }
        })
    }

    _onUpdateData(data) {
        clientModel.userinfo_update(data);
    }

    renderCell(index, leftTitle, rightTitle) {
        return (
            <TouchableHighlight style={styles.TouchBtn} onPress={this._pressButton.bind(this,index)}>
                <View>
                    <View style={styles.firstfloorview}>
                        <View style={styles.secondfloortext}>
                            <Text style={styles.textfloor}>{leftTitle}</Text>
                        </View>
                        <View>
                            <Text style={styles.textfloorright}>{rightTitle}</Text>
                        </View>
                        <Image style={styles.thumb} source={rightNextIcon}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const { navigator } = this.props;
        var modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        };
        return (
            <View style={{flex: 1,backgroundColor:'#f3f4f6',flexDirection:'column'}}>
                <View style={styles.container}>
                    <HeadBar
                        title='个人资料'
                        leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                        leftText="返回"
                        navigator={navigator}
                    />
                </View>

                <View style={{marginTop:20}}>
                    <TouchableHighlight style={[styles.TouchBtn ,{height:66.5}]}
                                        onPress={this._pressButton.bind(this,0)}>
                        <View>
                            <View style={[styles.firstfloorview,{height:66.5}]}>
                                <View style={styles.secondfloortext}>
                                    <Text style={styles.textfloor}>更换头像</Text>
                                </View>
                                <View>
                                    <Image style={styles.imagePhoto} resizeMode={'cover'}
                                           source={!this.state.userface || this.state.userface==""?require('../../imgs/icons/defaultPhoto@2x.png'):
                                {uri:httpServerAdd + this.state.userface}}/>
                                </View>
                                <Image style={styles.thumb} source={rightNextIcon}/>

                            </View>

                        </View>
                    </TouchableHighlight>
                    <View style={styles.separator}/>
                    {this.renderCell(1, "昵称", this.state.nickname)}
                </View>
                <View style={{marginTop:20}}>

                    {this.renderCell(2, "性别", this.state.sex == 0 ? "男" : "女")}

                    <View style={styles.separator}/>
                    {this.renderCell(3, "年龄", this.state.birthdate)}
                    <View style={styles.separator}/>
                    {this.renderCell(4, "地区", this.state.address)}
                </View>
                <View style={{marginTop:20}}>
                    {this.renderCell(5, "手机号", this.state.mobile)}
                    <View style={styles.separator}/>
                    {this.renderCell(6, "修改密码")}
                </View>


                <View style={styles.CityContainer}>

                    <ChinaRegionWheelPicker
                        isVisible={this.state.isPickerVisible}
                        navBtnColor={'red'}
                        selectedProvince={this.state.pro?this.state.pro:'广东'}
                        selectedCity={this.state.con?this.state.con:'深圳'}
                        //selectedArea={'福田区'}
                        transparent
                        animationType={'fade'}
                        onSubmit={this._onPressSubmit.bind(this)}
                        onCancel={this._onPressCancel.bind(this)}
                    />

                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={this._showDateTimePicker.bind(this)}>
                    </TouchableOpacity>
                    <DateTimePicker
                        minimumDate={new Date(1965, 4, 25)}
                        maximumDate={new Date()}
                        mode="date"
                        date={new Date(this.state.year, this.state.month,this.state.day)}
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked.bind(this)}
                        onCancel={this._hideDateTimePicker.bind(this)}
                    />
                </View>

                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    <View style={[{flex: 1,backgroundColor:`rgba(0,0,0,0.5)`}]}>
                        <TouchableOpacity style={{flex: 1,justifyContent: 'center',padding: 40}} onPress={() => {
                            this.setModalVisible(!this.state.modalVisible)}}>
                        <View style={[{height:160,backgroundColor:'#ffffff'}]}>
                            <Text style={[styles.sexText,{fontSize:24,color: '#00ffff'}]}>选择性别</Text>
                            <View style={{height:2,backgroundColor: '#00ffff'}} ></View>
                            <TouchableHighlight onPress={() => {
                                this.onselectSex(0)
                                    }} underlayColor="#a9d9d4">
                                <Text style={styles.sexText}>男</Text>
                            </TouchableHighlight>
                            <View style={{height:0.5,backgroundColor: '#f0f8ff'}}></View>
                            <TouchableHighlight onPress={() => {
                            this.onselectSex(1)
                                   }} underlayColor="#a9d9d4">
                                <Text style={styles.sexText}>女</Text>
                            </TouchableHighlight>
                        </View>
                    </TouchableOpacity>
                    </View>
                </Modal>


            </View>
        )
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {

        let newData = {
            ...this.props.user,
            birthdate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        };

        this._onUpdateData(newData);
        this._hideDateTimePicker();

    };


    // 城市选择器的确定
    _onPressSubmit(params) {
        this.setState({isPickerVisible: false, pro: params.province, con: params.city});
        // this.setState({ address: `${params.province}${params.city}${params.area}` });
        let newData = {
            ...this.props.user,
            address: `${params.province}${params.city}`
        };
        this._onUpdateData(newData);
    }

    //城市选择器取消
    _onPressCancel() {
        this.setState({isPickerVisible: false});
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.user) {
            let now = new Date();
            console.warn("bir",nextprops.user.birthdate);
            this.setState({
                "userface": nextprops.user.userface,
                "nickname": nextprops.user.nickname,
                "sex": nextprops.user.sex,
                "birthdate": nextprops.user.birthdate && nextprops.user.birthdate.split("-") && nextprops.user.birthdate.split("-").length > 0 ? now.getFullYear() - parseInt(nextprops.user.birthdate.split("-")[0]) : 0,
                "mobile": nextprops.user.mobile ? nextprops.user.mobile.substring(0, 3) + '****' + nextprops.user.mobile.substring(7, 11) : '',
                "address": nextprops.user.address,
                "phonenum": nextprops.user.mobile,
                year: nextprops.user.birthdate && nextprops.user.birthdate.split("-") && nextprops.user.birthdate.split("-").length > 0 ?nextprops.user.birthdate &&nextprops.user.birthdate.split("-")[0]:now.getFullYear(),
                month:nextprops.user.birthdate && nextprops.user.birthdate.split("-") && nextprops.user.birthdate.split("-").length > 0 ? nextprops.user.birthdate.split("-")[1]:now.getMonth()+1,
                day: nextprops.user.birthdate && nextprops.user.birthdate.split("-") && nextprops.user.birthdate.split("-").length > 0 ?nextprops.user.birthdate.split("-")[2]:now.getDate()+1,
            })
        }
    }


    componentDidMount() {
        //修改名称
        this.textAddListen = DeviceEventEmitter.addListener('text', (text)=> {
            let newData = {
                ...this.props.user,
                nickname: text,
            };
            this._onUpdateData(newData);

        });
        //修改手机号码
        this.mobileAddListen = DeviceEventEmitter.addListener('mobile', (mobile)=> {
            let newData = {
                ...this.props.user,
                mobile: mobile,
            };
            this._onUpdateData(newData);
        });
    }

    componentWillUnMount()
    {
        this.mobileAddListen.remove();
        this.textAddListen.remove();
    }
}


const styles = {
    container: {
        backgroundColor: '#f3f4f6',
        position: 'relative'
    },
    thumb: {
        width: 10,
        height: 16,
        marginRight: 5
    },
    separator: {
        height: 0.6,
        backgroundColor: '#d5d5d5',
    },
    TouchBtn: {
        backgroundColor: '#ffffff',

    },
    firstfloorview: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: 50
    },
    secondfloortext: {
        flex: 2,
        paddingLeft: 10,

    },
    textfloor: {
        fontSize: 14,
        //marginRight:14,
        //fontFamily:'PingFang-SC-Medium',
        color: '#303030',
        textAlign: 'left',
        //marginLeft:10
    },
    textfloorright: {
        fontSize: 14,
        marginRight: 14,
        //fontFamily:'PingFang-SC-Medium',
        color: '#303030',
        textAlign: 'left'
    },
    exitButton: {
        width: wndWidth - 40,
        height: 50,
        backgroundColor: '#02b3d3',
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: 48,

    },
    imagePhoto: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25
    },
    CityContainer: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottom: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    sexText: {
        fontSize: 20,
        textAlign: 'left',
        height: 40,
        color: '#000000',
        marginLeft: 20,
        marginTop:10
    }

};
function select(store) {
    return {
        user: store.userStore.user,
    }
}

export default connect(select)(personalInformation);