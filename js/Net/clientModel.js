
import { send2Server } from './webSocket';
import {CMD} from './cmd';
import {AsyncStorage,Platform} from 'react-native';
  import DeviceInfo from 'react-native-device-info';
import {infoLoaded,setLastSendPosTime,locationPos,MemberID_getpos} from "../Global";
let store = null;
export let acc = "";
export let pwd = "";
export function setStore(_store)
{
    store = _store;
}
/**socket连接成功初始加载 */
export function onSocketConnect()
{
    //景区列表
    if(!infoLoaded.sa_info)
    {
        send2Server(CMD.cmd_sa_list_load);
    }
    /**自动登录 */
    autoLogin();
    /**发送设备信息 */
    sendDeviceInfo();
}
/**自动登录 */
export function autoLogin()
{
    if(store.getState().userStore.isLoggedIn)
    {
        return;
    }
    AsyncStorage.getItem("hulihill_user",(err,res)=>{
        try{
            res = JSON.parse(res);
            if(res && res.acc && res.pwd)
            {
                login(res.acc,res.pwd,1);
            }
        }
        catch(e)
        {
            if (Platform.OS == 'android')
            {
                login(DeviceInfo.getIMEI(),"",0);
            }else {
                login(DeviceInfo.getUniqueID(),"",0);
            }

        }
    });
}
/**发送设备信息 */
export function sendDeviceInfo()
{
    if (Platform.OS == 'android')
    {
       send2Server(CMD.cmd_myDevice, {device_num:DeviceInfo.getIMEI()});
    }else {
        send2Server(CMD.cmd_myDevice, {device_num:DeviceInfo.getUniqueID()});
    }

}
/**登录 */
export function login(account: string, passwd: string, logintype: number)
{
    var data = {};
    acc = account;
    pwd = passwd;
    data.account = account;
    data.passwd = passwd;
    data.logintype = logintype;
    send2Server(CMD.cmd_login, data);
}

/**登出 */
export function logout()
{
    send2Server(CMD.cmd_logout);
}

/**注册 */
export function register(account:string,verifycode:string,passwd:string,regtype:number){
    var data = {};
    data.account = account;
    data.verifycode = verifycode;
    data.passwd = passwd;
    data.regtype = regtype;
    send2Server(CMD.cmd_regist,data);
}

/**修改密码*/
export function pw_change(oldpasswd:string,newpasswd:string	){
    var data = {};
    data.oldpasswd = oldpasswd;
    data.newpasswd = newpasswd;
    pwd = newpasswd; //修改密码之后储存新密码
    send2Server(CMD.cmd_pw_change,data);
}
/**找回密码*/
export function pw_reset(account:string,verifycode:string,passwd:string){
    var data = {};
    data.account = account;
    data.verifycode = verifycode;
    data.passwd = passwd;
    pwd = passwd;
    send2Server(CMD.cmd_pw_reset,data);
}
/**加载个人信息*/
export function userinfo_load(){

    send2Server(CMD.cmd_userinfo_load);

}
/**加载团队列表*/
export function teamlist_load(){

    send2Server(CMD.cmd_team_list);
}  
/**修改/更新个人信息*/
export function userinfo_update(data){
    // var data = {};
    // data.nickname = nickname;
    // data.userface = userface;
    // data.sex = sex;
    // data.birthdate = birthdate;
    // data.mobile = mobile;
    // data.address = address;
    send2Server(CMD.cmd_userinfo_edit,data);
}
/**新增团队 */
export function add_team(data){

    send2Server(CMD.cmd_add_team,data)
}
/**团队成员列表*/
export function grouplist_load(id){
    send2Server(CMD.cmd_group_list,{id})
}
/**修改成员信息*/
export function modify_member(data){
    send2Server(CMD.cmd_modify_member,data)
}
/**修改团队名称*/
export function modify_teamname(data){
    send2Server(CMD.cmd_team_name,data)
}
/**删除团队成员*/
export function delete_member(data){
    send2Server(CMD.cmd_delete_member,data)
}
/**删除团队 */
export function delete_group(data){
    send2Server(CMD.cmd_delete_group,data)
}
/**绑定设备*/
export function bund_device(data){
    send2Server(CMD.cmd_bund_device,data)
}
/**新增成员*/
export function add_member(data){
    
    send2Server(CMD.cmd_add_member,data)
}




//景点相关
/**景点简介列表 */
export function sp_article_simple_list(id)
{
    send2Server(CMD.cmd_sp_article_simple_list,{zoneid:id,cate:0});
}
/**景区活动列表 */
export function sa_activity_list(id)
{ 
    send2Server(CMD.cmd_sa_activity_list,{zoneid:id,cate:0});
}
/**景点位置列表 */
export function sp_position_list(id)
{
    send2Server(CMD.cmd_sp_position_list,{zoneid:id});
}
/**获取文章 */
export function article_detail(spid:number,cate:number)
{
    send2Server(CMD.cmd_article_detail,{zoneid:store.getState().scenicStore.sa_info.zoneid,cate:cate,id:spid});
}
/**加载声音和图片 */
export function sp_voice(sp_id,langid=101)
{
    send2Server(CMD.cmd_sp_voice,{pointid:sp_id,langid:langid});
}

export function guide_certifition(ture_name:string,cert_id:string,cert_img:string,traval_office:string) {
    var data = {};
    data.ture_name = ture_name;
    data.cert_id = cert_id;
    data.cert_img = cert_img;
    data.traval_office = traval_office;
    send2Server(CMD.cmd_guide_certifition,data);
}
/**加载路线 */
export function sp_recommend_route(id)
{
    send2Server(CMD.cmd_sa_travel_line_list,{zoneid:id});
}
/**加载语种列表 */

export function sp_lang_list()
{
    send2Server(CMD.cmd_lang_list);
}

/**加载租赁设备信息 */
export function rent_device()
{
    send2Server(CMD.cmd_rent_device);
}

/**提交订单 */
export function commit_order(data)
{

    send2Server(CMD.cmd_commit_order,(data));
}

/**加载订单列表 */
export function load_order_list(page_size,page_num,state)
{
  send2Server(CMD.cmd_load_order_list,{page_size:page_size,page_num:page_num,state:state});
}

/**加载订单详情 */
export function load_order_detail(id)
{

    send2Server(CMD.cmd_load_order_detail,{id:id});
}

/**操作订单(1.取消. 2.删除)*/
export function handle_order(id,operator)
{
    send2Server(CMD.cmd_handle_order,{id:id,operator:operator});
}

/**加载保证金 */
export function load_deposit()
{

    send2Server(CMD.cmd_load_deposit);
}
/**发送消息 */
export function sendChatMsg(msg)
{
    send2Server(CMD.cmd_chat,msg);
}

/**提交位置 */
export function commitLocationPos()
{
    if(!locationPos)
    {
        return;
    }
    setLastSendPosTime(Date.now());
    send2Server(CMD.cmd_location_pos,{pos_x:locationPos[0],pos_y:locationPos[1]});
}

/**获取成员位置 */
export function getMembersPos(id)
{
    send2Server(CMD.cmd_members_pos,{group_id:id,member_id:MemberID_getpos});
}
/**成员收听导游开关  */
export function toggle_listen(bOpen,memberId)
{
    send2Server(CMD.cmd_listen_toggle,{recv_audio:bOpen,memberId});
}
