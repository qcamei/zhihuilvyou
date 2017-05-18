import React, { Component } from 'react';
import
{
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    Platform,
    ListView,
    InteractionManager
} from 'react-native'
import { connect } from 'react-redux';
import { isEqual } from '../utils/CommonUtil';
let mT = (Platform.OS === 'android' && Platform.Version <= 19) ? 0 : (Platform.OS === 'android' ? 24 : 0);
let wndWidth = Dimensions.get('window').width;//宽
let wndHeight = Dimensions.get('window').height;//高
import HeadBar from '../components/HeadBar'
import AddTeam from './AddTeam'
import AddMember from './AddMember'

import * as clientModel from '../Net/clientModel';
import { httpServerAdd } from '../config';
import Chat from '../pages/Chat';
import TeamCenter from '../group/TeamCenter';
class TeamList extends React.Component
{
    constructor(props)
    {
        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        if(this.props.team_list && this.props.team_list.length > 1)
        {
            this.props.team_list.sort(this.sortFunction.bind(this));
        }
        this.state = {
            dataSource: ds,
        }
    }
    sortFunction(a,b)
    {
        if(b.id==this.props.groupInfo.group_id)
        {
            return 1;
        }
        if(a.id==this.props.groupInfo.group_id)
        {
            return -1;
        }
        return 0;
    }
    componentWillReceiveProps(nextprops)
    {
        let chagngeState={};
        if (nextprops.team_list && !isEqual(nextprops.team_list, this.props.team_list))
        {
            let team_list = nextprops.team_list;
            if(team_list && team_list.length > 1)
            {
                team_list.sort(this.sortFunction.bind(this));
            } 
            chagngeState = {...chagngeState,dataSource: this.state.dataSource.cloneWithRows(team_list)};
        }
        if(nextprops.operateNotify && nextprops.operateNotify.indexOf(/modify_teamname|delmember|addmember/) >= 0)
        {
            chagngeState={...chagngeState,dataSource: this.state.dataSource.cloneWithRows(this.props.team_list)};
        }
        // this.setState(chagngeState);
        setTimeout(()=>this.setState(chagngeState), 1);
        
    }
    componentDidMount()
    {
       
        InteractionManager.runAfterInteractions(() =>
        {
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.props.team_list) })
        })
    }
    
    render()
    {
        const { navigator } = this.props;
        return (
            <View style={{ height: wndHeight, width: wndWidth, backgroundColor: '#f3f4f6' }}>
                <HeadBar
                    title='团队列表'
                    leftIcon={require('../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    rightIcon={require('../imgs/icons/add_team.png')}
                    rightIconStyle={{ width: 15, height: 20 }}
                    rightClick={() => this.addClick()}
                    leftClick={() => this.leftClick()}
                    navigator={navigator}
                    />
                <View style={{ flexDirection: 'row', width: wndWidth, height: 60, alignItems: 'center', justifyContent: 'center', }}>
                    <View style={{ flexDirection: 'row', width: wndWidth - 20, borderRadius: 10, backgroundColor: 'white', height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../imgs/icons/btn_search.png')} style={{ height: 15, width: 15 }} />
                        <TextInput
                            style={{ fontSize: 14, marginLeft: 10, width: 120 }}
                            placeholder="搜索成员 团队"
                            underlineColorAndroid='transparent'
                            onChangeText={(input) => this.onChangeText(input)}
                            autoCorrect={false}
                            clearButtonMode="always"
                            />
                    </View>
                </View>
                <ListView
                    initialListSize={5}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                    />


            </View>
        )
    }
    renderRow(rowdata)
    {
        return (
            <View styel={{ flex: 1 }}>
                <TouchableOpacity onPress={() => this.openinfo(rowdata.id)}>
                    <View style={styles.rowView}>
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={!rowdata.icon || rowdata.icon == "" ? require('../imgs/ic_launcher.png') : { uri: httpServerAdd + rowdata.icon }} style={{ height: 50, width: 50, margin: 10 }} resizeMode={'stretch'} />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, color: 'black', }}>{rowdata.name}</Text>
                            <Text style={{ fontSize: 16, color: '#53cea0', marginTop: 10, }}>{rowdata.create_date + "创建"}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', marginRight: 10, }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.clickMenuItem(rowdata.id)} >
                                    <Image source={require('../imgs/icons/btn_addme.png')} style={{ height: 20, width: 15, }} resizeMode={'stretch'} />
                                    <Text style={{ fontSize: 16, color: '#ff9d3e', marginTop: 10, }}>{rowdata.peoples} </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </View >
        )
    }
    openinfo(id)
    {
        const { navigator } = this.props;
        if (id == this.props.groupInfo.group_id)
        {
            navigator.push({
                component: Chat,
                name: 'Chat',
            });
        }
        else
        {
            navigator.push({
                component: TeamCenter,
                name: 'TeamCenter',
                params: { groupid: id}
            });
        }
    }
    leftClick()
    {
        const {navigator} = this.props;
        navigator.popToRoute(navigator.getCurrentRoutes()[0]);


    }
    addClick()
    {
        const { navigator } = this.props;
        navigator.push({
            component: AddTeam,
            name: 'AddTeam'
        });
    }
    clickMenuItem(id)
    {
        const { navigator } = this.props;
        navigator.push({
            component: AddMember,
            name: 'AddMember',
            params: { groupid: id }
        });
    }
    onChangeText(input)
    {
        let select = [];
        if (input === '')
        {
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.props.team_list) })
        } else
        {
            if (this.props.team_list && this.props.team_list.length > 0)
            {
                for (let i = 0; i < this.props.team_list.length; i++)
                {
                    if (this.props.team_list[i].name.indexOf(input) >= 0)
                    {
                        select.push(this.props.team_list[i])
                    }
                }
            }
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(select) })
        }
    }
    shouldComponentUpdate(nextProps, nextState)
    {
        if (isEqual(nextState, this.state))
        {
            return false;
        }
        return true;
    }
}
const styles = StyleSheet.create({
    rowView: {

        width: wndWidth - 20,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    rowTitle: {
        marginRight: 10,
        marginTop: 10,
        fontSize: 16,
        color: 'black'
    }
});
function select(store)
{
    return {
        team_list: store.userStore.team_list,
        groupInfo: store.chatStore.groupInfo,//当前团队信息
        operateNotify:store.userStore.operateNotify,
    }
}
export default connect(select)(TeamList);