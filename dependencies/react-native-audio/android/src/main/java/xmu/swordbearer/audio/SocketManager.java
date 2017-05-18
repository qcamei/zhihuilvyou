package xmu.swordbearer.audio;

import android.util.Log;

import com.rnim.rn.audio.AudioWrapperManager;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Timer;
import java.util.TimerTask;

import xmu.swordbearer.audio.data.AudioData;
import xmu.swordbearer.audio.receiver.AudioDecoder;
import xmu.swordbearer.audio.receiver.AudioReceiver;

/**
 * Created by admin on 2017/2/22.
 */

public class SocketManager implements Runnable{
    private DatagramSocket socket;
    private static SocketManager instance;
    private DatagramPacket packet;
    private boolean isRuning = false;
    private byte[] packetBuf = new byte[1024];
    private int packetSize = 1024;
    private InetAddress ip;
    private byte[] roomByte;
    private byte[] room_member_Byte;
    private Timer timer;
    private int sendFailCount = 0;
    private int checkFailCount = 0;
    public static SocketManager getInstance()
    {
        if(instance == null)
        {
            instance = new SocketManager();
        }
        return instance;
    }
    public void connect(boolean bReconnect)
    {
        if(bReconnect || socket==null)
        {
            try {
                if(socket!=null)
                {
                    socket.close();
                }
                ip = InetAddress.getByName(NetConfig.SERVER_HOST);
                socket = new DatagramSocket();
                packet = new DatagramPacket(packetBuf, packetSize);

                new Thread(this).start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    public void startListening()
    {
        connect(true);
        isRuning=true;
        checkConnectd();
    }
    private void checkConnectd()
    {
        setRoom_MemberID();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                // task to run goes here
                checkFailCount++;
                if(checkFailCount>=30)
                {
                    if(timer!=null)
                    {
                        timer.cancel();
                        timer=null;
                    }
                    checkFailCount=0;
                    AudioWrapperManager.listenFail();
                }
//                Log.e("SocketSend","send_room_member");
                send( room_member_Byte,8 );
            }
        };
        if(timer==null)
        {
            timer = new Timer();
        }
        long delay = 0;
        long intevalPeriod = 1 * 500;
        // schedules the task to be run in an interval
        timer.scheduleAtFixedRate(task, delay, intevalPeriod);
    }
    public void stopListening()
    {
        isRuning=false;
        if(timer!=null)
        {
            checkFailCount=0;
            timer.cancel();
            timer=null;
        }
    }
    public void send(byte[] data,int size)
    {
        try {
            DatagramPacket dataPacket=new DatagramPacket(data, size, ip, NetConfig.SERVER_PORT);
            dataPacket.setData(data);
            socket.send( dataPacket );
//            Log.e("socket","发送"+dataPacket.getLength());
        }
        catch (Exception e)
        {
//            Log.e("SocketSend","发送失败！");
        }
    }
    public void setRoomID()
    {
        int id = NetConfig.ROOM_ID;
        roomByte = new byte[4];
        roomByte[0] = (byte) ((id>>24) & 0xFF);
        roomByte[1] = (byte) ((id>>16)& 0xFF);
        roomByte[2] = (byte) ((id>>8)&0xFF);
        roomByte[3] = (byte) (id & 0xFF);
    }
    public void setRoom_MemberID()
    {
        int id = NetConfig.ROOM_ID;
        long memberID = NetConfig.MEMBER_ID;
        room_member_Byte = new byte[8];
        room_member_Byte[0] = (byte) ((id>>24) & 0xFF);
        room_member_Byte[1] = (byte) ((id>>16)& 0xFF);
        room_member_Byte[2] = (byte) ((id>>8)&0xFF);
        room_member_Byte[3] = (byte) (id & 0xFF);
        room_member_Byte[4] = (byte) ((memberID>>24) & 0xFF);
        room_member_Byte[5] = (byte) ((memberID>>16)& 0xFF);
        room_member_Byte[6] = (byte) ((memberID>>8)&0xFF);
        room_member_Byte[7] = (byte) (memberID & 0xFF);
    }
    /*
     * send data to server
     */
    private int sendIdx=1;
    public void sendAudioData(byte[] data, int size) {
        try {
            AudioData encodedData = new AudioData();
            encodedData.setSize(size);
            byte[] tempData = new byte[size];
            System.arraycopy(data, 0, tempData, 0, size);
            byte[] byte_idx = new byte[4];
            byte_idx[0] = (byte) ((sendIdx>>24) & 0xFF);
            byte_idx[1] = (byte) ((sendIdx>>16)& 0xFF);
            byte_idx[2] = (byte) ((sendIdx>>8)&0xFF);
            byte_idx[3] = (byte) (sendIdx & 0xFF);

            byte[] byte_3 = new byte[4+size+4];

            System.arraycopy(roomByte, 0, byte_3, 0, roomByte.length);
            System.arraycopy(byte_idx, 0, byte_3, roomByte.length, byte_idx.length);
            System.arraycopy(tempData, 0, byte_3, roomByte.length + byte_idx.length, tempData.length);

            SocketManager.getInstance().send(byte_3,byte_3.length);
            sendFailCount=0;
            sendIdx++;
        } catch (Exception e) {
            sendFailCount++;
            if(sendFailCount>=300)
            {
                //语音发送失败
                AudioWrapperManager.recordFail();
                sendFailCount=0;
            }
            else{
                connect(true);
            }
        }
    }
    public void run()
    {
        while (true)
        {
            if(isRuning)
            {
                try {
                    socket.receive(packet);
//                    Log.e("SocketListen", "收到包 "+ String.valueOf( packet.getLength() ));
                    if(packet.getLength()<=8 && timer!=null){
                        checkFailCount=0;
                        timer.cancel();
                        timer=null;
                    }
                    else if(packet.getLength()>=38)
                    {
                        // 每接收一个UDP包，就交给解码器，等待解码
                        AudioDecoder.getInstance().addData(packet.getData(), packet.getLength());
                    }
                }
                catch (Exception e)
                {
//                    Log.e("SocketListenError","接收出错啦！");
                }
            }
            else {
                try{
                    Thread.sleep( 20 );
                }
                catch (Exception e)
                {

                }
            }
        }
    }
}
