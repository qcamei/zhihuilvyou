/**
* Created by os on 16/12/19.
*/
import React, { Component } from 'react';
import
{
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    ListView,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import HeadBar from '../components/HeadBar';
import webviewPage from './WebViewPage';
import { wndWidth } from '../Global';
import Scenic from './Scenic'
class ScenicInfo extends React.Component
{
    // 构造
    constructor(props)
    {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        
        this.state = {
            ds: ds,
        };
    }
    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() =>
        {
            let will_play = [];
            for (let i = 0; i < this.props.sp_article_list.length; i++)
            {
                if (this.props.sp_article_list[i].ishot == 1)
                {
                    will_play.push(this.props.sp_article_list[i]);
                }
            }
            this.setState({ds:this.state.ds.cloneWithRows(will_play)})
        })
    }
    render()
    {
        let renderSpList = this.renderSpList.bind(this);
        return (
            <View style={styles.container}>
                <HeadBar
                    title='景区介绍'
                    leftIcon={require('../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator={this.props.navigator}
                    />
                <ScrollView scrollEventThrottle={5} bounces={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false}>
                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, paddingBottom: 10 }}
                        onPress={() => { } }>
                        <Image source={{ uri: this.props.sa_info.image }} style={{ height: wndWidth * 9 / 16, width: wndWidth }} resizeMode={'stretch'} />
                    </TouchableOpacity>
                    <View style={styles.title}>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: "#1d1d1d", fontSize: 18 }}>{this.props.sa_info.name + "全景"}</Text>
                            <Text style={{ fontSize: 18, color: "#f12d23" }}>{"￥" + this.props.sa_info.ticket_price}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", marginTop: 8, justifyContent: "space-between" }}>
                            <Text style={{ fontSize: 14, color: "#6b6b6b" }}>{this.props.sa_info.label}</Text>
                             
                        </View>
                    </View>
                    <Text style={{ color: "#3d3c3c", fontSize: 16, marginTop: 10, marginLeft: 10, marginRight: 10, flex: 1 }}>{this.props.sa_info.shortcontent}</Text>
                    <View style={{ flex: 1, flexDirection: "row", marginTop: 18, marginLeft: 20, marginRight: 20, marginBottom: 8, justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => this.openWebviewPage(this.props.sa_info.zoneid, this.props.sa_info.name, 0)}>
                            <Text style={styles.button}>阅读更多</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.openScenic()}>
                            <Text style={styles.button}>景区景点</Text>
                        </TouchableOpacity>
                    </View>
                    {renderSpList()}
                </ScrollView>

            </View>
        )
    }
    openScenic()
    {
        this.props.navigator.push({ component: Scenic, name: "Scenic" })
    }
    renderSpList()
    {
        return (
            <View style={{ marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Image source={require('../imgs/icons/biwan1.png')} style={{ height: 19, width: 3 }} resizeMode={'stretch'} />
                    <Text style={{ fontSize: 18, color: '#000000', marginLeft: 10 }}>热门景点</Text>
                </View>
                <View style={{ flex: 1, height: 240 }}>
                    {
                        this.props.sp_article_list == null || this.props.sp_article_list.length <= 0 ? null :
                            <ListView
                                initialListSize={1}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                enableEmptySections={false}
                                dataSource={this.state.ds}
                                renderRow={this.renderItem.bind(this)}
                                style={{ marginLeft: 10, backgroundColor: "#ffffff" }}>
                            </ListView>
                    }
                </View>
            </View>
        )
    }
    renderItem(rawData)
    {
        Image.prefetch(rawData.image);
        return (
            <TouchableOpacity onPress={() => this.openWebviewPage(rawData.pointid, rawData.name, 1)}>
                <View style={styles.containerItem}>
                    <Image
                        style={styles.itemImg}
                        source={{ uri: rawData.image }}
                        resizeMode={'stretch'} />
                    <Text style={styles.itemTitle}>
                        {rawData.name}
                    </Text>
                    <Text style={styles.itemContent}>
                        {rawData.shortcontent}
                    </Text>
                </View >
            </TouchableOpacity>
        )
    }
    //cate_id：0-景区 1-景点 2-活动
    openWebviewPage(spid, title, cate_id)
    {
        this.props.navigator.push({ component: webviewPage, name: "WebViewPage", params: { spid, title, cate_id } })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    containerItem: {
        height: 220,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        margin: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    itemImg: {
        width: wndWidth - 50,
        height: 150,
        marginBottom: 10,
        overflow: "hidden"
    },
    itemTitle: {
        flex: 1,
        marginLeft: 5,
        fontSize: 16
    },
    itemContent: {
        flex: 1,
        marginLeft: 10,
        width: wndWidth - 70,
        fontSize: 15
    },
    title: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        borderColor: '#d5d5d5',
        paddingBottom: 15,
    },
    button: { textAlign: 'center', color: "#ff5614", paddingLeft: 30, paddingRight: 30, paddingBottom: 10, paddingTop: 10, borderColor: '#ff5614', borderRadius: 10, borderWidth: 1 }

});

function select(store)
{
    return {
        sa_info: store.scenicStore.sa_info,
        sp_article_list: store.scenicStore.sp_article_list,
    }
}
export default connect(select)(ScenicInfo);
