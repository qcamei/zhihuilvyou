package com.rnim.rn.audio;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import xmu.swordbearer.audio.NetConfig;
import xmu.swordbearer.audio.receiver.AudioReceiver;
import xmu.swordbearer.audio.sender.AudioRecorder;

public class AudioWrapperManager extends ReactContextBaseJavaModule {

    private AudioRecorder audioRecorder;
    private AudioReceiver audioReceiver;
    private AudioPlayerManager audioP;
    private AudioRecorderManager audioR;

    public static AudioWrapperManager instanceAudioWrapper;
    private Context context;
    public AudioWrapperManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }
    public void setAudioPlayerManager(AudioPlayerManager ap)
    {
        audioP=ap;
    }
    public void setAudioRecorderManager(AudioRecorderManager ar)
    {
        audioR = ar;
    }
    @Override
    public String getName() {
        return "AudioWrapperManager";
    }

    public static AudioWrapperManager getInstance(ReactApplicationContext reactContext,boolean bNew) {
        if (bNew || null == instanceAudioWrapper) {
            instanceAudioWrapper = new AudioWrapperManager(reactContext);
        }
        return instanceAudioWrapper;
    }
    @ReactMethod
    public void setServerAddress(String ip,int port,int listenPort,Promise promise) {
        NetConfig.setServerHost(ip);
        NetConfig.setServerPort(port);
        NetConfig.setListenPort(listenPort);
    }
    @ReactMethod
    public void setRoomMemberID(int rid,int mid,Promise promise) {
        NetConfig.setRoomId(rid);
        NetConfig.setMemberId(mid);
    }
    @ReactMethod
    public void startRecord(Promise promise) {
        stopOther(promise,1);
        if (null == audioRecorder) {
            audioRecorder = new AudioRecorder();
        }
        audioRecorder.startRecording();
    }
    @ReactMethod
    public void stopRecord(Promise promise) {
        if (audioRecorder != null)
        {
            if(audioRecorder.stopRecording())
            {
                sendEvent("stopSending",null);
            }
        }
    }
    @ReactMethod
    public void startListen(Promise promise) {
        Log.i( String.valueOf( System.currentTimeMillis()), "startListen:1 " );
        stopOther(promise,2);
        if (null == audioReceiver) {
            audioReceiver = new AudioReceiver();
        }
        audioReceiver.startRecieving();
    }
    @ReactMethod
    public void stopListen(Promise promise) {
        if (audioReceiver != null) {
            WritableMap event = Arguments.createMap();
            boolean bOpenBefore = audioReceiver.stopRecieving();
            event.putString("bOpenBefore",String.valueOf( bOpenBefore ));
            sendEvent("stopListening",null);
        }
    }
    private void stopOther(Promise promise,int ntype)
    {
        if(audioP!=null && audioP.isPlaying)
        {
            audioP.stop( promise );
        }
        if(audioR!=null && audioR.isRecording)
        {
            audioR.stopRecording( promise );
        }
        if(ntype==1)
        {
            stopListen(promise);
        }
        else if(ntype==2)
        {
            stopRecord(promise);
        }
    }
    private void sendEvent(String eventName, Object params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public static void recordFail() {
        if (instanceAudioWrapper!=null &&  instanceAudioWrapper.audioRecorder != null)
        {
            instanceAudioWrapper.audioRecorder.stopRecording();
            instanceAudioWrapper.sendEvent("snedSoundFail",null);
        }
    }

    public static void listenFail() {
        if (instanceAudioWrapper!=null &&  instanceAudioWrapper.audioRecorder != null)
        {
            instanceAudioWrapper.audioReceiver.stopRecieving();
            instanceAudioWrapper.sendEvent("listenSoundFail",null);
        }
    }
}
