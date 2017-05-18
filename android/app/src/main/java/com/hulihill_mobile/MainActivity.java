package com.hulihill_mobile;

import android.os.Bundle;
 
import com.facebook.react.ReactActivity;
import com.keyee.datetime.RCTDateTimePickerPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.facebook.react.shell.MainReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.remobile.toast.RCTToastPackage;
import com.rn_amap.AMapReactPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.yoloci.fileupload.FileUploadPackage;
import com.zyu.ReactNativeWheelPickerPackage;
import com.rnfs.RNFSPackage;
import java.util.Arrays;
import java.util.List;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "hulihill_mobile";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {


        MainApplication application = (MainApplication) this.getApplication();
        application.setReactNativeHost(new ReactNativeHost(application) {
            @Override
            protected boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                return Arrays.<ReactPackage>asList(
                        new MainReactPackage(),
                        new CodePush(getResources().getString(R.string.codepush_key), getApplicationContext(), BuildConfig.DEBUG),
                        new RCTCapturePackage(),
                        new RNDeviceInfo(),
                        new AMapReactPackage(),
                        new ReactNativeAudioPackage(),
                        new ImagePickerPackage(),
                        new ReactNativeWheelPickerPackage(),
                        new FileUploadPackage(),//register Module,
                        new RNFSPackage( ),
                        new RCTToastPackage(),
                        new VectorIconsPackage()

                );
            }

        });

        super.onCreate(savedInstanceState);
    }
}
