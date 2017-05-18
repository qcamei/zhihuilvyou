import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import
{
    Text,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    Image,
    TouchableOpacity,
    
} from 'react-native';
const { width, height } = Dimensions.get('window');
import * as Progress from 'react-native-progress';
export default class ProgressView extends Component
{

    constructor(props)
    {

        super(props);
        this.state = {
            bShow: false,
            download: false,
            need: false
        }
    }
    _close()
    {
    }

    render()
    {
        let progressView;
        let text;
        let downview;
        let bar;
        if (this.state.progress)
        {
            let rece = this.state.progress.receivedBytes;
            let all = this.state.progress.totalBytes;
            console.warn("all", this.state.progress.totalBytes);

            progressView = (
                <View style={styles.loadingImageView}>
                    <View style={styles.loadingImage}>
                        <Text style={{ position: 'absolute', left: 0.37 * width, bottom: 0.10 * height, fontSize: 20, color: 'black' }}>{parseInt(rece / all * 100) + '%'}</Text>
                    </View>
                </View>


            );
            bar = (
                <Progress.Bar
                    style={{ position: 'absolute', left: 0.11 * width, bottom: 0.10 * height }}
                    progress={rece / all}
                    color={'#62dafa'}
                    borderColor={'#e9e9e9'}
                    width={0.6 * width}
                    borderRadius={10}
                    animated={false}

                    />
            )
        } else
        {
            let color;
            if (this.state.download)
            {

                progressView = (
                    <View style={styles.loadingImageView}>
                        <View style={styles.loadingImage}>
                            <Text style={{ position: 'absolute', left: 0.37 * width, bottom: 0.10 * height, fontSize: 20, color: 'black' }}>{0 + '%'}</Text>
                        </View>
                    </View>
                )
            } else
            {
                progressView = (null)
            }
            if (this.state.download) { color = '#ffffff' } else { '#62dafa' }
            bar = (
                <Progress.Bar
                    style={{ position: 'absolute', left: 0.11 * width, bottom: 0.10 * height }}
                    progress={0.0}
                    color={color}
                    borderColor={'#e9e9e9'}
                    width={0.6 * width}
                    borderRadius={10}
                    animated={false}

                    />
            )
        }
        if (this.state.download)
        {
            text = '新版下载中'
        } else
        {
            text = '发现新版本'
        }
        if (this.state.download)
        {
            downview = (<View style={styles.loadingImage}>

                <Image style={styles.loadingImage} source={require('../imgs/loadimage.png')} resizeMode={'stretch'} />

                {bar}
                <View style={{ position: 'absolute', left: 0.25 * width, bottom: 0.28 * height, borderRadius: 8, backgroundColor: '#69c8d1', height: 40, width: 0.3 * width, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 14, color: 'white' }}>{text}</Text>
                </View>
                <View style={{position: 'absolute', left: 0.1 * width, bottom: 0.03 * height}}>
                <Text style={{  textAlign:'center', fontSize: 14, color: '#828282' }}>新版本正在努力的更新中，请稍等</Text>
                </View>
            </View>)
        } else
        {
            downview = (<View style={styles.loadingImage}>

                <Image style={styles.loadingImage} source={require('../imgs/loadimage.png')} resizeMode={'stretch'} />
                <View style={{ position: 'absolute', left: 0.25 * width, bottom: 0.28 * height, borderRadius: 8, backgroundColor: '#69c8d1', height: 40, width: 0.3 * width, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 14, color: 'white' }}>{text}</Text>
                </View>

                <View style={{ position: 'absolute', left: 0.08 * width, bottom: 0.05 * height, borderRadius: 8, backgroundColor: '#3c93f5', height: 30, width: 0.25 * width, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.click1()}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white' }}>立即更新</Text>
                    </TouchableOpacity>
                </View>


                <View style={{ position: 'absolute', left: 0.48 * width, bottom: 0.05 * height, borderRadius: 8, backgroundColor: '#878787', height: 30, width: 0.25 * width, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.click2()}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white' }}>稍后更新</Text>
                    </TouchableOpacity>
    </View>   

            </View>)
        }

        return (
            <Modal onRequestClose={() => this._close()} visible={this.state.bShow} transparent>
                <View style={styles.loadingView}></View>
                <View style={styles.loadingImageView}>
                    {downview}
                </View>
                {progressView}
            </Modal>
        )
    }
    togglePr(bShow, progress)
    {
        this.setState({ bShow, progress })
    }
    click1()
    {
        let a = [];
        if (this.props.onPressItem1 != null && typeof (this.props.onPressItem1) == "function")
        {

            this.props.onPressItem1(a);
        }
    }
    click2()
    {

        this.setState({ bShow: false });
        this.setState({ need: false })
    }
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        height,
        width,
        position: 'absolute',

        backgroundColor: 'transparent'
    },
    loadingImage: {
        width: 0.8 * width,
        height: 0.4 * height,
         
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    loadingImageView: {
        position: 'absolute',
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
