
import { AudioRecorder, AudioUtils, AudioPlayer } from 'react-native-audio';
import {talkServerIp,talkServerPort,listenPort} from "../config"
import { NativeModules,DeviceEventEmitter,Platform } from 'react-native';
import {toggle_listen,sendChatMsg} from "../Net/clientModel"
var AudioWrapperManager = NativeModules.AudioWrapperManager;
import {toastShort} from "./ToastUtil"
/**记录的音频信息 */
let markAudio=null;
/**当前在播放的声音类型 */
let playingAudioType=-1;

/**播放的声音类型 */
export const AudioType={
    /**景点介绍语音 */
    ScenicPoint:0,
    /**聊天语音 */
    Chat:1,
};




/**播放器初始化 */
let isInitPlayer = false;
/**当前播放路径 */
let playingPath = "";
/**播放回调 */
let startCb = null;
/**停止回调 */
let finishCb = null;
/**播放状态 0:停止播发 1:正在播放 2:播放准备中 */
let playingStatus = 0;
/**播放开始时间 */
let startPlayingTime=0;
/**播放器初始化 */
function initAudioPlayer()
{
    if (isInitPlayer) return;
    isInitPlayer = true;
    AudioPlayer.onStart = (data) =>
    {
        //景点语音需要记录
        if(playingAudioType==AudioType.ScenicPoint)
        {
            markAudio=null;
            startPlayingTime = Date.now();
        }
        
        playingPath = data.path;
        playingStatus = 1;
        if (startCb)
        {
            startCb(data);
        }
    };
    /**停止并马上播放另一个音频或录音时，不会触发此函数，在其他地方手动触发 */
    AudioPlayer.onFinished = (data) =>
    {
        playingPath = "";
        playingStatus = 0;
        if (finishCb)
        {
            finishCb(data);
        }
        playingAudioType = -1;
        startPlayingTime=0;
    };
    AudioPlayer.setStartSubscription();
    AudioPlayer.setFinishedSubscription();

}
/**播放远程音频 nType:类型*/
export function playWithUrl(url,nType=AudioType.ScenicPoint)
{
    initAudioPlayer();
    //播放中、播放准备 停止播放
    if (playingStatus == 1 || playingStatus == 2)
    {
        checkMarkAudio(nType);
        AudioPlayer.stop();
        if(finishCb)
        {
            /**停止并马上播放另一个音频或录音时，不会触发结束回调，手动触发 */
            finishCb();
        }
    }
    AudioPlayer.playWithUrl(url);
    playingStatus = 2;
    playingAudioType = nType;
}
/**播放本地音频 */
export function playLocal(path,nType=AudioType.ScenicPoint)
{
    initAudioPlayer();
    if (playingStatus == 1 || playingStatus == 2)
    {
        checkMarkAudio(nType);
        AudioPlayer.stop();
        if(finishCb)
        {
            /**停止并马上播放另一个音频或录音时，不会触发结束回调，手动触发 */
            finishCb();
        }
    }
    AudioPlayer.play(path);
    playingStatus = 2;
    playingAudioType = nType;
}
/**停止 */
export function stop(bStopByRecording = false)
{
    if(bStopByRecording)
    {
        checkMarkAudio(AudioType.Chat);
        if(finishCb)
        {
            finishCb();
        }
    }
    initAudioPlayer();
    AudioPlayer.stop();
    playingStatus = 0;
}
/**播放状态 0:停止播发 1:正在播放 2:播放准备中 */
export function getPlayingStatus()
{
    return playingStatus;
}
/**播放回调*/
export function setStartCb(fun)
{
    startCb = fun;
}
/**停止回调  在play之后设置，防止play之前有音频在播放时无法调用正确的结束回调*/
export function setFinishCb(fun)
{
    finishCb = fun;
}
/**是否需要记录被停止的音频信息 */
function checkMarkAudio(nType,skipCheck=false)
{
    if(skipCheck ||  (nType!=AudioType.ScenicPoint && playingAudioType == AudioType.ScenicPoint))
    {
        markAudio={
            path : playingPath,
            time : Date.now() - startPlayingTime,
        }
    }
}

/**录音初始化 */
let isRecordInit=false;
/**录音路径 */
let recordingPath = "";
/***录音停止回调 */
let recordFinishCb=null;
/**0:未录音 1:录音中 2:等待录音结束*/
let recordingStatus=0;

/**录音初始化 */
function initAudioRecord()
{
    if(isRecordInit) return;
    isRecordInit=true;
    
    AudioRecorder.onFinished = (data) =>
    {
        if(recordFinishCb)
        {
            recordFinishCb(recordingPath);
        }
        recordingPath="";
        recordingStatus=0;
    };
}
/**开始录音 */
export function startRecording()
{
    if(recordingStatus!=0)
        return;
    if(getPlayingStatus()!=0)
    {
        stop(true);
    }
    initAudioRecord();
    recordingPath = AudioUtils.DocumentDirectoryPath + '/' + Date.now() + '.aac';
    AudioRecorder.prepareRecordingAtPath(recordingPath, {
        SampleRate: 44100,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000
    });
    AudioRecorder.startRecording();
    recordingStatus=1;
}
/**停止录音 */
export function stopRecording()
{
    if(recordingStatus!=1)
        return;
    AudioRecorder.stopRecording();
    recordingStatus=2;
}
/**录音停止回调 */
export function setRecordFinishCb(fun)
{
    recordFinishCb = fun;
}
/**0:未录音 1:录音中 2:等待录音结束*/
export function getRecordingStatus()
{
    return recordingStatus;
}

export let isSending=false;
export let isListening = false;
let isTalkServerInit = false;
let onStopSending=null;
let onstopListening=null;
export function setStopSendingCb(cb)
{
    onStopSending = cb;
}
export function setstopListeningCb(cb)
{
    onstopListening = cb;
}
export function initTalkService()
{
    if(!isTalkServerInit) {
        if (Platform.OS == 'android')
        {
            isTalkServerInit=true;
            AudioWrapperManager.setServerAddress(talkServerIp,talkServerPort,listenPort);
            DeviceEventEmitter.addListener('stopSending',(data) =>
                {
                    isSending = false;
                    sendChatMsg({type:0,content:"导游已关闭实时对讲"});
                    if (onStopSending)
                    {
                        onStopSending(data);
                    }
                }
            );

            DeviceEventEmitter.addListener('stopListening',(data) =>
                {
                    isListening=false;
                    if (onstopListening)
                    {
                        onstopListening(data);
                    }
                }
            );
            DeviceEventEmitter.addListener('snedSoundFail',(data) =>
                {
                    toastShort("实时对讲开启失败，请检查您的网络设置");
                    sendChatMsg({type:0,content:"导游已关闭实时对讲"});
                    isSending=false;
                    if (onstopListening)
                    {
                        onstopListening(data);
                    }
                }
            );
            DeviceEventEmitter.addListener('listenSoundFail',(data) =>
                {
                    toastShort("收听语音失败，请检查您的网络设置");
                    isListening=false;
                    if (onstopListening)
                    {
                        onstopListening(data);
                    }
                }
            );
        }
    }
}
let curmemberid = 0;
export function startSending()
{
    if (Platform.OS == 'android')
    {
        initTalkService();
        AudioWrapperManager.startRecord();
        sendChatMsg({type:0,content:"导游已开启实时对讲，游客可以点击右下角图标，切换收听导游解说"});
        isSending=true;
    }
}
export function stopSending()
{
    if (Platform.OS == 'android')
    {
        AudioWrapperManager.stopRecord();
    }
}
export function startListen(memberid)
{
    if (Platform.OS == 'android')
    {
        curmemberid=memberid;
        initTalkService();
        toggle_listen(1,memberid);
        AudioWrapperManager.startListen();
        isListening=true;
    }
}
export function stopListen(memberid)
{
    if (Platform.OS == 'android')
    {
        toggle_listen(0,memberid);
        curmemberid=memberid;
        AudioWrapperManager.stopListen();
    }
}

export function setRoomMemberID(rid,memberid)
{
    if(rid && memberid)
    {
        if (Platform.OS == 'android'){
            AudioWrapperManager.setRoomMemberID(rid,memberid);
        }

    }
    else{
        if(isListening)
        {
            stopListen();
        }
        if(isSending)
        {
            stopSending();
        }
    }
}



export function stopAll()
{
    stop();
    stopRecording();
    stopListen(curmemberid);
    stopSending();
}

