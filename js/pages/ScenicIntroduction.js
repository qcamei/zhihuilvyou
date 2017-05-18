import React, { Component } from 'react';
import
{
    View,
    ScrollView,
    Platform,
    Image,
    Text,
    StyleSheet,
} from 'react-native';
import { scaleSize } from '../ScreenUtils'
import Share from '../imgs/new_icons/shareScenic@3x.png'
import Like from '../imgs/new_icons/likeScenic@3x.png'
import Bac from '../imgs/new_icons/scenicbac@3x.png'
import Loc from '../imgs/new_icons/loc_scenic@3x.png'
import Phone from '../imgs/new_icons/phone_scenic@3x.png'
import Left from '../imgs/new_icons/leftT@3x.png'
import Right from '../imgs/new_icons/rightT@3x.png'
import female from '../imgs/new_icons/nvshen.png'
import Icon from '../imgs/new_icons/comIcon@3x.png'
import P1 from '../imgs/new_icons/p1@3x.png'
import P2 from '../imgs/new_icons/p2@3x.png'
import P3 from '../imgs/new_icons/p3@3x.png'
import L1 from '../imgs/new_icons/L1@3x.png'
import L2 from '../imgs/new_icons/L2@3x.png'
import L3 from '../imgs/new_icons/L3@3x.png'
import share from '../imgs/new_icons/share.png'
import comment from '../imgs/new_icons/comment.png'
import picture from '../imgs/new_icons/picture.png'
import location from '../imgs/new_icons/location.png'
import moreright from '../imgs/new_icons/moreRight.png'
import { wndWidth, drawerWidth, wndHeight } from '../Global'
let statusbarHeight = (Platform.OS === 'android' && Platform.Version <= 19) ? (Platform.OS === 'android' ? 0 : 0) : scaleSize(60);
export default class ScenicIntroduction extends Component
{
    render()
    {
        return (

            <View style={styles.container} >
                <View style={styles.headbar}>
                    <Text style={styles.hedaText}>返回</Text>
                    <View style={styles.iconView}>
                        <Image style={styles.headLike} source={Like} />
                        <View style={styles.textView}>
                            <Text style={styles.rightText}>26</Text>
                        </View>
                        <Image style={styles.headShare} source={Share} />
                    </View>
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ height: scaleSize(580), width: wndWidth, backgroundColor: 'white' }}>
                        <View style={styles.bacPic}>
                            <Image style={{ flex: 1 }} source={Bac} />
                        </View>
                        <View style={styles.intro}>
                            <View style={styles.title}>
                                <Text style={styles.titleText}>沙拉怪兽美式餐厅</Text>
                            </View>
                            <View style={styles.dec}>
                                <Text style={styles.dectext}>健康，新鲜的沙拉为主的美式餐厅</Text>
                            </View>
                            <View style={styles.time}>
                                <Text style={styles.dectime}>营业时间：10:00-22:00</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.detail}>
                        <View style={styles.viewphone}>
                            <View style={styles.navigation}>
                                <Image style={styles.locimg} source={Loc} resizeMode={'stretch'} />
                                <Text style={styles.navtext}>导航到这里</Text>
                            </View>
                            <View style={styles.telview}>
                                <View style={styles.tel}>
                                    <Image style={styles.phoneImg} source={Phone} resizeMode={'stretch'} />
                                    <Text style={styles.phoneText}>0592-6466666</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.detxtview}>
                            <Text style={styles.detext}>salad monster是厦门首家以健康，新鲜的沙拉为主的美式餐厅，餐厅提供了一个于简单自在之中享受用餐时间，于美味健康之中感受世间曼妙的就餐场所，有比脸的木盘沙拉，汉堡，三明治，意大利面，炖饭，牛排等各类主食，亦有小吃，咖啡，新鲜果汁，创意饮品，特色调酒，蛋糕等休闲辅食，皆为绿色低热，美味低脂的健康食品，倾力打造休闲时尚的就餐空间让食客品尝到实在，用心，平衡的美食。 </Text>
                        </View>
                    </View>
                    <View style={styles.usercomment}>
                        <View style={styles.titleCom}>
                            <Image style={styles.leftImg} source={Left} resizeMode={'stretch'} />
                            <Text style={styles.userText}>用户点评</Text>
                            <Image style={styles.leftImg} source={Right} resizeMode={'stretch'} />
                        </View>
                        <View style={styles.comView}>
                            <View style={styles.item1}>
                                <Image style={styles.item1Img} source={Icon} resizeMode={'stretch'} />
                                <View style={styles.itemRight}>
                                    <View style={styles.topcom}>
                                        <Text style={{ fontSize: scaleSize(28), color: '#565656' }}>秘密icon</Text>
                                        <Image style={{ marginLeft: scaleSize(10), }} source={female} />
                                    </View>
                                    <Text style={styles.contentText}>挺出名的美式餐厅，虽然名字叫沙拉，不过一直以为是典型西餐，没想到确实是以木盆沙拉为主打，其他的种类比较少，不过整体水平不错</Text>
                                    <View style={styles.listViewStyle}>
                                        <Image source={P1} style={styles.iconStyle} resizeMode={'stretch'} />
                                        <Image source={P2} style={styles.iconStyle} resizeMode={'stretch'} />
                                        <Image source={P3} style={styles.iconStyle} resizeMode={'stretch'} />
                                    </View>
                                    <View style={styles.itemBottom}>
                                        <Image source={share} style={{ width: scaleSize(42), height: scaleSize(42) }} />
                                        <Text style={styles.bottomText}>分享</Text>
                                        <Image source={Like} style={styles.imgBottom} />
                                        <Text style={styles.bottomText}>赞</Text>
                                        <Image source={comment} style={styles.imgBottom} />
                                        <Text style={styles.bottomText}>评论</Text>
                                    </View>
                                    <View style={{ width: wndWidth - scaleSize(60), height: scaleSize(2), marginLeft: scaleSize(30), marginRight: scaleSize(30), backgroundColor: '#f5f5f5' }} />
                                </View>
                            </View>
                            <View style={styles.item1}>
                                <Image style={styles.item1Img} source={Icon} resizeMode={'stretch'} />
                                <View style={styles.itemRight}>
                                    <View style={styles.topcom}>
                                        <Text style={{ fontSize: scaleSize(28), color: '#565656' }}>秘密icon</Text>
                                        <Image style={{ marginLeft: scaleSize(10), }} source={female} />
                                    </View>
                                    <Text style={styles.contentText}>挺出名的美式餐厅，虽然名字叫沙拉，不过一直以为是典型西餐，没想到确实是以木盆沙拉为主打，其他的种类比较少，不过整体水平不错</Text>
                                    <View style={styles.listViewStyle}>
                                        <Image source={P1} style={styles.iconStyle} resizeMode={'stretch'} />
                                        <Image source={P2} style={styles.iconStyle} resizeMode={'stretch'} />
                                        <Image source={P3} style={styles.iconStyle} resizeMode={'stretch'} />
                                    </View>
                                    <View style={styles.itemBottom}>
                                        <Image source={share} style={{ width: scaleSize(42), height: scaleSize(42) }} />
                                        <Text style={styles.bottomText}>分享</Text>
                                        <Image source={Like} style={styles.imgBottom} />
                                        <Text style={styles.bottomText}>赞</Text>
                                        <Image source={comment} style={styles.imgBottom} />
                                        <Text style={styles.bottomText}>评论</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.bot}>
                            <View style={styles.more}>
                                <Text style={styles.textmore}>查看更多</Text>
                                <Image style={{ width: scaleSize(20), height: scaleSize(24), marginLeft: scaleSize(10) }} resizeMode={'stretch'} source={moreright} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.likecomment}>
                        <View style={styles.titleCom}>
                            <Image style={styles.leftImg} source={Left} resizeMode={'stretch'} />
                            <Text style={styles.userText}>可能喜欢</Text>
                            <Image style={styles.leftImg} source={Right} resizeMode={'stretch'} />
                        </View>
                        <View style={styles.likeItem}>
                            <Image source={L1} style={styles.likeImg} resizeMode={'stretch'} />
                            <View style={styles.likedec}>
                                <Text style={styles.resname}>那私厨花园餐厅</Text>
                                <View style={styles.resloc}>
                                    <Text style={styles.loctext}>鼓浪屿安海路38号</Text>
                                    <Text style={styles.textlie}>西餐</Text>
                                </View>
                                <Text style={styles.fee}>人均: ¥ 120</Text>
                                <View style={styles.dis}>
                                    <Image style={{ width: scaleSize(24), height: scaleSize(32) }} source={location} />
                                    <Text style={styles.distext}>距离5km</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.likeItem}>
                            <Image source={L2} style={styles.likeImg} resizeMode={'stretch'} />
                            <View style={styles.likedec}>
                                <Text style={styles.resname}>RENEXT里遇</Text>
                                <View style={styles.resloc}>
                                    <Text style={styles.loctext}>鹭江道3号和平码头</Text>
                                    <Text style={styles.textlie}>西餐</Text>
                                </View>
                                <Text style={styles.fee}>人均: ¥ 80</Text>
                                <View style={styles.dis}>
                                    <Image style={{ width: scaleSize(24), height: scaleSize(32) }} source={location} />
                                    <Text style={styles.distext}>距离5km</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.likeItem}>
                            <Image source={L3} style={styles.likeImg} resizeMode={'stretch'} />
                            <View style={styles.likedec}>
                                <Text style={styles.resname}>   </Text>
                                <View style={styles.resloc}>
                                    <Text style={styles.loctext}>鼓浪屿安海路38号</Text>
                                    <Text style={styles.textlie}>西餐</Text>
                                </View>
                                <Text style={styles.fee}>人均: ¥ 195</Text>
                                <View style={styles.dis}>
                                    <Image style={{ width: scaleSize(24), height: scaleSize(32) }} source={location} />
                                    <Text style={styles.distext}>距离5km</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    likecomment: {
        flex: 1,
        marginTop: scaleSize(20),
        paddingBottom: scaleSize(50),
        backgroundColor: '#ffffff'
    },
    distext: {
        marginLeft: scaleSize(10),
        fontSize: scaleSize(27),
        color: '#414142',
    },
    dis: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        flexDirection: 'row'
    },
    fee: {
        marginTop: scaleSize(18),
        fontSize: scaleSize(26),
        color: '#303030',
    },
    textlie: {
        fontSize: scaleSize(24),
        color: '#353535',
        marginLeft: scaleSize(20)
    },
    loctext: {
        fontSize: scaleSize(24),
        color: '#353535',
    },
    resloc: {
        marginTop: scaleSize(18),
        flexDirection: 'row',
        height: scaleSize(24),
        alignItems: 'center'
    },
    resname: {
        fontSize: scaleSize(28),
        color: '#222226',
        fontWeight: 'bold',
        marginTop: scaleSize(16)
    },
    likedec: {
        marginLeft: scaleSize(28),
        flex: 1
    },
    likeImg: {
        width: scaleSize(350),
        height: scaleSize(260)
    },
    likeItem: {
        flexDirection: 'row',
        marginTop: scaleSize(30),
        height: scaleSize(260),
        marginLeft: scaleSize(30),
        flex: 1,
    },
    textmore: {
        fontSize: scaleSize(24),
        color: '#787878'
    },
    more: {
        flexDirection: 'row',
        height: scaleSize(40),
        width: scaleSize(160),
        borderRadius: scaleSize(10),
        borderWidth: scaleSize(2),
        borderColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',

    },
    bot: {
        marginTop: scaleSize(20),
        flexDirection: 'row',
        width: wndWidth,
        height: scaleSize(80),
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomText: {
        fontSize: scaleSize(24),
        color: '#c9c9c9',
        marginLeft: scaleSize(6)
    },
    imgBottom: {
        width: scaleSize(42),
        height: scaleSize(42),
        marginLeft: scaleSize(40)
    },
    itemBottom: {
        marginTop: scaleSize(24),
        marginBottom: scaleSize(10),
        width: wndWidth - scaleSize(30),
        height: scaleSize(44),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    iconStyle: {
        marginLeft: scaleSize(10),
        marginTop: scaleSize(20),
        width: scaleSize(160),
        height: scaleSize(160),
    },
    listViewStyle: {
        // 主轴方向  
        marginLeft: scaleSize(120),
        width: scaleSize(634),
        flexDirection: 'row',
        // 一行显示不下,换一行  
        flexWrap: 'wrap',
        // 侧轴方向  
        alignItems: 'center', // 必须设置,否则换行不起作用  
    },
    contentText: {
        marginLeft: scaleSize(130),
        marginTop: scaleSize(20),
        color: '#3f3f3f',
        fontSize: scaleSize(26),
        fontWeight: 'bold'
    },
    topcom: {
        flexDirection: 'row',
        height: scaleSize(28),
        alignItems: 'center',
        marginLeft: scaleSize(130)
    },
    itemRight: {
        flex: 1,
        marginTop: scaleSize(20),
        marginRight: scaleSize(30),
    },
    item1Img: {
        width: scaleSize(80),
        height: scaleSize(80),
        position: 'absolute',
        top: 0,
        left: scaleSize(30),
    },
    item1: {
        marginTop: scaleSize(20),
        flex: 1,
    },
    comView: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    userText: {
        fontSize: scaleSize(32),
        color: '#282828',
        fontWeight: 'bold',
        marginLeft: scaleSize(12),
        marginRight: scaleSize(12)
    },
    leftImg: {
        width: scaleSize(95),
        height: scaleSize(7)
    },
    titleCom: {
        marginTop: scaleSize(40),
        flexDirection: 'row',
        width: wndWidth,
        height: scaleSize(32),
        justifyContent: 'center',
        alignItems: 'center'
    },
    usercomment: {
        flex: 1,
        marginTop: scaleSize(20),
        backgroundColor: '#ffffff'
    },
    detext: {
        flex: 1,
        fontSize: scaleSize(24),
        color: '#5b5b5b',
        fontWeight: 'bold'
    },
    detxtview: {
        flex: 1,
        marginLeft: scaleSize(30),
        marginRight: scaleSize(30),
        marginBottom: scaleSize(30)
    },
    phoneText: {
        marginLeft: scaleSize(10),
        fontSize: scaleSize(26),
        color: '#70ad5d'
    },
    phoneImg: {
        width: scaleSize(25),
        height: scaleSize(30)
    },
    tel: {
        flexDirection: 'row',
        marginRight: scaleSize(30),
        alignItems: 'center'
    },
    telview: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    navtext: {
        marginLeft: scaleSize(10),
        fontSize: scaleSize(26),
        color: '#70ad5d'
    },
    locimg: {
        width: scaleSize(22),
        height: scaleSize(30)
    },
    navigation: {
        flexDirection: 'row',
        marginLeft: scaleSize(30),
        alignItems: 'center'
    },
    viewphone: {
        marginTop: scaleSize(20),
        flexDirection: 'row',
        height: scaleSize(30),
        width: wndWidth,
        alignItems: 'center',
        marginBottom: scaleSize(26)
    },
    detail: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: scaleSize(20)
    },
    container: {
        flex: 1,
        marginTop: statusbarHeight,
    },
    headbar: {
        width: wndWidth,
        flexDirection: 'row',
        height: scaleSize(80),
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    hedaText: {
        fontSize: scaleSize(34),
        color: '#3b3b3b',
        fontWeight: 'bold',
        marginLeft: scaleSize(30)
    },
    iconView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rightText: {
        fontSize: scaleSize(24),
        color: '#aaaaaa',

    },
    headShare: {
        marginLeft: scaleSize(50),
        marginRight: scaleSize(30),
        height: scaleSize(48),
        width: scaleSize(48)
    },
    textView: {
        position: 'absolute',
        bottom: 0,
        right: scaleSize(98)
    },
    headLike: {
        height: scaleSize(48),
        width: scaleSize(48)
    },
    bacPic: {
        height: scaleSize(340),
        width: wndWidth,
    },
    intro: {
        position: 'absolute',
        bottom: 0,
        left: scaleSize(30),
        height: scaleSize(240),
        backgroundColor: '#ffffff',
        width: wndWidth - scaleSize(60),

    },
    title: {
        height: scaleSize(36),
        marginTop: scaleSize(44),
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: scaleSize(36),
        color: '#000000',
        fontWeight: 'bold',
    },
    dec: {
        height: scaleSize(26),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scaleSize(26)
    },
    dectext: {
        fontSize: scaleSize(26),
        color: '#32b94d'
    },
    time: {
        height: scaleSize(24),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scaleSize(30)
    },
    dectime: {
        fontSize: scaleSize(24),
        color: '#676767',
        fontWeight: 'bold'
    }
})
