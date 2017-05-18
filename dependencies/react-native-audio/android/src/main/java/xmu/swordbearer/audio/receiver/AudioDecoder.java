package xmu.swordbearer.audio.receiver;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import xmu.swordbearer.audio.AudioConfig;
import xmu.swordbearer.audio.Speex;
import xmu.swordbearer.audio.data.AudioData;
import xmu.swordbearer.audio.sender.AudioEncoder;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.AudioTrack;
//import android.support.annotation.RequiresPermission;
import android.util.Log;

public class AudioDecoder implements Runnable {

	String LOG = "AudioDecoder";
	private static AudioDecoder decoder;
	private final Object mutex = new Object();
	public static int encoder_packagesize = 512;

	private byte[] decodedData = new byte[1024];// data of decoded
	private boolean isDecoding = false;
	private List<ReadData> dataList = null;
	private Speex speex = new Speex();
	private Thread thread;

	public static AudioDecoder getInstance() {
		if (decoder == null) {
			decoder = new AudioDecoder();
		}
		return decoder;
	}

	private AudioDecoder() {
		this.dataList = Collections.synchronizedList(new LinkedList<ReadData>());
	}

	/*
	 * add Data to be decoded
	 *
	 * @ data:the data recieved from server
	 *
	 * @ size:data size
	 */
	public void addData(byte[] data, int size) {
//		Log.e("1111","添加解压包");
		ReadData rd = new ReadData();
		synchronized (mutex) {
			rd.index=0;
			rd.index = data[3] & 0xFF |
					(data[2] & 0xFF) << 8 |
					(data[1] & 0xFF) << 16 |
					(data[0] & 0xFF) << 24;  ;
			rd.size = size-4;
			System.arraycopy(data, 4, rd.ready, 0, size-4);
			dataList.add(rd);
		}
	}

	/*
	 * start decode AMR data
	 */
	public void startDecoding() {
		dataList.clear();
		if(thread==null)
		{
			thread = new Thread( this );
			thread.start();
		}
	}
	private int lastidx = 0;
	public void run() {
		isDecoding = true;
		speex.init();
		int decodeSize = 0;
		while (isDecoding) {
			while (dataList.size() > 0) {
				ReadData encodedData = dataList.remove(0);
				short[] decoded = new short[160];
				decodeSize = speex.decode(encodedData.ready,decoded,160);
//				if(encodedData.index - lastidx >1)
//				{
//					Log.e(LOG, "丢包一次 " + encodedData.index + "----" + (encodedData.index - lastidx));
//				}
//				lastidx = encodedData.index;

				if (decodeSize > 0) {
					AudioPlayer.getInstance().addData( decoded,decodeSize,encodedData.index );
				}
			}
		}
		thread=null;
		dataList.clear();
	}

	public void stopDecoding() {
		isDecoding = false;
	}
	class ReadData {
		private int index;
		private int size;
		private byte[] ready = new byte[encoder_packagesize];
	}
}