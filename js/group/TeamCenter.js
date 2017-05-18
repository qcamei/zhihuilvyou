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
    Alert,
    Platform

} from 'react-native'
import { connect } from 'react-redux';
import HeadBar from '../components/HeadBar'
import * as clientModel from '../Net/clientModel'
import GroupList from './GroupList'
import ModifyTeamName from './ModifyTeamName'
import TeamList from './TeamList'
import { showGroupPosFun,setMemberId_getpos } from '../Global';
import {toastShort} from '../utils/ToastUtil'
class TeamCenter extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            teamname: '',
            teamface: '',

        }

    }
    renderCell(index, leftTitle)
    {
        return (
            <TouchableHighlight style={styles.TouchBtn} onPress={this._pressButton.bind(this, index)}>
                <View>
                    <View style={styles.firstfloorview}>
                        <View style={styles.secondfloortext}>
                            <Text style={styles.textfloor}>{leftTitle}</Text>
                        </View>
                        <Image style={styles.thumb} source={require('../imgs/icons/arrow_right.png')} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    render()
    {
        const {navigator} = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f3f4f6', flexDirection: 'column' }}>
                <HeadBar
                    title='团队中心'
                    leftIcon={require('../imgs/icons/backIcon@2x.png')}
                    leftText='返回'
                    navigator={navigator}
                    />
                <View style={{ marginTop: 20 }}>
                    {this.renderCell(1, "团队资料")}
                    <View style={styles.separator} />
                    {this.renderCell(2, "团队成员")}
                    <View style={styles.separator} />
                    {this.renderCell(3, "成员位置")}
                </View>
                {
                    Platform.OS == 'android'?<TouchableOpacity onPress={() => this.delete_group()}>
                        <View style={{ flex: 1, margin: 20, height: 40, backgroundColor: 'blue', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>解散团队</Text>
                        </View>
                    </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => this.delete_group()}  style={{ margin: 20, height: 40, backgroundColor: 'blue', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>

                                <Text style={{ fontSize: 16, color: 'white' }}>解散团队</Text>

                        </TouchableOpacity>
                }

            </View>
        )
    }

    _pressButton(index)
    {
        const {navigator} = this.props;
        switch (index)
        {
            case 1:
                navigator.push({
                    component: ModifyTeamName,
                    name: 'ModifyTeamName',
                    params: {
                        id: this.props.groupid
                    }

                });
                break;
            case 2:
                navigator.push({
                    component: GroupList,
                    name: 'GroupList',
                    params: {
                        groupid: this.props.groupid
                    }

                });

                break;
            case 3:
                if(this.props.curGroupID == this.props.groupInfo.group_id)
                {
                    navigator.jumpTo(navigator.getCurrentRoutes()[0]);
                    if (showGroupPosFun)
                    {
                        setMemberId_getpos(0);
                        showGroupPosFun(true);
                    }
                }
                else{
                    toastShort("团队未激活或已注销，无法查看成员位置");
                }
                break;
        }
    }
    delete_group()
    {
        const {navigator} = this.props;
        Alert.alert("提示", "是否确定解散团队？", [
            { text: "是", onPress: ()=>{
                {
                    clientModel.delete_group({ id: this.props.groupid })
                }
                
            } },{text:"取消"}
        ]);
        
    }
    /**属性变化 */
    componentWillReceiveProps(nextProps)
    {
         
        const {navigator} = this.props;
        if (nextProps.operateNotify && nextProps.operateNotify.indexOf('deleteteam') >= 0)
        {
            for (let i = 0; i < navigator.getCurrentRoutes().length; i++)
            {
                if (navigator.getCurrentRoutes()[i].name == "TeamList")
                {
                    navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                    break;
                }
            }

        }
    }

}
const styles = StyleSheet.create({
    firstfloorview: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: 60
    },
    secondfloortext: {
        flex: 2,
        paddingLeft: 10,

    },
    thumb: {
        width: 10,
        height: 16,
        marginRight: 5
    },
    TouchBtn: {
        backgroundColor: '#ffffff',

    },
    separator: {
        height: 0.6,
        backgroundColor: '#d5d5d5',
    },
    textfloor: {
        fontSize: 18,

        color: '#000000',
        textAlign: 'left',

    },
});
function select(store)
{
    return {
        operateNotify: store.userStore.operateNotify,
        groupInfo: store.chatStore.groupInfo,//当前团队信息
    }

}
export default connect(select)(TeamCenter);