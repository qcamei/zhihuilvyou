package xmu.swordbearer.audio.sender;

import xmu.swordbearer.audio.AudioConfig;
import xmu.swordbearer.audio.SocketManager;
import android.media.AudioRecord;
import android.util.Log;

public class AudioRecorder implements Runnable {

	String LOG = "Recorder ";

	private boolean isRecording = false;
	private AudioRecord audioRecord;

	private static final int BUFFER_FRAME_SIZE = 480;
	private int audioBufSize = 0;
	private final Object mutex = new Object();
	// the size of audio read from recorder
	private int bufferRead = 0;
	// samples size
	public static int packagesize = 160;
	/*
	 * start recording
	 */
	public void startRecording() {
		audioBufSize = AudioRecord.getMinBufferSize(AudioConfig.SAMPLERATE,AudioConfig.RECORDER_CHANNEL_CONFIG, AudioConfig.AUDIO_FORMAT);
//		Log.e("编码大小","" + audioBufSize);
		if (audioBufSize == AudioRecord.ERROR_BAD_VALUE) {
//			Log.e(LOG, "audioBufSize error");
			return;
		}
		// 初始化recorder
		if (null == audioRecord) {
			audioRecord = new AudioRecord(AudioConfig.AUDIO_RESOURCE,
					AudioConfig.SAMPLERATE,
					AudioConfig.RECORDER_CHANNEL_CONFIG,
					AudioConfig.AUDIO_FORMAT, audioBufSize);
		}
		synchronized (mutex) {
			if (this.isRecording) {
				mutex.notify();
			}
		}
		/**socket连接*/
		SocketManager.getInstance().connect(false);
		new Thread(this).start();
	}

	/*
	 * stop
	 */
	public boolean stopRecording() {
		if(this.isRecording)
		{
			this.isRecording = false;
			return true;
		}
		return false;
	}

	public boolean isRecording() {
		return isRecording;
	}

	public void run() {

		AudioEncoder encoder = AudioEncoder.getInstance();
		encoder.startEncoding();
		this.isRecording = true;

		synchronized (mutex) {
			while (!this.isRecording) {
				try {
					mutex.wait();
				} catch (InterruptedException e) {
					throw new IllegalStateException("Wait() interrupted!", e);
				}
			}
		}
		android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_URGENT_AUDIO);
		short[] tempBuffer = new short[packagesize];
		audioRecord.startRecording();
		while (this.isRecording) {
			bufferRead = audioRecord.read(tempBuffer, 0, packagesize);
			if(bufferRead>0)
			{
				encoder.addData(tempBuffer, bufferRead);
			}
			try {
				Thread.sleep(10);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		audioRecord.stop();
		encoder.stopEncoding();
	}
}
