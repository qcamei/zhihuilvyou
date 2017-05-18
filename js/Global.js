
import
{
     Alert,
    Dimensions,
    Platform
} from 'react-native';
import { toastShort } from "./utils/ToastUtil";
import DeviceInfo from 'react-native-device-info'
// if(Platform.OS == 'android' )
// {
//     var RNFS = require('react-native-fs');
// }
import { httpServerAdd } from "./config"
/**屏宽 */
export let wndWidth = Dimensions.get("window").width;
/**屏高 */
export let wndHeight = Dimensions.get("window").height;
/** drawer宽*/
export let drawerWidth = wndWidth * 5/7;
/**statusBar高度 */
export let statusbarHeight = (Platform.OS === 'android' && Platform.Version <= 19) ? 24 : (Platform.OS === 'android' ? 0 : 0);
/**headbar头部paddingTop值 */
export let headBarPt = statusbarHeight==0?24:0;
/**正在获取的成员位置的成员ID  0表示所有 */
export let MemberID_getpos:0;;;
/**正在获取的成员位置的成员ID 0表示所有 */
export function setMemberId_getpos(id)
{
    MemberID_getpos = id;
}
/**已加载？ */
export let infoLoaded={
    /**景区信息 */
    sa_info:false,
    /**景点文章简介*/
    sp_article_simple_list:false,
    /**景区活动列表*/
    sa_activity_list:false,
    /**景点位置列表 */
    sp_position_list:false,
    /**线路 */
    sp_recommend_route:false,
    /**设备租赁*/
    LOAD_device_information:false,
    /**语种 */
    sp_lang_list:false,
    /**是否刷新*/
    isRefreshing:false,
};

export const BtnStatus = {
  /**松开 */
  Up: 0,
  /**按住且在按钮区域 */
  PressedAndDown: 1,
  /**按住 不在按钮区域 */
  PressedAndUp: 2,
};


/**跳转到成员显示位置的函数。。。先用着 */
export let showGroupPosFun = null;
export function setShowGroupPosFun(fun)
{
    showGroupPosFun=fun;
}

/**上次发送位置时间 */
export let lastSendPosTime=0;
export function setLastSendPosTime(ntime)
{
    lastSendPosTime=ntime;
}
/**当前位置 */
export let locationPos=null;
export function setLocationPos(pos)
{
    locationPos=pos;
}
// export function checkVersion()
// {
//     if(Platform.OS != 'android' )
//     {
//         return
//     }
//     fetch(httpServerAdd + "upload/apkversion",{method: 'POST'})
//     .then((res) =>
//     {
//         try{
//             let data = JSON.parse(res._bodyInit);
//             let versionInfo = JSON.parse(data.data);
//             if(versionInfo && versionInfo.url && versionInfo.version && versionInfo.version != DeviceInfo.getVersion())
//             {
//                 let downloadDest = "sdcard/Download/com.hulihill_mobile_1.apk";
//                 Alert.alert("提示", "检测到新版本,是否更新？", [
//                     { text: "是", onPress: ()=>downLoad(httpServerAdd + versionInfo.url,downloadDest) },{text:"取消"}
//                 ])
//             }
//         }
//         catch(e)
//         {

//         }
//     }).catch((e) =>
//     {
//     });
// }
// function downLoad(url,downloadDest)
//   {
//     const ret = RNFS.downloadFile({ fromUrl: url, toFile: downloadDest, null, null, null, null });
//     ret.promise.then(res => {
//       RNFS.install(downloadDest);
//     }).catch(err => {
//       toastShort("下载出错！");
//     });
//   }
