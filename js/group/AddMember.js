import React, { Component } from 'react';
import
{
    View,
    Image,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    Text,
    Platform,
    Keyboard
} from 'react-native'
import { connect } from 'react-redux';

let sexid = 0;
let info = {};
let mT = (Platform.OS === 'android' && Platform.Version <= 19) ? 0 : (Platform.OS === 'android' ? 24 : 0);
import { wndWidth, wndHeight } from '../Global';
import HeadBar from '../components/HeadBar'
import * as clientModel from '../Net/clientModel';
import { toastShort } from '../utils/ToastUtil';
class AddMember extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            touristName: '',
            touristPhone: '',
            sexid: 0,
            textfield: 0,

        };
        this.isRequest = false;
    }
    render()
    {
        const {navigator} = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f3f4f6', flexDirection: 'column' }}>
                <HeadBar
                    title='增加团员'
                    leftIcon={require('../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    rightText="完成"
                    rightClick={() => this.rightClick()}
                    navigator={navigator}
                    />
                <View style={{ marginTop: 10, backgroundColor: 'white', marginLeft: 15, marginRight: 15, height: 0.26 * wndHeight, borderRadius: 8, }}>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 20, }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>姓名</Text>
                        </View>
                        <TextInput style={{ flex: 2, fontSize: 16 }}
                            ref={(ref) => { this.input1 = ref; } }
                            placeholder="输入游客名字"
                            underlineColorAndroid='transparent'
                            autoFocus={true}

                            onChangeText={(touristName) => this.setState({ touristName })}

                            />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                        <View style={{ justifyContent: 'center', marginLeft: 20, flex: 1 }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>手机号码</Text>
                        </View>
                        <TextInput style={{ flex: 2, fontSize: 16 }}
                            ref={(ref) => { this.input2 = ref; } }
                            placeholder="输入游客手机号"
                            maxLength={11}
                            onBlur={Keyboard.dismiss}
                            keyboardType="numeric"
                            underlineColorAndroid='transparent'
                            onChangeText={(touristPhone) => this.setState({ touristPhone })}
                            />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', }}>
                        <View style={{ justifyContent: 'center', marginLeft: 20, flex: 1 }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>性别</Text>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }} >
                            <TouchableOpacity onPress={this.manButton.bind(this)} style={{ marginRight: 60 }}>
                                <Image source={this.state.sexid == 0 ? require('../imgs/icons/select_man@2x.png') : require('../imgs/icons/unselect_man@2x.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.womanButton.bind(this)}>
                                <Image source={this.state.sexid == 1 ? require('../imgs/icons/select_woman@2x.png') : require('../imgs/icons/unselect_woman@2x.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 40, width: wndWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <TouchableOpacity onPress={() => { this.addmember() } } style={{flex:1}}>
                        <View style={{ flex:1,marginLeft:30,marginRight:30, height: 40, backgroundColor: 'blue', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>继续添加</Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>
            </View>
        )
    }
    // <TouchableOpacity onPress={() => { } }>
    //                     <View style={{ width: 100, height: 40, backgroundColor: 'blue', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
    //                         <Text style={{ fontSize: 16, color: 'white' }}>批量添加</Text>
    //                     </View>
    //                 </TouchableOpacity>
    check()
    {

    }
    rightClick()
    {
        if (this.state.touristName == '' || this.state.touristName == '')
        {
            toastShort("名字或手机不能为空");
            return;
        }
        if (this.state.touristPhone.length < 11)
        {
            toastShort("手机格式不正确");
            return;
        }
        this.isRequest = true;
        clientModel.add_member({ group_id: this.props.groupid, datas: [{ true_name: this.state.touristName, sex: this.state.sexid, birthdate: '', phone: this.state.touristPhone }] });
        this.closeAfterAdd = true;
    }
    /**属性变化 */
    componentWillReceiveProps(nextProps)
    {
    
        if (this.closeAfterAdd && nextProps.operateNotify && nextProps.operateNotify.indexOf('addmember') >= 0)
        {
            this.isRequest = false;
            this.closeAfterAdd = false;
            this.props.navigator.pop();
        }
    }
    addmember()
    {

        if (this.state.touristName == '' || this.state.touristName == '')
        {
            toastShort("名字或手机不能为空");
            return;
        }
        if (this.state.touristPhone.length < 11)
        {
            toastShort("手机格式不正确");
            return;
        }

        clientModel.add_member({ group_id: this.props.groupid, datas: [{ true_name: this.state.touristName, sex: this.state.sexid, birthdate: '', phone: this.state.touristPhone }] });
        this.input2.clear();
        this.input1.clear();

        this.setState({ touristName: '' });
        this.setState({ touristPhone: '' });

    }
    manButton()
    {
        this.setState({ sexid: 0 })
    }
    womanButton()
    {
        this.setState({ sexid: 1 })
    }
}
function select(store)
{
    return {
        operateNotify: store.userStore.operateNotify,
    }

}
export default connect(select)(AddMember);