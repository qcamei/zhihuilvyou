
import React from 'react';
import
{
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    View,
    Linking
} from 'react-native';
import { toastShort } from '../utils/ToastUtil';
import About from '../pages/About';
import { connect } from 'react-redux';
import * as clientModel from '../Net/clientModel';
import Feedback from '../pages/Feedback';
import PersonalInformation from '../pages/vippages/personalInformation';
import user_login from '../pages/vippages/user_login';
import guide_identtification from '../pages/vippages/guide_identification'
import reaister from '../pages/vippages/register'
import rent_device from '../pages/vippages/rent_device'
import my_order from '../pages/vippages/guide_order'
import TeamList from '../group/TeamList';
import my_deposit from '../pages/vippages/my_deposit'
import myMarginIcon from '../imgs/icons/myMargin@2x.png'
import myOrderIcon from '../imgs/icons/myOrder@2x.png'
import myDeviceIcon from '../imgs/icons/myDevice@2x.png'
import myTeamIcon from '../imgs/icons/myTeam@2x.png'
import defaultUserPhotoIcon from '../imgs/icons/defaultPhoto@2x.png'
import backImgIcon from '../imgs/icons/backLayer@2x.png'
import myServerIcon from '../imgs/icons/myServer@2x.png'
import myAboutIcon from '../imgs/icons/myAbout@2x.png'
import myExitIcon from '../imgs/icons/myExit@2x.png'
import myGuideIcon from '../imgs/icons/myguide@2x.png'
import guideIcon from  '../imgs/icons/guide_icon.png'
import vipIcon from '../imgs/icons/myAttestation@2x.png'

import { httpServerAdd } from '../config';
import { drawerWidth, wndHeight, statusbarHeight,headBarPt } from '../Global';

let menu_0 = [{ img: myServerIcon, lbl: '0592-111111', name: 'server' },
{ img: myAboutIcon, lbl: '关于', name: 'about' },
{ img: myExitIcon, lbl: '注册', name: 'register', isBottom: true }];
let menu_2 = [{ img: myMarginIcon, lbl: '我的保证金', name: 'margin' },
{ img: myOrderIcon, lbl: '我的订单', name: 'order' },
{ img: myDeviceIcon, lbl: '租赁设备', name: 'device' },
{ img: myTeamIcon, lbl: '我的团队', name: 'team' },
{ img: myServerIcon, lbl: '', name: 'server' },
{ img: myAboutIcon, lbl: '关于', name: 'about' },
{ img: myExitIcon, lbl: '退出', name: 'logout', isBottom: true }];
let menu_1 = [
{ img: myServerIcon, lbl: '', name: 'server' },
{ img: myAboutIcon, lbl: '关于', name: 'about' },
{ img: myExitIcon, lbl: '退出', name: 'logout', isBottom: true }];


class DrawerView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {

        };
    }
    render()
    {
        let renderHead = this.renderHead.bind(this);
        let renderMenuItem = this.renderMenuItem.bind(this);
        let pages = [];
        let menu = this.props.isLoggedIn == false ? menu_0 : (this.props.user && this.props.user.istourguide ? menu_2 : menu_1);
        for (let i = 0; i < menu.length; i++)
        {
            if (!menu[i].isBottom)
            {
                pages.push(renderMenuItem(menu[i], i));
            }
        }
        let pages_bottom = [];
        for (let i = 0; i < menu.length; i++)
        {
            if (menu[i].isBottom)
            {
                pages_bottom.push(renderMenuItem(menu[i], i));
            }
        }


        return (
            <Image style={styles.container} source={backImgIcon}>
                {renderHead()}
                {pages}
                <View style={{ position: 'absolute', bottom: 5 }}>
                    {pages_bottom}
                </View>
            </Image>
        );
    }

    /**顶部item */
    renderHead()
    {
        return (
            <View style={styles.drawerTitleContent}>
                <TouchableOpacity onPress={() => this.onPressPersonItem()}>
                    <Image style={styles.personImage} resizeMode={'cover'}
                        source={!this.props.isLoggedIn || !this.props.user.userface || this.props.user.userface == "" ? defaultUserPhotoIcon
                            : { uri: httpServerAdd + this.props.user.userface }} />

                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginTop: 5, width: drawerWidth, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={{ alignItems: 'center', marginLeft: 45 }}
                        onPress={() => this.onPressPersonItem()}
                        >
                        <Text style={{ fontSize: 18, color: '#ffffff' }}>{this.props.isLoggedIn ? this.props.user.nickname : '点击登录'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.onPressGuideItem()}>

                        <Image style={styles.guideImage} source={this.props.user.istourguide === 0 || this.props.user.istourguide == undefined?vipIcon:guideIcon} />
                    </TouchableOpacity>

                </View>
            </View>
        );

    }
    renderMenuItem(data, idx)
    {
        let clickMenuItem = this.clickMenuItem.bind(this);
        return (
            <TouchableOpacity key={idx} style={data.isBottom ? styles.drawerContent_bottom : styles.drawerContent}
                onPress={() => { clickMenuItem(data.name) } }>
                <Image style={styles.drawerIcon} source={data.img} resizeMode="stretch"/>
                <Text style={styles.drawerText}>
                    {data.name=="server"?(this.props.sa_info&&this.props.sa_info.telephone?this.props.sa_info.telephone:""):data.lbl}
                </Text>
            </TouchableOpacity>
        );
    }

    clickMenuItem(name)
    {
        const { navigator } = this.props;
        switch (name)
        {
            case 'margin':
            navigator.push({
                component: my_deposit,
                name: 'my_deposit'
            });
            break;
            case 'about':
                navigator.push({
                    component: About,
                    name: 'About'
                });
                break;
            case 'feedback':
                navigator.push({
                    component: Feedback,
                    name: 'Feedback'
                });
                break;
            case 'register':
                navigator.push({
                    component: reaister,
                    name: 'reaister'
                });
                break;
            case 'device':
                navigator.push(({
                    component: rent_device,
                    name: 'rent_device'
                }));
                break;
            case 'order':
                navigator.push({
                    component: my_order,
                    name: 'my_order'
                });
                break;
            case 'team':
                navigator.push({
                    component: TeamList,
                    name: 'TeamList'
                });
                break;
            case 'logout':
                clientModel.logout();
                break;
            case 'server':
                Linking.openURL('tel:' + (this.props.sa_info&&this.props.sa_info.telephone?this.props.sa_info.telephone:""));
                break;
            default:
                break;

        }

        if (this.props.onPressDrawerItem != null && typeof (this.props.onPressDrawerItem) == "function")
        {
            this.props.onPressDrawerItem(name);
        }
    }

    //个人点击头像
    onPressPersonItem()
    {
        const {navigator} = this.props;
        if (!this.props.isLoggedIn)
        {
            navigator.push({
                component: user_login,
                name: 'user_login'
            });
            if (this.props.onPressDrawerItem != null && typeof (this.props.onPressDrawerItem) == "function")
            {
                this.props.onPressDrawerItem('user_login');
            }
        } else
        {
            navigator.push({
                component: PersonalInformation,
                name: 'PersonalInformation'
            });
            if (this.props.onPressDrawerItem != null && typeof (this.props.onPressDrawerItem) == "function")
            {
                this.props.onPressDrawerItem('PersonalInformation');
            }
        }

    }

    //点击导游认证按钮
    onPressGuideItem()
    {
        const {navigator} = this.props;
        if (!this.props.isLoggedIn)
        {
            toastShort("请先登录！");
        } else if (!this.props.user.istourguide)
        {
            navigator.push({
                component: guide_identtification,
                name: 'guide_identtification'
            })
        } else
        {

        }
    }
    shouldComponentUpdate(nextProps, nextState)
    {
        if (nextProps.isLoggedIn == this.props.isLoggedIn && nextProps.user.istourguide == this.props.user.istourguide
            && nextProps.user.userface == this.props.user.userface && nextProps.user.nickname == this.props.user.nickname
             && nextProps.sa_info.telephone == this.props.sa_info.telephone)
        {
            return false;
        }
        return true;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        height: wndHeight - statusbarHeight,
        width:drawerWidth,
    },
    drawerIcon: {
        width: 20,
        height: 20,
        marginLeft: 10
    },
    drawerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#281c2b',

    },
    drawerContent_bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: drawerWidth,
    },
    drawerTitleContent: {
        width: drawerWidth,
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#281c2b',
    },
    drawerTitle: {
        fontSize: 20,
        textAlign: 'left',
        color: '#fcfcfc'
    },
    drawerText: {
        fontSize: 15,
        marginLeft: 20,
        textAlign: 'left',
        color: '#ffffff',
        fontFamily: 'PingFang-SC-Regular'
    },

    personImage: {
        marginTop: 20 + headBarPt,
        resizeMode: 'stretch',
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: 'center'
    },
    guideImage: {
        width: 40,
        height: 20,
        borderRadius: 5,
        resizeMode: 'stretch',
    },

});

function select(store)
{
    return {
        user: store.userStore.user,
        isLoggedIn: store.userStore.isLoggedIn,
        team_list: store.userStore.team_list,
        sa_info: store.scenicStore.sa_info,
    }
}
export default connect(select)(DrawerView);