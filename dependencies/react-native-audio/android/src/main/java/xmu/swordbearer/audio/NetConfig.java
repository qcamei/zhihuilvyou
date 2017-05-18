package xmu.swordbearer.audio;

import android.util.Log;

/*
 * UDP configure
 */
public class NetConfig {
	public static String SERVER_HOST = "192.168.1.170";// server ip
	public static int SERVER_PORT = 5656;// server port
	public static int CLIENT_PORT = 5757;// client port
	public static int ROOM_ID = 0;
	public static int MEMBER_ID = 0;

	public static void setServerHost(String ip) {
		SERVER_HOST = ip;
	}
	public static void setServerPort(int port) {
		SERVER_PORT = port;
	}
	public static void setListenPort(int port) {
		CLIENT_PORT = port;
	}
	public static void setRoomId(int id) {
		ROOM_ID = id;
	}
	public static void setMemberId(int id) {
		MEMBER_ID = id;
	}
}
