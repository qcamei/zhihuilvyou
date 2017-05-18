import React, { Component } from 'react';
import
{
    View,
    StyleSheet,
    Image,
    Text,
    ListView,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { scaleSize } from '../../ScreenUtils'
import HeadPortrait from '../../imgs/new_icons/touxiang.png'
import HeadPortrait2 from '../../imgs/new_icons/touxiang2.png'
import follow from '../../imgs/new_icons/guanzhu.png'
import unfollow from '../../imgs/new_icons/weiguanzhu.png'
import location from '../../imgs/new_icons/location.png'
import female from '../../imgs/new_icons/nvshen.png'
import pic1 from '../../imgs/new_icons/tupian1.png'
import pic2 from '../../imgs/new_icons/tupian2.png'
import Like from '../../imgs/new_icons/zan.png'
import share from '../../imgs/new_icons/share.png'
import comment from '../../imgs/new_icons/comment.png'
import picture from '../../imgs/new_icons/picture.png'
import { wndWidth, drawerWidth, wndHeight } from '../../Global'
let boxW = scaleSize(160)
let wMargin = scaleSize(10)
let hMargin = scaleSize(10)
const cols = 3
let Alldata = ['https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2263582212.jpg',
    'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2265761240.jpg',
    'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2263582212.jpg',
    'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2265761240.jpg',
    'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2263582212.jpg',
    'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2265761240.jpg',
]
export default class Page1 extends Component
{
    // 构造
    constructor(props)
    {
        super(props);

    }


    render()
    {
        // 不同的Page,需要修改下面的这个数组, 通过数组控制导航栏条目显示状态

        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.whatLeft} >
                    <View style={styles.itemContainer}>
                        <View style={styles.itemTop}>
                            <Image style={styles.headpic} source={HeadPortrait} />
                            <View style={styles.headtext}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ fontSize: scaleSize(26) }}>秘密icon</Text>
                                    <Image style={{ marginLeft: scaleSize(8), }} source={female} />
                                </View>
                                <View style={styles.timeLoc}>
                                    <Text style={styles.timeText}>10分钟前</Text>
                                    <View style={styles.seperateView} />
                                    <Image style={{ marginLeft: scaleSize(8) }} source={location} />
                                    <Text style={styles.locationText}>厦大白城</Text>
                                </View>
                            </View>
                            <Image source={unfollow} style={{ height: scaleSize(54), width: scaleSize(80) }} />
                        </View>
                        <Text style={styles.contentText} >对于旅行，从来都记忆模糊。记不得都去了哪些地方看了哪些风景，遇到哪些人而在于当时的那份心情，你说是不是</Text>
                        <View style={styles.listViewStyle}>
                            {this.renderAllImage()}
                        </View>
                        <View style={styles.locDoView}>
                            <Text style={{ fontSize: scaleSize(26), color: '#34b261', }}>#厦门#</Text>
                            <Text style={{ fontSize: scaleSize(26), color: '#34b261', marginLeft: scaleSize(20) }}>#自拍#</Text>
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
                    <View style={styles.itemContainer}>
                        <View style={styles.itemTop}>
                            <Image style={styles.headpic} source={HeadPortrait2} />
                            <View style={styles.headtext}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ fontSize: scaleSize(26) }}>秘密icon</Text>
                                    <Image style={{ marginLeft: scaleSize(8), }} source={female} />
                                </View>
                                <View style={styles.timeLoc}>
                                    <Text style={styles.timeText}>12分钟前</Text>
                                    <View style={styles.seperateView} />
                                    <Image style={{ marginLeft: scaleSize(8) }} source={location} />
                                    <Text style={styles.locationText}>同安●北辰山</Text>
                                </View>
                            </View>
                            <Image source={follow} style={{ height: scaleSize(54), width: scaleSize(80) }} />
                        </View>
                        <Text style={styles.contentText} > 偶尔，抽空出去走走，是蛮不错的。因为，谁也猜不透你到底会在途中遇到什么...</Text>
                        <View style={styles.listViewStyle}>
                            {this.renderAllImage()}
                        </View>
                        <View style={styles.locDoView}>
                            <Text style={{ fontSize: scaleSize(26), color: '#34b261', }}>#厦门#</Text>
                            <Text style={{ fontSize: scaleSize(26), color: '#34b261', marginLeft: scaleSize(20) }}>#自拍#</Text>
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
            </ScrollView>
        );
    }
    renderAllImage()
    {
        let all = [];
        for (let i = 0; i < Alldata.length; i++)
        {
            let bage = Alldata[i];
            all.push(

                <Image source={{ uri: bage }} style={styles.iconStyle} />

            )
        }
        return all; 
    }

}
const styles = StyleSheet.create({
    listViewStyle: {
        // 主轴方向 
        marginTop: scaleSize(30),

        width: scaleSize(634),
        marginLeft: scaleSize(124),
        flexDirection: 'row',
        // 一行显示不下,换一行  
        flexWrap: 'wrap',

        // 侧轴方向  
        alignItems: 'center', // 必须设置,否则换行不起作用  
    },
    container: {
        flex: 1,
        marginBottom: scaleSize(100)

    },
    itemContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: scaleSize(20)
    },
    itemTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scaleSize(20),
        height: scaleSize(80),
        marginLeft: scaleSize(30),
        marginRight: scaleSize(30)
    },
    headpic: {
        height: scaleSize(80),
        width: scaleSize(80)
    },
    headtext: {
        flex: 1,
        marginLeft: scaleSize(20),
        flexDirection: 'column'
    },
    seperateView: {
        height: scaleSize(22),
        width: scaleSize(2),
        backgroundColor: '#abde77',
        marginLeft: scaleSize(8)
    },
    locationText: {
        marginLeft: scaleSize(8),
        fontSize: scaleSize(22),
        color: '#aaaaaa',
        marginLeft: scaleSize(4)
    },
    contentText: {
        marginTop: scaleSize(32),
        marginLeft: scaleSize(134),
        marginRight: scaleSize(40),
        color: '#414141',
        fontSize: scaleSize(26),
        fontWeight: 'bold'
    },
    itemBottom: {
        width: wndWidth - scaleSize(30),
        height: scaleSize(96),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    timeLoc: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scaleSize(14)
    },
    timeText: {
        fontSize: scaleSize(22),
        color: '#aaaaaa',
        marginLeft: scaleSize(4)
    },
    locDoView: {
        marginLeft: scaleSize(134),
        flexDirection: 'row',
        width: wndWidth,
        marginTop: scaleSize(20)
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
    whatLeft: {  // 组件定义了一个上边框
        flex: 1,

        //每个界面背景颜色不一样
    },
    iconStyle: {
        marginLeft: scaleSize(10),
        marginTop: scaleSize(10),
        width: scaleSize(160),
        height: scaleSize(160),
    },
});