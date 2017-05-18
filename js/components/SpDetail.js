import React, { Component, PropTypes } from 'react';
import
{
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import {wndWidth,wndHeight,statusbarHeight} from '../Global'

export default class SpDetail extends Component
{
    static propTypes = {
        title: PropTypes.string,
        content: PropTypes.string,
        id: PropTypes.any,
        leftClick: PropTypes.func,
        centerClick: PropTypes.func,
        rightClick: PropTypes.func,
        ...View.propTypes,
    };
    constructor(props)
    {
        super(props);
        this.state = {
            bShow: false,
            title: "",
            content: ""
        }

    }
    render()
    {
        let iconClick = this.onIconClicked.bind(this);
        if (!this.state.bShow)
        {
            return null;
        }
        else return (
            <View style={{position: 'absolute',left: wndWidth / 10, top: (wndHeight-statusbarHeight)/2- 180,width: wndWidth * 0.8,height: 165,alignItems:'center'}}>
                <View style={styles.dialogStyle}>
                    <View style={styles.top}>
                        <Text style={styles.textPrompt}>
                            {this.state.title}
                        </Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, }} onPress={() => { this.setState({ "bShow": false }) } }>
                            <Image source={require('../imgs/icons/exit.png')} style={styles.image} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.content} numberOfLines={2}>{this.state.content}</Text>
                    </View>
                    <View style={styles.bottom}>
                        <TouchableOpacity onPress={() => iconClick('left')}>
                            <Image source={require('../imgs/icons/jjbtn.png')} style={styles.button} resizeMode={'stretch'} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => iconClick('center')}>
                            <Image source={require('../imgs/icons/dhbtn.png')} style={styles.button} resizeMode={'stretch'} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => iconClick('right')}>
                            <Image source={require('../imgs/icons/xxbtn.png')} style={styles.button} resizeMode={'stretch'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Image source={require('../imgs/icons/angleDown@2x.png')} style={{width:18,height:18}} resizeMode={'stretch'} />
            </View>
        );
    }
    toggleDlg(bShow, id, title, content)
    {
        if (bShow == false && this.state.bShow == bShow)
        {
            return;
        }
        this.setState({ bShow, title, content });

        this.id = id;
    }

    onIconClicked(type)
    {
        if (type == "left" && this.props.leftClick)
        {
            this.props.leftClick(this.id);
        }
        else if (type == "right" && this.props.rightClick)
        {
            this.props.rightClick(this.id, this.state.title);
        }
        else if (type == 'center' && this.props.centerClick)
        {
            this.props.centerClick(this.id);
        }
    }
}

const styles = StyleSheet.create({
    dialogStyle: {
        flex:1,
        width: wndWidth * 0.8,
        paddingBottom: 15,
        backgroundColor: `rgba(255,255,255,0.8)`,
        borderRadius: 8
    },
    top: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    image: {
        width: 20,
        height: 20
    },
    content: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
        color: '#6b6b6b',
    },
    bottom: {
        marginRight: 10,
        marginLeft: 10,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: 73,
        height: 32,

    },
    textPrompt: {
        position: 'absolute',
        top: 10,
        left: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3d3d3d'
    },
});