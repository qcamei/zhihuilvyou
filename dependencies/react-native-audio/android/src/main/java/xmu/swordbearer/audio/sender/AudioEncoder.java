package xmu.swordbearer.audio.sender;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import xmu.swordbearer.audio.SocketManager;
import xmu.swordbearer.audio.Speex;
import xmu.swordbearer.audio.data.AudioData;
import android.util.Log;

public class AudioEncoder implements Runnable {
	String LOG = "AudioEncoder";
	private static AudioEncoder encoder;
	private boolean isEncoding = false;
	private List<ReadData> dataList = null;
	private Speex speex = new Speex();
	private final Object mutex = new Object();
	public static int encoder_packagesize = 1024;
	private byte[] processedData = new byte[encoder_packagesize];


	public static AudioEncoder getInstance() {
		if (encoder == null) {
			encoder = new AudioEncoder();
		}
		return encoder;
	}

	private AudioEncoder() {
		dataList = Collections.synchronizedList(new LinkedList<ReadData>());
		speex.init();
	}

	public void addData(short[] data, int size) {
		ReadData rd = new ReadData();
		synchronized (mutex) {
			rd.size = size;
			System.arraycopy(data, 0, rd.ready, 0, size);
			dataList.add(rd);
		}
	}

	/*
	 * start encoding
	 */
	public void startEncoding() {
//		System.out.println(LOG + "start encode thread");
		synchronized (mutex) {
			if (isEncoding) {
//			Log.e(LOG, "encoder has been started  !!!");
				return;
			}
			new Thread(this).start();
		}

	}

	/*
	 * end encoding
	 */
	public void stopEncoding() {
		this.isEncoding = false;
	}

	public void run() {
//		Log.e(LOG,"开始录音");
		int encodeSize = 0;
		byte[] encodedData = new byte[256];
		/**房间ID*/
		SocketManager.getInstance().setRoomID();
		/**线程优先级*/
		android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_URGENT_AUDIO);

		isEncoding = true;
		while (isEncoding) {
			if (dataList.size() == 0) {
				try {
					Thread.sleep(20);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				continue;
			}
			if (isEncoding) {
				ReadData rawdata = dataList.remove(0);
				encodeSize = Speex.encode(rawdata.ready, 0, processedData, rawdata.size);

//				AudioData rawData = dataList.remove(0);
//				encodedData = new byte[rawData.getSize()];
//				encodeSize = AudioCodec.audio_encode(rawData.getRealData(), 0,
//						rawData.getSize(), encodedData, 0);
//				System.out.println();
				if (encodeSize > 0) {
					SocketManager.getInstance().sendAudioData(processedData, encodeSize);
					// clear data
					processedData = new byte[encoder_packagesize];
				}
			}
		}
//		Log.e(LOG,"停止录音");
	}
	class ReadData {
		private int size;
		private short[] ready = new short[encoder_packagesize];
	}
}
