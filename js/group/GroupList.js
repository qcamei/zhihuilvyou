import React, { Component } from 'react';
import
{
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    TouchableNativeFeedback,
    Image,
    TextInput,
    InteractionManager,
    Modal,
    Linking,
    Platform
} from 'react-native';
import { wndWidth, wndHeight,showGroupPosFun,setMemberId_getpos } from "../Global"

import HeadBar from '../components/HeadBar';
import AddMember from './AddMember'
import Modify from './nfcabandon'
import { connect } from 'react-redux';
import { isEqual } from '../utils/CommonUtil';
import * as clientModel from '../Net/clientModel';
import QR from './qrcode'
class GroupList extends Component
{
    constructor(props)
    {
        let input = '';

        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        this.deleteid = 0;

        this.state = {
            results: [],
            dataSource: ds,
            selectedID: 0,
            visible: false

        };

    }
    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() =>
        {
            if (this.props.group_list[this.props.groupid])
            {
                let g_List = this.prepareMessages(this.props.group_list[this.props.groupid]);

                this.setState({ dataSource: this.state.dataSource.cloneWithRows(g_List.blob, g_List.keys) })
            }
            //团队成员未加载，去加载
            else
            {
                clientModel.grouplist_load(this.props.groupid);
            }
        })
    }
    componentWillReceiveProps(nextprops)
    {
        if (nextprops.group_list)
        {
          
            let g_List = this.prepareMessages(nextprops.group_list[this.props.groupid]);

            this.setState({ dataSource: this.state.dataSource.cloneWithRows(g_List.blob, g_List.keys) })
        }

        if (nextprops && nextprops.operateNotify && nextprops.operateNotify.indexOf('modifymember') >= 0)
        {

            let g_List = this.prepareMessages(this.props.group_list[this.props.groupid]);
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(g_List.blob, g_List.keys) })
        }
    }
    prepareMessages(messages)
    {
        return {
            keys: messages.map((m) =>
            {
                return m.id;
            }),
            blob: messages.reduce((o, m, i) =>
            {
                o[m.id] = {
            ...m,
            };
        return o;
    }, {})
        };
    }
render()
{
    const {navigator} = this.props;
    return (
        <View style={{ height: wndHeight, width: wndWidth, backgroundColor: 'white' }}>
            <HeadBar
                title='团队成员'
                leftIcon={require('../imgs/icons/backIcon@2x.png')}
                leftText="返回"
                rightIcon={require('../imgs/icons/btn_status.png')}
                rightIconStyle={{ width: 15, height: 20 }}
                navigator={navigator}
                rightClick={this.itemclick.bind(this)}
                />
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => this.closeModal()}
                >

                <View style={[{ flex: 1, justifyContent: 'center', padding: 60, backgroundColor: `rgba(0,0,0,0.5)` }]}>

                    <View style={[{ height: 120, backgroundColor: '#ffffff' }]}>


                        <TouchableHighlight onPress={() => { this.btnsure() } } style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} underlayColor="#a9d9d4">
                            <Text style={{ fontSize: 20, color: '#000000' }}>确定</Text>
                        </TouchableHighlight>
                        <View style={{ height: 1, backgroundColor: '#d5d5d5' }}></View>
                        <TouchableHighlight onPress={() => this.closeModal()} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} underlayColor="#a9d9d4">
                            <Text style={{ fontSize: 20, color: '#000000' }}>取消</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            <View style={{ flexDirection: 'row', width: wndWidth, height: 60, alignItems: 'center', justifyContent: 'center', backgroundColor: '#d5d5d5' }}>
                <View style={{ flexDirection: 'row', width: wndWidth - 40, borderRadius: 10, backgroundColor: 'white', height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../imgs/icons/btn_search.png')} style={{ height: 15, width: 15 }} />
                    <TextInput
                        style={{ fontSize: 16, marginLeft: 10, width: 100 }}
                        placeholder="搜索成员"
                        underlineColorAndroid='transparent'
                        onChangeText={(input) => this.onChangeText(input)}
                        autoCorrect={false}
                        clearButtonMode="always"
                        />
                </View>
            </View>

            <ListView
                ref={(ref) => this.list = ref}
                initialListSize={5}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                showsVerticalScrollIndicator={false}
                enableEmptySections={true}
                renderSeparator={this.renderSeparator.bind(this)}
                />
        </View >
    );
}

closeModal(){
    this.setState({ visible: false });
}
btnsure(){
    clientModel.delete_member({ group_id: this.props.groupid, id: this.deleteid });
    this.setState({ visible: false });
}
renderSeparator(sectionID, rowID, adjacentRowHighlighted)
{
    return (
        rowID == this.state.selectedID ?
            <View key={rowID} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#589ced', paddingTop: 15, paddingBottom: 15 }}>
                <TouchableOpacity onPress={() => this.dial(rowID)}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../imgs/icons/phone.png')} style={{ height: 25, width: 25 }} />
                        <Text style={{ fontSize: 16, color: 'white', marginTop: 10 }}>电话</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.deletemember(this.props.groupid, rowID)}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../imgs/icons/delete.png')} style={{ height: 25, width: 25, }} />
                        <Text style={{ fontSize: 16, color: 'white', marginTop: 10 }}>删除</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.binddevice(rowID) } }>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../imgs/icons/bundon.png')} style={{ height: 25, width: 25, }} />
                        <Text style={{ fontSize: 16, color: 'white', marginTop: 10 }}>绑定设备</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.modify(rowID) } }>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../imgs/icons/more.png')} style={{ height: 25, width: 25 }} />
                        <Text style={{ fontSize: 16, color: 'white', marginTop: 10 }}>更多</Text>
                    </View>
                </TouchableOpacity>
            </View >
            : null)
}
itemclick()
{
    const {navigator} = this.props;
    navigator.push({
        component: AddMember,
        name: 'Addmember',
        params: { groupid: this.props.groupid }
    })
}
dial(id){
    if (this.props.group_list[this.props.groupid])
    {
        for (let i = 0; i < this.props.group_list[this.props.groupid].length; i++)
        {
            if (this.props.group_list[this.props.groupid][i].id == id)
            {
                Linking.openURL('tel:' + this.props.group_list[this.props.groupid][i].phone);
            }
        }
    }
}
renderRow(rowData, sectionId, rowId)
{
    return (<GroupItem rowData={rowData} groupid={this.props.groupid} onClickItem={this.onClickRow.bind(this)} navigator={this.props.navigator} />)
}
onClickRow(id)
{
    if (id == this.state.selectedID)
    {
        this.setState({ selectedID: 0 });
    }
    else
    {
        this.setState({ selectedID: id });
    }
}
deletemember(groupid, id)
{
    this.setState({ visible: true });
    this.deleteid = id

}
modify(id)
{

    this.props.navigator.push({
        component: Modify,
        name: 'Modify',
        params: {
            groupid: this.props.groupid,
            memberid: id
        }
    });
}
binddevice(id)
{
    this.props.navigator.push({
        component: QR,
        name: 'QR',
        params: {
            groupid: this.props.groupid,
            memberid: id
        }
    });

}
onChangeText(input)
{
    let results = [];

    if (input === '')
    {

        let g_List = this.prepareMessages(this.props.group_list[this.props.groupid]);

        this.setState({ dataSource: this.state.dataSource.cloneWithRows(g_List.blob, g_List.keys) })
    } else
    {
        if (this.props.group_list[this.props.groupid] && this.props.group_list[this.props.groupid].length > 0)
        {
            for (let i = 0; i < this.props.group_list[this.props.groupid].length; i++)
            {
                if (this.props.group_list[this.props.groupid][i].true_name.indexOf(input) >= 0)
                {
                    results.push(this.props.group_list[this.props.groupid][i]);
                }
            }
        }

        let g_List = this.prepareMessages(results);

        this.setState({ dataSource: this.state.dataSource.cloneWithRows(g_List.blob, g_List.keys) })
    }


}
    
}
const styles = StyleSheet.create({
    listStyle: {

    },
    sexText: {
        fontSize: 20,
        textAlign: 'left',
        height: 40,
        color: '#000000',
        marginLeft: 20,
        marginTop: 10
    },
    sectionView: {
        height: 22,
        backgroundColor: "#d5d5d5",
        justifyContent: "center"
    },

    sectionTitle: {
        marginLeft: 16,
    },
    rowView: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#d5d5d5",
        marginLeft: 20,
        marginRight: 20,
    },
    rowTitleSup: {
        flex: 1,
        flexDirection: 'row',

    },
    rowTitle: {
        marginRight: 10,
        marginTop: 10,
        fontSize: 16,
        color: 'black'
    }
});

class GroupItem extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
        }
    }
    render()
    {
        return (
            Platform.OS=='android'?
            <TouchableNativeFeedback onPress={() => { this.props.onClickItem(this.props.rowData.id) } } >
                <View style={styles.rowView}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={styles.rowTitleSup}>
                            <Text style={styles.rowTitle}>{this.props.rowData.true_name}</Text>
                            <Image source={this.props.rowData.sex == 0 ? require('../imgs/icons/mail.png') : require('../imgs/icons/femail.png')} style={{ height: 18, width: 18, marginTop: 13, }} />
                        </View>
                        <View style={styles.rowTitleSup}>
                            <Image source={require('../imgs/icons/phone_icon.png')} style={{ height: 18, width: 14, marginTop: 10, marginBottom: 13 }} resizeMode={'stretch'} />
                            <Text style={{ fontSize: 16, marginLeft: 15, color: '#53cea0', marginTop: 10, }}>{this.props.rowData.device_num}</Text>
                        </View>
                    </View>
                    <TouchableHighlight style={{ justifyContent: 'center' }} onPress={()=>this.jumpToMemberPos(this.props.rowData.id)}>
                        <Image source={require('../imgs/icons/loc_icon.png')} style={{ height: 30, width: 25, }} resizeMode={'stretch'} />
                    </TouchableHighlight>
                </View>
            </TouchableNativeFeedback>:
                <TouchableOpacity onPress={() => { this.props.onClickItem(this.props.rowData.id) } }>
                <View style={styles.rowView}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={styles.rowTitleSup}>
                            <Text style={styles.rowTitle}>{this.props.rowData.true_name}</Text>
                            <Image source={this.props.rowData.sex == 0 ? require('../imgs/icons/mail.png') : require('../imgs/icons/femail.png')} style={{ height: 18, width: 18, marginTop: 13, }} />
                        </View>
                        <View style={styles.rowTitleSup}>
                            <Image source={require('../imgs/icons/phone_icon.png')} style={{ height: 18, width: 14, marginTop: 10, marginBottom: 13 }} resizeMode={'stretch'} />
                            <Text style={{ fontSize: 16, marginLeft: 15, color: '#53cea0', marginTop: 10, }}>{this.props.rowData.device_num}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Image source={require('../imgs/icons/loc_icon.png')} style={{ height: 30, width: 25, }} resizeMode={'stretch'} />
                    </View>
                </View>
                </TouchableOpacity>
        );
    }
    jumpToMemberPos(id)
    {
        const {navigator} = this.props;
        navigator.jumpTo(navigator.getCurrentRoutes()[0]);
        if (showGroupPosFun)
        {
            setMemberId_getpos(id);
            showGroupPosFun(true);
        }
    }
}
function select(store)
{
    return {
        group_list: store.userStore.group_list,
    }

}
export default connect(select)(GroupList);