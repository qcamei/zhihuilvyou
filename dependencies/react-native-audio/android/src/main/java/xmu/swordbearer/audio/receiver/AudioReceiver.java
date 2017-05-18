package xmu.swordbearer.audio.receiver;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

import xmu.swordbearer.audio.NetConfig;
import xmu.swordbearer.audio.SocketManager;

import android.util.Log;

public class AudioReceiver{
	String LOG = "AudioReceiver";
	int port = NetConfig.CLIENT_PORT;// 接收的端口
	DatagramSocket socket;
	DatagramPacket packet;
	boolean isRunning = false;
	private byte[] roomByte;
	private byte[] packetBuf = new byte[1024];
	private int packetSize = 1024;
	/*
	 * 开始接收数据
	 */
	public void startRecieving() {
		isRunning=true;
		SocketManager.getInstance().startListening();
		AudioDecoder.getInstance().startDecoding();
		AudioPlayer.getInstance().startPlaying();
	}

	/*
	 * 停止接收数据
	 */
	public boolean stopRecieving() {
		if(isRunning)
		{
			isRunning = false;
			SocketManager.getInstance().stopListening();
			AudioDecoder.getInstance().stopDecoding();
			AudioPlayer.getInstance().stopPlaying();
			return  true;
		}
		return false;
	}
}
