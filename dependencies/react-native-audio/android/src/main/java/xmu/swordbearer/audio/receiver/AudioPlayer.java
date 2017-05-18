package xmu.swordbearer.audio.receiver;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import xmu.swordbearer.audio.AudioConfig;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.util.Log;

public class AudioPlayer implements Runnable {
	String LOG = "AudioPlayer ";
	private static AudioPlayer player;

//	private List<ReadData> dataList = null;

	private HashMap hashMap = new HashMap();

	private boolean isPlaying = false;

	private AudioTrack audioTrack;
	//
	private List<ReadData> dataList = null;

	private final Object mutex = new Object();

	private AudioPlayer() {
		dataList = Collections.synchronizedList(new LinkedList<ReadData>());
	}

	public static AudioPlayer getInstance() {
		if (player == null) {
			player = new AudioPlayer();
		}
		return player;
	}
	private long lastAddDataTime=0;
	public void addData(short[] rawData, int size,int index) {
		ReadData rd = new ReadData();
		synchronized (mutex) {
			rd.index=index;
			rd.size = size;
			System.arraycopy(rawData, 0, rd.ready, 0, size);

			long now = System.currentTimeMillis();
			//距上次收到数据时间差太久
//			if(lastWriteData==null || index-lastWriteData.index >= 400 || lastWriteData.index - index >= 400 || )
			if(lastWriteData==null || hashMap.size() < 1 || now - lastAddDataTime > 2000)
			{
				hashMap.clear();
				lastWriteData = rd;
				firstWrite = true;
				firstWriteTime=0;writeCount=0;
				count1=0;count2=0;count3=0;
			}
			else if(index<=lastWriteData.index)
			{
				count3++;
				lastAddDataTime = now;
				return;
			}
			lastAddDataTime = now;
//			hashMap.put(index,rd);
			dataList.add( rd );
		}
	}
	private ReadData lastWriteData;
	private boolean firstWrite=false;
	private int lastWriteIndex=0;
	private int count1=0;//自己填充的
	private int count2=0;//正常
	private int count3=0;//服务返回延迟被抛弃了的
	private void writeToAudioTrack()
	{
		try {
			if(lastWriteData==null) return;
			ReadData data;
			if(firstWrite)
			{
				data = lastWriteData;
				lastWriteIndex = lastWriteData.index;
				firstWrite=false;
			}
			else
			{
				Log.e("size","__" + hashMap.size());
				if(hashMap.size() < 1)
				{
					Thread.sleep(1000);
					writeCount+=50;
				}
				else if(hashMap.size() >= 200)
				{
					//剩下太多
					lastWriteData = null;
					return;
				}
				if(!hashMap.containsKey(lastWriteData.index+1))
				{
					data = getReadData(lastWriteData.index+1,lastWriteIndex);
					count1++;
				}
				else
				{
					data = (ReadData) hashMap.get(lastWriteData.index+1);
					hashMap.remove(lastWriteData.index+1);
					lastWriteIndex = data.index;
					count2++;
				}
			}
			if(count1 +count2>=100)
			{
				Log.e("不正常"+count1,"正常"+count2 + "__" + count3);
				if(count3 >= 5)
				{
					Thread.sleep(1000);
					writeCount+=50;
				}
//				if(count1 >= 40)
//				{
//					lastWriteData = null;
//					count1=0;count2=0;count3=0;
//					return;
//				}
				count1=0;count2=0;count3=0;
			}
			lastWriteData = data;
			//		dataList.add(data);
			audioTrack.write(data.ready, 0, data.size);
		}
		catch (Exception e)
		{

		}
	}
	private ReadData getReadData(int idx,int lastIdx)
	{
		ReadData data = new ReadData();
		data.size = lastWriteData.size;
		data.index=idx;
		if(idx-lastIdx >= 10)
		{
			data.ready = new short[lastWriteData.size];
		}
		else if(idx-lastIdx == 1)
		{
			data.ready = lastWriteData.ready;
		}
		else
		{
			float decay = 0.8f;
			short[] ready = new short[lastWriteData.size];
			for(int i=0;i<lastWriteData.size;i++)
			{
				ready[i] = (short) Math.round(lastWriteData.ready[i] * decay);
			}
			data.ready = ready;
		}
		return data;
	}
	/*
	 * init Player parameters
	 */
	private boolean initAudioTrack() {
		int bufferSize = AudioTrack.getMinBufferSize(AudioConfig.SAMPLERATE, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT);
		if (bufferSize < 0) {
			return false;
		}
		audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, AudioConfig.SAMPLERATE, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT,
				bufferSize, AudioTrack.MODE_STREAM);
		audioTrack.play();
		return true;
	}

	public void startPlaying() {
		dataList.clear();
		hashMap.clear();
		if(isPlaying)
		{
			return;
		}
		new Thread(this).start();
	}

	public void run() {
		if (!initAudioTrack()) {
			return;
		}
		this.isPlaying = true;
		try {
			playFromList();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	private long firstWriteTime = 0;
	private int writeCount = 0;
//	private void playFromList() throws IOException {
//		while (isPlaying) {
//			long now = System.currentTimeMillis();
//			if (firstWriteTime==0 || (now-firstWriteTime)/20 >= writeCount) {
//				writeToAudioTrack();
//				writeCount++;
//				if(firstWriteTime==0){
//					firstWriteTime=now;
//				}
//
//			}
//
//		}
//	}
		private void playFromList() throws IOException {
		while (isPlaying) {
			while (dataList.size() > 0) {
				ReadData dt = dataList.remove( 0 );
				audioTrack.write(dt.ready, 0, dt.size);
			}
			try {
				Thread.sleep(10);
			} catch (InterruptedException e) {
			}
		}
	}

	public void stopPlaying() {
		hashMap.clear();
		dataList.clear();
		this.isPlaying = false;
		if (this.audioTrack != null) {
			if (this.audioTrack.getPlayState() == AudioTrack.PLAYSTATE_PLAYING) {
				this.audioTrack.stop();
				this.audioTrack.release();
			}
		}
	}
	class ReadData {
		private int index;
		private int size;
		private short[] ready = new short[1024];
	}
}
