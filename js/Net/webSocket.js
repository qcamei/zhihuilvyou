

import * as config from '../config';
//import * as ac_user from '../actions/ac_user';
import * as serverModel from './serverModel';
import * as clientModel from './clientModel';
import {CMD} from './cmd';
import {toastShort} from '../utils/ToastUtil';
import JSON from "json-bigint";
import ByteArray from './ByteArray';


let store = null;
let socket: WebSocket = null;
let interval = null;
export function setStore(_store)
{
    store = _store;
    serverModel.setStore(_store);
    clientModel.setStore(_store);
}
export function connectToServer()
{
    if(socket)
    {
        if(socket.readyState==WebSocket.OPEN)
        {
            if(interval)
            {
                clearInterval(interval);
            }
            clientModel.autoLogin();
            clientModel.sendDeviceInfo();
            return;
        }
        else
        {
            socket.onopen = null;
            socket.onmessage = null;
            socket.onerror = null;
            socket.onclose = null;
            socket.close();
        }
    }
    socket = new WebSocket(config.serverAdd);
    socket.onopen = onopen;
    socket.onmessage = onmessage;
    socket.onerror = onerror;
    socket.onclose = onclose;
}
function onopen()
{
    if(interval)
    {
        clearInterval(interval);
    }
    // 打开一个连接
    clientModel.onSocketConnect();
}
function onmessage(e)
{
    let byte_data = new ByteArray(e.data);
    let length = byte_data.readShort();
    let type = byte_data.readByte();
    let data = byte_data.readUTF();
    // 接收到了一个消息
    
    ///debug时打印日志用
    // let s;
    // for(s in CMD)
    // {
    //     if(CMD[s]==type)
    //     {
    //         console.log("S2C【"+ s +"】" + length);
    //         break;
    //     }
    // }
    let recData;
    try{
        recData = JSON.parse(data);
    }
    catch(e){
        // console.warn("S2C【" + s + "】" + "收到数据错误！！data:",data);
        return;
    }
    serverModel.onReceiveMsg(type,recData);
}
function onerror(e)
{
    // 发生了一个错误
    console.log("socket连接发生错误",e.message);
}
function onclose(e)
{
    // 连接被关闭了
    console.log("socket断开连接",e.code, e.reason);
    if(interval)
    {
        clearInterval(interval);
    }
    interval = setInterval(()=>connectToServer(),10000);
}
/**发送数据到服务端 */
export function send2Server(type:number, data: any = {},bNotify=true)
{
    if (socket == null || socket.readyState != WebSocket.OPEN)
    {
        if(bNotify)
        {
            toastShort("网络未连接");
        }
        return;
    }
    let strJson = JSON.stringify(data);
    let byte_data = new ByteArray();
    byte_data.writeUTF(strJson);
    let sendSize = byte_data.length+3;
    let byte_send = new ByteArray();
    byte_send.writeUnsignedShort(sendSize);
    byte_send.writeByte(type);

    byte_send.writeBytes(byte_data);
    byte_send.position = 0;

    if (sendSize != byte_send.length)
    {
        console.log("data size is bad:"+byte_send.length);
        return;
    }

    ///debug时打印日志用
    // for(var s in CMD)
    // {
    //     if(CMD[s]==type)
    //     {
    //         console.log("C2S【"+ s +"】"+byte_send.length);
	// 		break;
    //     }
    // }
    socket.send(byte_send.buffer);
}
/**网络是否已连接 */
export function isConnected()
{
    return socket!=null && socket.readyState==WebSocket.OPEN;
}

export function close()
{
    if(isConnected())
    {
        socket.close();
    }
}