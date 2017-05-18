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
    InteractionManager
} from 'react-native'
import { wndWidth, wndHeight } from '../Global';
import HeadBar from '../components/HeadBar'
import * as clientModel from '../Net/clientModel';
import { connect } from 'react-redux';
import { toastShort } from '../utils/ToastUtil';
let sexid = 0;
class NfcAbandon extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            touristName: '',
            touristPhone: '',
            manselect: true,
            womanselect: false,
        }
    }
    componentDidMount()
    {

        
        if (this.props.group_list[this.props.groupid])
        {
            for (let i = 0; i < this.props.group_list[this.props.groupid].length; i++)
            {
                if (this.props.group_list[this.props.groupid][i].id == this.props.memberid)
                {

                    this.setState({ touristName: this.props.group_list[this.props.groupid][i].true_name, touristPhone: this.props.group_list[this.props.groupid][i].phone });
                    if (this.props.group_list[this.props.groupid][i].sex == 1)
                    {
                        this.setState({ manselect: false, womanselect: true })
                    }
                }
            }
        }


    }
    render()
    {

        const {navigator} = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f3f4f6', flexDirection: 'column' }}>
                <HeadBar
                    title='修改资料'
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
                            value={this.state.touristName}
                            placeholderTextColor={'black'}
                            ref={(ref) => { this.tx = ref } }
                            underlineColorAndroid='transparent'
                            onChangeText={(touristName) => this.setState({ touristName })}

                            />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                        <View style={{ justifyContent: 'center', marginLeft: 20, flex: 1 }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>手机号码</Text>
                        </View>
                        <TextInput style={{ flex: 2, fontSize: 16 }}
                            value={this.state.touristPhone}
                            placeholderTextColor={'black'}
                            maxLength={11}
                            underlineColorAndroid='transparent'
                            keyboardType="numeric"
                            onChangeText={(touristPhone) => this.setState({ touristPhone })}
                            />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', }}>
                        <View style={{ justifyContent: 'center', marginLeft: 20, flex: 1 }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>性别</Text>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }} >
                            <TouchableOpacity onPress={this.manButton.bind(this)} style={{ marginRight: 60 }}>
                                <Image source={this.state.manselect ? require('../imgs/icons/select_man@2x.png') : require('../imgs/icons/unselect_man@2x.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.womanButton.bind(this)}>
                                <Image source={this.state.womanselect ? require('../imgs/icons/select_woman@2x.png') : require('../imgs/icons/unselect_woman@2x.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
    //    <View style={{ marginTop: 40, width: wndWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
    //                 <View style={{ width: 100, height: 40, backgroundColor: 'blue', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
    //                     <Text style={{ fontSize: 16, color: 'white' }}>删除</Text>
    //                 </View>
    //                 <View style={{ width: 100, height: 40, backgroundColor: 'blue', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
    //                     <Text style={{ fontSize: 16, color: 'white' }}>解绑NFC</Text>
    //                 </View>
    //             </View>
    rightClick()
    {
        if (this.state.manselect)
        {
            this.sexid = 0;
        }
        if (!this.state.manselect)
        {
            this.sexid = 1;
        }
        if (this.state.touristPhone.length < 11)
        {
            toastShort("手机格式不正确");
            return;
        }
        clientModel.modify_member({ group_id: this.props.groupid, id: this.props.memberid, true_name: this.state.touristName, sex: this.sexid, birthdate: '', phone: this.state.touristPhone })

    }
    componentWillReceiveProps(nextProps)
    {
        if (nextProps && nextProps.operateNotify && nextProps.operateNotify.indexOf('modifymember') >= 0)
        {
            this.props.navigator.pop();
        }
    }
    manButton()
    {
        this.setState({ manselect: !this.state.manselect, womanselect: !this.state.womanselect })
    }
    womanButton()
    {
        this.setState({ manselect: !this.state.manselect, womanselect: !this.state.womanselect })
    }
}
function select(store)
{
    return {
        group_list: store.userStore.group_list,
        operateNotify: store.userStore.operateNotify,
    }
}
export default connect(select)(NfcAbandon);