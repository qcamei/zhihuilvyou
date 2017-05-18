
import { CMD } from './cmd';
import * as ac_user from '../actions/ac_user';
import * as ac_scenic from '../actions/ac_scenic';
import * as ac_chat from '../actions/ac_chat';
import { toastShort } from '../utils/ToastUtil';
import { httpServerAdd } from "../config";
import * as clientModel from './clientModel';
import { AsyncStorage } from 'react-native';
import { infoLoaded } from "../Global";
import { formatTime } from '../utils/FormatUtil';
import { Alert } from "react-native"
import * as AudioManager from "../utils/AudioManager"
let store = null;
export function setStore(_store)
{
    store = _store;
}


export function onReceiveMsg(type: number, data: any)
{
    switch (type)
    {
        case CMD.cmd_heart://心跳

            break;
        case CMD.cmd_login://登录
            login(data);
            break;
        case CMD.cmd_logout://登出
            logout(data);
            break;
        case CMD.cmd_regist://注册
            register(data);
            break;
        case CMD.cmd_pw_reset://重置/找回密码
            pw_reset(data);
            break;
        case CMD.cmd_userinfo_load://加载个人信息
            userinfo_load(data);
            break;
        case CMD.cmd_userinfo_edit://添加/修改个人信息
            userinfo_update(data);
            break;
        case CMD.cmd_pw_change://修改密码
            pw_change(data);
            break;
        case CMD.cmd_sa_list_load://加载景区列表
            sa_list_load(data);
            break;
        case CMD.cmd_sp_article_simple_list://加载景点简介列表
            sp_article_simple_list_load(data);
            break;
        case CMD.cmd_sa_activity_list://加载景区活动列表
            sa_activity_list_load(data);
            break;
        case CMD.cmd_sp_position_list://加载景点位置列表
            sp_position_list_load(data);
            break;
        case CMD.cmd_article_detail://加载文章详细信息
            article_detail_load(data);
            break;
        case CMD.cmd_sp_voice://加载声音
            sp_voice_load(data);
            break;
        case CMD.cmd_sa_travel_line_list://加载旅游路线列表

            sp_recommend_route(data);
            break;
        case CMD.cmd_sa_leave_word: //加载留言消息

            break;
        case CMD.cmd_guide_certifition://提交导游认证
            guide_certifition(data);
            break;
        case CMD.cmd_lang_list://语音列表
            sp_lang_list(data);
            break;
        case CMD.cmd_team_list://团队列表
            team_list(data);
            break;
        case CMD.cmd_rent_device://加载租赁设备信息
            rent_device(data);
            break;
        case CMD.cmd_add_team://新增团队
            add_team(data);
            break;
        case CMD.cmd_group_list://团队成员
            group_list(data);
            break;
        case CMD.cmd_bund_device://绑定设备
            bund_device(data);
            break;
        case CMD.cmd_add_member://新增成员
            add_member(data);
            break;
        case CMD.cmd_commit_order: //提交订单
            commit_order(data);
            break;
        case CMD.cmd_load_order_list: //加载订单列表
            load_order_list(data);
            break;
        case CMD.cmd_load_order_detail: //加载订单列表
            load_order_detail(data);
            break;
        case CMD.cmd_load_deposit: //加载保证金
            load_deposit(data);
            break;
        case CMD.cmd_delete_member://删除团队成员
            delete_member(data);
            break;
        case CMD.cmd_delete_group://删除团队
            delete_group(data);
            break;
        case CMD.cmd_modify_member://修改成员信息
            modify_member(data);
            break;
        case CMD.cmd_myDevice://本机设备信息
            onMyDeviceInfo(data);
            break;
        case CMD.cmd_handle_order://操作订单
            handle_order(data);
            break;
        case CMD.cmd_chat://聊天消息
            onReceiveChat(data);
            break;
        case CMD.cmd_location_pos://提交成员位置
            onTogglePosCommit(data);
            break;
        case CMD.cmd_members_pos://获取成员位置
            onMembersPosition(data);
            break;
        case CMD.cmd_listen_toggle:
            onToggleListen(data);
            break;
        case CMD.cmd_team_name:
            modify_teamname(data);
            break;
        default:
            console.error("未知数据：type:" + type + "--data：" + data);
            break;
    }
}

/**登录 */
function login(data)
{
    if (data.error == 0)
    {
        toastShort('登录成功！');
        //dispatch更改玩家数据
        store.dispatch(ac_user.logIn(data.id, data.error, clientModel.acc, clientModel.pwd));
        ///加载玩家个人信息
        clientModel.userinfo_load();
        AsyncStorage.setItem('hulihill_user', JSON.stringify({ acc: clientModel.acc, pwd: clientModel.pwd }));
    }
    else
    {
        toastShort('密码错误！');
    }

}
/**登出 */
function logout(data)
{
    if (data.error == 0)
    {
        if (data.user_id == 0)
        {
            toastShort("您的账号在其它地方登陆")
        }
        else
        {
            toastShort('已退出');
            AsyncStorage.removeItem('hulihill_user');
        }
        store.dispatch(ac_user.logOut());
        store.dispatch(ac_chat.myGroupInfo({ group_id: 0, group_name: "", member_id: 0, room_id: 0 }));
    }

}

/**注册 */
function register(data)
{
    if (data.error == 0)
    {
        toastShort('注册成功');
        store.dispatch(ac_user.register(data));
    }
    else if (data.error == 2)
    {
        toastShort("手机号码格式错误");
    }
    else if (data.error == 3)
    {
        toastShort("密码长度不能小于6位");
    }
    else if (data.error == 1)
    {
        toastShort("该已存在账号");
    }

}

/**修改密码*/
function pw_change(data)
{
    if (data.error == 0)
    {
        toastShort('修改成功'),
            AsyncStorage.setItem('hulihill_user', JSON.stringify({ acc: clientModel.acc, pwd: clientModel.pwd })); // 异步存储,缓存数据
        store.dispatch(ac_user.pw_change());
    }
}

/**找回密码*/
function pw_reset(data)
{

    if (data.error == 0)
    {
        toastShort('修改成功'),
            AsyncStorage.setItem('hulihill_user', JSON.stringify({ acc: clientModel.acc, pwd: clientModel.pwd })); // 异步存储,缓存数据
        store.dispatch(ac_user.pw_reset());
    }
}


/**加载个人信息 */
function userinfo_load(data)
{

    //address,birthdate,email,error,isrenter,istourguide,mobile,nickname,sex,travelofficeid,userface,userid
    if (data.error == 0)
    {
        if (data.istourguide)
        {   //是导游加载团队列表
            clientModel.teamlist_load();
        }
        store.dispatch(ac_user.userinfo_load(data));
    }
}
/**修改个人信息 */
function userinfo_update(data)
{
    if (data.nickname == "")
    {
        data.nickname = clientModel.acc;
    }
    store.dispatch(ac_user.userinfo_load(data));
}

/**景区列表 */
function sa_list_load(data)
{
    if (data.error == 0 && data.datas != null && data.datas.length > 0)
    {
        let sa_info = data.datas[0];//cen_posx,cen_posy,image,name,shortContent,zoneid,photoinfo,telephone
        sa_info.image = httpServerAdd + encodeURI(sa_info.image);
        sa_info.overlay_img = httpServerAdd + encodeURI(sa_info.overlay_img);
        for (var i = 0; i < sa_info.photoinfo.length; i++)
        {
            sa_info.photoinfo[i].img = httpServerAdd + encodeURI(sa_info.photoinfo[i].img);
        }
        infoLoaded.sa_info = true;
        //景点文章简介
        if (!infoLoaded.sp_article_simple_list)
        {
            clientModel.sp_article_simple_list(sa_info.zoneid);
        }
        //景区活动列表
        if (!infoLoaded.sa_activity_list)
        {
            clientModel.sa_activity_list(sa_info.zoneid);
        }
        //景点位置列表
        if (!infoLoaded.sp_position_list)
        {

            clientModel.sp_position_list(sa_info.zoneid);
        }
        //线路
        if (!infoLoaded.sp_recommend_route)
        {
            clientModel.sp_recommend_route(sa_info.zoneid);
        }
        //语种
        if (!infoLoaded.sp_lang_list)
        {
            clientModel.sp_lang_list();
        }

        store.dispatch(ac_scenic.sa_list(sa_info));
    }
}
//加载景点简介列表
function sp_article_simple_list_load(data)
{
    if (data.error == 0 && data.datas != null && data.datas.length > 0)
    {
        infoLoaded.sp_article_simple_list = true;
        //{image,name,pointid,shortcontent}
        for (let i = 0; i < data.datas.length; i++)
        {
            data.datas[i].image = httpServerAdd + encodeURI(data.datas[i].image);
        }
        store.dispatch(ac_scenic.sp_article_simple_list(data.datas));
    }
}
//加载景区活动列表
function sa_activity_list_load(data)
{
    if (data.error == 0 && data.datas != null && data.datas.length > 0)
    {
        infoLoaded.sa_activity_list = true;
        //{image,name,pointid,shortcontent}
        for (let i = 0; i < data.datas.length; i++)
        {
            data.datas[i].short_img = httpServerAdd + encodeURI(data.datas[i].short_img);
        }
        store.dispatch(ac_scenic.sa_activity_list(data.datas));
    }

}
//加载景点位置列表
function sp_position_list_load(data)
{

    if (data.error == 0 && data.datas != null && data.datas.length > 0)
    {
        infoLoaded.sp_position_list = true;
        //{name,image,pointid,cate_id,area_points}
        for (let i = 0; i < data.datas.length; i++)
        {
            data.datas[i].image = httpServerAdd + encodeURI(data.datas[i].image);
            try
            {
                data.datas[i].area_points = JSON.parse(data.datas[i].area_points);
                data.datas[i].routes = JSON.parse(data.datas[i].routes)
            }
            catch (e)
            {
                data.datas[i].area_points = [];
                data.datas[i].routes = []
            }
        }
        store.dispatch(ac_scenic.sp_position_list(data.datas));
    }
}
/**文章详细信息 */
function article_detail_load(data)
{
    if (data.error == 0)
    {
        //content,hits,id,publish_date,title
        let info = {
            content: data.content,
            hits: data.hits,
            id: data.id,
            publish_date: data.publish_date,
            title: data.title,
        };
        store.dispatch(ac_scenic.SP_article_Info(info));
    }
}
/**声音 */
function sp_voice_load(data)
{
    //voice sv_name id photoinfo
    if (data.error == 0)
    {
        for (let i = 0; i < data.datas.length; i++)
        {
            data.datas[i].voice = httpServerAdd + encodeURI(data.datas[i].voice);
            if (i == 0)
            {
                AudioManager.playWithUrl(data.datas[i].voice);
                store.dispatch(ac_scenic.sp_voice_load(data.datas[i]));
                break;
            }
        }
    }
}

/**导游认证*/
function guide_certifition(data)
{
    if (data.error == 0)
    {
        toastShort("已提交认证");

        store.dispatch(ac_user.guide_certifition(data));

    }
}
/**团队列表*/
function team_list(data)
{
    if (data.error == 0 && data.datas != null && data.datas.length > 0)
    {
        let teamlist = [];
        for (let i = 0; i < data.datas.length; i++)
        {
            let createTime = new Date();
            createTime.setTime(data.datas[i].create_date);
            teamlist.push({
                "icon": data.datas[i].icon,
                "id": data.datas[i].id,
                "name": data.datas[i].name,
                "create_date": createTime.getFullYear() + "年" + (createTime.getMonth() + 1) + "月" + createTime.getDate() + "日",
                "state": data.datas[i].state,
                // "room_id":data.datas[i].room_id,
                "peoples": data.datas[i].peoples
            });

            if (data.datas[i].state == 1)
            {
                let inTeamInfo = { group_id: data.datas[i].id, group_name: data.datas[i].name, member_id: -1 };
                store.dispatch(ac_chat.myGroupInfo_Guide(inTeamInfo));
                AudioManager.setRoomMemberID(store.getState().userStore.user.userid, inTeamInfo.member_id);
            }
        }
        teamlist.sort((a, b) =>
        {
            return b.id - a.id
        });
        store.dispatch(ac_user.team_list(teamlist));
    }
}
/**增加团队 */
function add_team(data)
{
    if (!data.error || data.error == 0)
    {
        let createTime = new Date();
        createTime.setTime(data.create_date);
        let info = {
            "icon": data.icon,
            "id": data.id,
            "name": data.name,
            "create_date": createTime.getFullYear() + "年" + (createTime.getMonth() + 1) + "月" + createTime.getDate() + "日",
            "state": data.state,
            "peoples": data.peoples
        };
        toastShort("添加成功");
        store.dispatch(ac_user.add_team(info));
    } else if (data.error == 2)
    {
        toastShort("没有导游权限");
    } else if (data.error == 3)
    {
        toastShort("团队名称不能重复");
    }
    else if (data.error == 1)
    {
        toastShort("数据异常");
    }
}
/**删除团队成员 */
function delete_member(data)
{
    if (data.error == 0)
    {
        toastShort("删除成功");
        store.dispatch(ac_user.group_delete_member(data.group_id, data.id));
    } else
    {
        toastShort("删除失败");
    }
}
/**编辑团队名称 */
function modify_teamname(data)
{

    if (!data.error || data.error == 0)
    {
        toastShort("修改成功");
        
        store.dispatch(ac_user.modify_teamname(data.id,data.name));
        if(data.id == store.getState().chatStore.groupInfo.group_id)
        {
            store.dispatch(ac_chat.myGroupInfo_modify({ group_id: data.id, group_name: data.name }));
        }
    } else if (data.error == 2)
    {
        toastShort("没有导游权限");
    } else
    {
        toastShort("数据异常");

    }
}
/**删除团队 */
function delete_group(data)
{
    if (data.error == 0)
    {
        toastShort("删除成功");
        store.dispatch(ac_user.delete_team(data.id));
        if (data.id == store.getState().chatStore.groupInfo.member_id)
        {
            store.dispatch(ac_chat.myGroupInfo({ group_id: 0, group_name: "", member_id: 0, room_id: 0 }));
            AudioManager.setRoomMemberID(data.room_id, data.member_id);
            if(AudioManager.isSending)
            {
                AudioManager.stopSending();
            }
        }
    } else
    {
        toastShort("删除失败");
    }
}
/**绑定设备 */
function bund_device(data)
{
    if (data.error == 0)
    {
        //group_id,id,device_num//设备号	
        toastShort("绑定成功");
        let member = {
            id: data.id,
            device_num: data.device_num
        };
        store.dispatch(ac_user.group_modify_member(data.group_id, member));

        let team_list = store.getState().userStore.team_list;
        //alert()
        for (let i = 0; i < team_list.length; i++)
        {
            if (data.group_id == team_list[i].id)
            {
                //所在团队更新
                store.dispatch(ac_chat.myGroupInfo_Guide({
                    group_id: data.group_id,
                    group_name: team_list[i].name,
                    member_id: -1
                })
                );
                AudioManager.setRoomMemberID(store.getState().userStore.user.userid, -1);
            }
        }
    } else if (data.error == 1)
    {
        toastShort("数据异常");
    } else
    {
        toastShort("没有导游权限");
    }
}
/**团队成员列表 */
function group_list(data)
{

    if (data && !data.error)
    {
        store.dispatch(ac_user.group_list(data.group_id, data.datas))
    }
}
/**增加成员 */
function add_member(data)
{

    if (!data.error || data.error == 0)
    {
        toastShort("添加成功");
        store.dispatch(ac_user.group_add_member(data.group_id, data.datas));
    }
    else if (data.error == 2)
    {
        toastShort("没有导游权限");
    } else
    {
        toastShort("数据异常");

    }
}
/**修改成员信息 */
function modify_member(data)
{
    if (!data.error || data.error == 0)
    {
        toastShort("修改成功");
        // group_id:number		//团队id
        // id:number			//队员id
        // true_name:string		//姓名
        // sex:number			//性别
        // birthdate:string		//生日
        let member = {
            id: data.id,
            true_name: data.true_name,
            sex: data.sex,
            birthdate: data.birthdate,
            phone: data.phone
        };
        store.dispatch(ac_user.group_modify_member(data.group_id, member));
    } else if (data.error == 2)
    {
        toastShort("没有导游权限");
    } else
    {
        toastShort("数据异常");

    }
}

/**路线 */
function sp_recommend_route(data)
{
    infoLoaded.sp_recommend_route = true;
    if (data.error == 0 && data.datas != null && data.datas.length > 0)
    {
        store.dispatch(ac_scenic.sp_recommend_route(data.datas));
    }
}
/**语音列表 */
function sp_lang_list(data)
{
    if (data.error == 0 && data.datas != null && data.datas.length > 0)
    {

        store.dispatch(ac_scenic.sp_lang_list(data.datas));

    }
}

/**设备租赁信息 */
function rent_device(data)
{
    if (data.error == 0)
    {
        infoLoaded.LOAD_device_information = true;
        store.dispatch(ac_user.LOAD_device_information(data));
    }
}

/**提交订单 */
function commit_order(data)
{
    if (data.error == 0)
    {
        toastShort("已下单");
        store.dispatch(ac_user.commit_order(data));
    }
    else if (data.error)
    {
        toastShort("没有导游权限")
    }
}

/*******************************************淫荡的分割线****************/
/**加载订单列表 */
function load_order_list(data)
{
    if (data.error == 0)
    {
        infoLoaded.totalOrderCount = data.total_record;
        let orderlist = [];
        for (let i = 0; i < data.datas.length; i++)
        {

            orderlist.push({
                "icon": data.datas[i].icon,
                "id": data.datas[i].id, "fee": data.datas[i].fee, "state": data.datas[i].state, "quality": data.datas[i].quality, "verify_code": data.datas[i].verify_code
                , "rent_begin": formatTime(data.datas[i].rent_begin),"rent_end":formatTime(data.datas[i].rent_end)
            })
        }

        store.dispatch(ac_user.load_order_list(orderlist, data.page_num, data.total_record, data.state_type));

    }

}

/******************************************淫荡的分割线*****************/

/**加载订单详情 */
function load_order_detail(data)
{
    if (data.error == 0)
    {
        store.dispatch(ac_user.load_order_detail(data));
    }
    else
    {
        toastShort('加载订单详情失败');
    }
}

/**加载保证金 */
function load_deposit(data)
{
    if (data.error == 0 && data.datas != null)
    {
        store.dispatch(ac_user.LOAD_deposit(data));
    }
}


/**操作订单 */
function handle_order(data)
{
    if (data.error == 0)
    {
        store.dispatch(ac_user.handle_order(data))
    }
    else
    {
        toastShort("操作订单失败" + data.error);
    }
}


/**本机设备信息--- 
    0：登录给信息
    1：绑定设备
    2：团队解散
    3：导游删除队员
    4：导游将该团员绑定其它设备
 */
function onMyDeviceInfo(data)
{
    if (data && !data.error)
    {
        let info={group_id:0,group_name:"",member_id:0,room_id:0};
        if(data.nreason==0)
        {
            if (data.group_name && (!store.getState().chatStore.groupInfo || data.group_id != store.getState().chatStore.groupInfo.group_id))
            {
                toastShort("加入导游团队：" + data.group_name);
            }
            info={ group_id: data.group_id, group_name: data.group_name, member_id: data.member_id, room_id: data.room_id };
        }
        else if(data.nreason==1)
        {
            if (data.group_name && (!store.getState().chatStore.groupInfo || data.group_id != store.getState().chatStore.groupInfo.group_id))
            {
                toastShort("加入导游团队：" + data.group_name);
            }
            info={ group_id: data.group_id, group_name: data.group_name, member_id: data.member_id, room_id: data.room_id };
        }
        else if(data.nreason==2)
        {
            toastShort("团队已解散");
            if(AudioManager.isListening)
            {
                AudioManager.stopListen();
            }
            
        }
        else if(data.nreason==3)
        {
            if(store.getState().chatStore.groupInfo.group_name){
                toastShort("您被移出了团队：" + store.getState().chatStore.groupInfo.group_name);
            }
            if(AudioManager.isListening)
            {
                AudioManager.stopListen();
            }
        }
        else if(data.nreason==4)
        {
            if(store.getState().chatStore.groupInfo.group_name){
                toastShort("您被移出了团队：" + store.getState().chatStore.groupInfo.group_name);
            }
            if(AudioManager.isListening)
            {
                AudioManager.stopListen();
            }
        }

        store.dispatch(ac_chat.myGroupInfo(info));
        AudioManager.setRoomMemberID(data.room_id, data.member_id);
    }

}
/**收到聊天消息 */
function onReceiveChat(data)
{
    //send_id说话人,send_name说话名  is_owner是否为房主 type类型   content内容  timestamp时间戳
    if (data && !data.error)
    {
        let msg = {
            user: {
                isGuider: data.is_owner,
                _id: data.send_id,
                name: data.send_name,
            },
            createdAt: data.timestamp,
        };
        if (data.type == 0)
        {
            msg = {...msg, text: data.content }
        }
        else if (data.type == 1)
        {
            msg = {...msg, audio: data.content }
        }
        store.dispatch(ac_chat.receiveMsg(msg));

        if (store.getState().chatStore.groupInfo.member_id != -1 && msg.text && msg.user._id == -1)
        {
            if (msg.text == "导游已关闭实时对讲" && AudioManager.isListening)
            {
                AudioManager.stopListen();
            }
            if (msg.text == "导游已开启实时对讲，游客可以点击右下角图标，切换收听导游解说" && !AudioManager.isListening)
            {
                toastShort("导游已开启实时对讲");
                // Alert.alert("提示", "导游已开启实时对讲，是否听导游解说？", [
                //     { text: "是", onPress: ()=>{
                //         {
                //             AudioManager.startListen(store.getState().chatStore.groupInfo.member_id);
                //         }

                //     } },{text:"取消"}
                // ]);
            }
        }
    }
    else
    {
        toastShort("发送消息失败！")
    }
}

/**提交成员位置*/
function onTogglePosCommit(data)
{
    clientModel.commitLocationPos();
}
/**获取成员位置*/
function onMembersPosition(data)
{
    store.dispatch(ac_chat.recMemberPos(data));
    // TYPES.Rec_Member_Pos
    // console.warn(JSON.stringify(data));
}

function onToggleListen(data)
{
    // console.warn(data.port);
    //  if (data && !data.error && data.port) {
    //      AudioManager.startListen(data.port);
    //  }
}

