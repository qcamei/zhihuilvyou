package com.rn_amap;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.amap.api.location.AMapLocation;
import com.amap.api.maps.AMap;
import com.amap.api.maps.AMapOptions;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.LocationSource;
import com.amap.api.maps.MapView;
import com.amap.api.maps.Projection;
import com.amap.api.maps.model.BitmapDescriptor;
import com.amap.api.maps.model.BitmapDescriptorFactory;
import com.amap.api.maps.model.CameraPosition;
import com.amap.api.maps.model.GroundOverlayOptions;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.LatLngBounds;
import com.amap.api.maps.model.Marker;
import com.amap.api.maps.model.MarkerOptions;
import com.amap.api.maps.model.Polyline;
import com.amap.api.maps.model.PolylineOptions;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.controller.ControllerListener;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.image.CloseableStaticBitmap;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.rn_map.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;


/**
 * Created by admin on 2016/12/13.
 */

public class ReactAMapView extends MapView implements LocationSource/*, AMapLocationListener*/, LifecycleEventListener {
    private Marker locationMarker;
    private Marker locationMarkerEx;
    private final AMapOptions options = new AMapOptions();
    private final ReactContext reactContext;
    private boolean mapLoaded = false;
    private List<Marker> arrSpMarker = new ArrayList<>();
    private List<Marker> arrExMarker = new ArrayList<>();
    private List<Marker> arrRoMarker = new ArrayList<>();
    private List<Polyline> listPl = new ArrayList<>();
    private LatLng latLng;
    private double zoomLevel;

    //    private AMapLocationClient locationClient;
    private SensorEventHelper mSensorHelper;

//    private OnLocationChangedListener locationChangedListener;

    private BitmapDescriptor iconBitmapDescriptor;
    LatLngBounds bounds;
    private final DraweeHolder<?> logoHolder;
    private DataSource<CloseableReference<CloseableImage>> dataSource;
    private final ControllerListener<ImageInfo> mLogoControllerListener =
            new BaseControllerListener<ImageInfo>() {
                @Override
                public void onFinalImageSet(
                        String id,
                        @Nullable final ImageInfo imageInfo,
                        @Nullable Animatable animatable) {
                    CloseableReference<CloseableImage> imageReference = null;
                    try {
                        imageReference = dataSource.getResult();
                        if (imageReference != null) {
                            CloseableImage image = imageReference.get();
                            if (image != null && image instanceof CloseableStaticBitmap) {
                                CloseableStaticBitmap closeableStaticBitmap = (CloseableStaticBitmap) image;
                                Bitmap bitmap = closeableStaticBitmap.getUnderlyingBitmap();
                                if (bitmap != null) {
                                    bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                                    iconBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);

                                    getMap().addGroundOverlay(new GroundOverlayOptions()
                                            .image(iconBitmapDescriptor)
                                            .positionFromBounds(bounds).zIndex(1.0f));
                                }
                            }
                        }
                    } finally {
                        dataSource.close();
                        if (imageReference != null) {
                            CloseableReference.closeSafely(imageReference);
                        }
                    }

                }
            };
    /***/
    private AMap.CancelableCallback animateCancelCb = new AMap.CancelableCallback() {
        @Override
        public void onCancel() {
        }

        @Override
        public void onFinish() {
            WritableMap event = Arguments.createMap();
            event.putBoolean("onAnimationOver", true);
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    "onAnimationOver",
                    event
            );
        }
    };

    public ReactAMapView(Context context) {
        super(context);
        this.reactContext = (ReactContext) getContext();
        ReactAMapLocationModule locationModule = ReactAMapLocationModule.getInstance(null, false);
        if (locationModule != null) {
            locationModule.setMap(this);
        }
        logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
        logoHolder.onAttach();

        this.getMapFragmentDelegate().setOptions(this.options);
//        this.getMap().setLocationSource(this);
//        MyLocationStyle myLocationStyle = new MyLocationStyle();
//        myLocationStyle.strokeColor(Color.argb(0, 0, 0, 0));//
//        myLocationStyle.radiusFillColor(Color.argb(0, 0, 0, 0));//
//        Bitmap bMap = BitmapFactory.decodeResource(this.getResources(),
//                R.drawable.loc);
//        BitmapDescriptor des = BitmapDescriptorFactory.fromBitmap(bMap);
//        myLocationStyle.myLocationIcon(des);
//        this.getMap().setMyLocationStyle(myLocationStyle);

        this.setListeners();

    }

    private GenericDraweeHierarchy createDraweeHierarchy() {
        return new GenericDraweeHierarchyBuilder(getResources())
                .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
                .setFadeDuration(0)
                .build();
    }


    @Override
    public void onHostResume() {
        this.onResume();
        if (mSensorHelper != null) {
            mSensorHelper.registerSensorListener();
        }
    }

    @Override
    public void onHostPause() {
        this.onPause();
        if (mSensorHelper != null) {
            mSensorHelper.unRegisterSensorListener();
        }
        deactivate();
    }

    @Override
    public void onHostDestroy() {
        this.onDestroy();
//        if(null!=locationClient){
//            locationClient.onDestroy();
//        }
        this.getMap().clear();
    }

    public void addOverlay(ReadableMap value) {
        String uri = value.getString("uri");
        if (uri.startsWith("http://") || uri.startsWith("https://") ||
                uri.startsWith("file://")) {
            ImageRequest imageRequest = ImageRequestBuilder
                    .newBuilderWithSource(Uri.parse(uri))
                    .build();

            ImagePipeline imagePipeline = Fresco.getImagePipeline();
            dataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
            bounds = new LatLngBounds.Builder()
                    .include(new LatLng(value.getDouble("lat"), value.getDouble("lng")))
                    .include(new LatLng(value.getDouble("lat1"), value.getDouble("lng1"))).build();

            DraweeController controller = Fresco.newDraweeControllerBuilder()
                    .setImageRequest(imageRequest)
                    .setControllerListener(mLogoControllerListener)
                    .setOldController(logoHolder.getController())
                    .build();
            logoHolder.setController(controller);
        }
    }

    public void setDefaultRegion(double latitude, double longitude, double latitudeDelta, double longitudeDelta, double zoomLevel) {
        this.latLng = new LatLng(latitude, longitude);
        this.zoomLevel = zoomLevel;

    }

    public void animateTo(double latitude, double longitude, double zoomLevel, int ntime) {
        if (!mapLoaded) return;
        zoomLevel = zoomLevel <= 0 ? this.getMap().getCameraPosition().zoom : zoomLevel;
        this.getMap().animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(latitude, longitude), (float) zoomLevel), ntime, animateCancelCb);
    }

    //添加地图marker
    public void addMarkers(ReadableArray coordinatesArray, String type) {
        if (!mapLoaded) return;
        int m = coordinatesArray.size();
        for (int i = 0; i < m; i++) {
            ReadableMap map = coordinatesArray.getMap(i);
            double latitude = map.getDouble("latitude");
            double longitude = map.getDouble("longitude");
            String iconUri = map.getString("iconUri");
            String id = map.getString("id");
            String title = map.getString("title");
            Marker marker = this.getMap().addMarker(new MarkerOptions().position(new LatLng(latitude, longitude))
                    .icon(getIcon(iconUri,title)).zIndex(2.0f));
            HashMap hashMap = new HashMap();
            hashMap.put("id", id);
            hashMap.put("type", type);
            marker.setObject(hashMap);
            if (type.equals("sp")) {
                arrSpMarker.add(marker);
            } else if (type.equals("route")) {
                marker.setAnchor( 0.5f,0.77f );
                arrRoMarker.add(marker);
            } else {
                arrExMarker.add(marker);
            }
        }
    }

    public void clearMarker(String type) {
        for (int m = 0; m < arrExMarker.size(); m++) {
            arrExMarker.get(m).destroy();
        }
        arrExMarker.clear();
        if (type.equals("route") || type.equals("all")) {
            for (int m = 0; m < arrRoMarker.size(); m++) {
                arrRoMarker.get(m).destroy();
            }
            arrRoMarker.clear();
        }


        if (type.equals("all")) {
            for (int m = 0; m < arrSpMarker.size(); m++) {
                arrSpMarker.get(m).destroy();
            }
            arrSpMarker.clear();
        }
    }

    public void updateMarkerPos(ReadableArray coordinatesArray) {
        if (!mapLoaded) return;
        ReadableMap map;
        String id;
        boolean bFound;
        for (int i = 0; i < coordinatesArray.size(); i++) {
            map = coordinatesArray.getMap(i);
            id = map.getString("id");
            bFound = false;
            LatLng l;
            try {
                l = new LatLng(map.getDouble("lat"), map.getDouble("lng"));
            }
            catch (Exception e){
                continue;
            }
            for (int m = 0; m < arrExMarker.size(); m++) {
                if (id.equals( ((HashMap) arrExMarker.get( m ).getObject()).get( "id" ) )) {
                    arrExMarker.get( m ).setPosition(l);
                    bFound = true;
                    break;
                }
            }
            if (!bFound) {
                Marker marker = this.getMap().addMarker(new MarkerOptions().position(l)
                        .icon(getIcon(map.getString("icon"),"")).zIndex(2.0f));
                HashMap hashMap = new HashMap();
                hashMap.put("id", id);
                hashMap.put("type", "grp");
                marker.setObject(hashMap);
                arrExMarker.add(marker);
            }
        }

    }
//    //添加贴图
//    public void addOverlay(ReadableMap value){
//        if(!mapLoaded) return;
//        bounds = new LatLngBounds.Builder()
//                .include(new LatLng(value.getDouble("lat"), value.getDouble("lng")))
//                .include(new LatLng(value.getDouble("lat1"), value.getDouble("lng1"))).build();
//
//    }

    //添加线
    public void clearLine() {
        synchronized (listPl) {
            if (listPl.size() > 0) {
                for (int i = 0; i < listPl.size(); i++) {
                    listPl.get(i).remove();
                }
            }
        }
        listPl.clear();
    }

    public void addLine(ReadableArray value, String color) {

        if (!mapLoaded) return;
        clearLine();
        if (value.size() > 0) {
            List<LatLng> coordinates = new ArrayList<>(value.size());

            for (int i = 0; i < value.size(); i++) {
                ReadableMap map = value.getMap(i);
                double latitude = map.getDouble("latitude");
                double longitude = map.getDouble("longitude");
                coordinates.add(i, new LatLng(latitude, longitude));
            }
            Polyline pl = this.getMap().addPolyline(new PolylineOptions().setCustomTexture(BitmapDescriptorFactory.fromResource(R.drawable.cus)).addAll(coordinates).color(Color.parseColor(color)).useGradient(false).width(28).zIndex(3.0f));
            coordinates.clear();
            listPl.add(pl);
        }

    }

    private int getImageId(String fileName) {
        int drawableId = reactContext.getCurrentActivity().getResources().getIdentifier(fileName, "drawable", reactContext.getCurrentActivity().getClass().getPackage().getName());
        if (drawableId == 0) {
            drawableId = reactContext.getCurrentActivity().getResources().getIdentifier("huli", "drawable", reactContext.getCurrentActivity().getPackageName());
        }
        return drawableId;
    }

    public BitmapDescriptor getIcon(String iconUri,String title) {
        View marker = LayoutInflater.from(getContext()).inflate(R.layout.marker, null);
        ImageView icon = (ImageView) marker.findViewById(R.id.icon);

//        LinearLayout info_window = (LinearLayout) marker.findViewById(R.id.info_window);
//        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(180, 60);
//        info_window.setLayoutParams(lp);
//        TextView info_window_title = (TextView) marker.findViewById(R.id.info_window_title);
//        info_window_title.setText(title);
//        info_window_title.setTextColor(Color.RED);
        try {
//            Drawable drawable = NinePatchUtils.decodeDrawableFromAsset(getContext(), "infowindow_bg.9.png");
//            info_window.setBackground(drawable);
            icon.setImageResource(getImageId(iconUri));
        } catch (Exception e) {
        }
        Log.e(iconUri+marker.getWidth()," " + marker.getHeight());
        return BitmapDescriptorFactory.fromView(marker);

    }

    public void onLocationChange(AMapLocation aMapLocation) {
        if (locationMarker == null) {
            locationMarker = this.getMap().addMarker(new MarkerOptions().position(new LatLng(aMapLocation.getLatitude(), aMapLocation.getLongitude())).anchor(0.5f,0.7f)
                    .icon(getIcon("loc","")).zIndex(2.0f));

            HashMap hashMap = new HashMap();
            hashMap.put("id", 0);
            hashMap.put("type", "location");
            locationMarker.setObject(hashMap);

            locationMarkerEx = this.getMap().addMarker(new MarkerOptions().position(new LatLng(aMapLocation.getLatitude(), aMapLocation.getLongitude())).anchor( 0.5f,0.833f )
                    .icon(getIcon("locex","")).zIndex(3.0f));
            locationMarker.setObject(hashMap);
            //
            this.mSensorHelper = new SensorEventHelper(reactContext);
            if (mSensorHelper != null) {
                mSensorHelper.registerSensorListener();
                mSensorHelper.setCurrentMarker(locationMarker);
            }
        } else {
            double lat = aMapLocation.getLatitude();
            double log = aMapLocation.getLongitude();
            locationMarker.setPosition(new LatLng(lat,log));
            locationMarker.setRotateAngle(180 - mSensorHelper.mAngle);

            locationMarkerEx.setPosition(new LatLng(lat,log));
            locationMarkerEx.setZIndex( 3.0f );
        }
    }


//    @Override
//    public void onLocationChanged(AMapLocation aMapLocation) {
//        if(locationChangedListener!=null){
//            locationChangedListener.onLocationChanged(aMapLocation);
//            this.getMap().setMyLocationRotateAngle(360-mSensorHelper.mAngle);
//        }
//    }

    @Override
    public void activate(final OnLocationChangedListener onLocationChangedListener) {
//        this.locationChangedListener = onLocationChangedListener;
//        locationClient.startLocation();
    }

    @Override
    public void deactivate() {
//        locationClient.stopLocation();
//        this.locationChangedListener = null;
//        locationClient.setLocationListener(null);
//        locationClient.onDestroy();
    }


    private void setListeners() {
        // 地图加载完成监听器
        final ReactAMapView mapView = this;
        this.getMap().setOnMapLoadedListener(new AMap.OnMapLoadedListener() {
            @Override
            public void onMapLoaded() {
                if (!mapLoaded) {
                    mapLoaded = true;
                    getMap().moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, (float) zoomLevel));
                }

                WritableMap event = Arguments.createMap();
                event.putBoolean("onMapReady", true);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        "onMapReady",
                        event
                );
            }
        });

        // 可视区域改变的监听器
        this.getMap().setOnCameraChangeListener(new AMap.OnCameraChangeListener() {
            @Override
            public void onCameraChange(CameraPosition cameraPosition) {
                WritableMap event = Arguments.createMap();
                event.putBoolean("onMove", true);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        "onMove",
                        event
                );
            }

            @Override
            public void onCameraChangeFinish(CameraPosition cameraPosition) {
                LatLng center = cameraPosition.target;
                LatLngBounds bounds = getMap().getProjection().getVisibleRegion().latLngBounds;
                WritableMap event = Arguments.createMap();
                WritableMap region = Arguments.createMap();
                region.putDouble("latitude", center.latitude);
                region.putDouble("longitude", center.longitude);
                region.putDouble("latitudeDelta", Math.abs((bounds.northeast.latitude - bounds.southwest.latitude) / 2));
                region.putDouble("longitudeDelta", Math.abs((bounds.northeast.longitude - bounds.southwest.longitude) / 2));
                event.putMap("region", region);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        "onRegionChange",
                        event
                );
            }
        });

        // 标记选中监听器
        this.getMap().setOnMarkerClickListener(new AMap.OnMarkerClickListener() {

            @Override
            public boolean onMarkerClick(Marker marker) {
                WritableMap event = Arguments.createMap();
                WritableMap coordinate = Arguments.createMap();
                coordinate.putDouble("latitude", marker.getPosition().latitude);
                coordinate.putDouble("longitude", marker.getPosition().longitude);
                event.putMap("coordinate", coordinate);

                Projection projection = getMap().getProjection();
                Point screenPoint = projection.toScreenLocation(marker.getPosition());
                WritableMap position = Arguments.createMap();
                position.putDouble("x", screenPoint.x);
                position.putDouble("y", screenPoint.y);
                event.putMap("position", position);
                event.putString("id", ((HashMap) marker.getObject()).get("id").toString());
                event.putString("type", ((HashMap) marker.getObject()).get("type").toString());
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        "onMarkerPress",
                        event
                );
                return true;
            }
        });
//        // 当前位置改变监听器
//        this.getMap().setOnMyLocationChangeListener(new AMap.OnMyLocationChangeListener() {
//            @Override
//            public void onMyLocationChange(Location location) {
//                WritableMap event = Arguments.createMap();
//                WritableMap userLocation = Arguments.createMap();
//                WritableMap coordinate = Arguments.createMap();
//                coordinate.putDouble("latitude", location.getLatitude());
//                coordinate.putDouble("longitude", location.getLongitude());
//                userLocation.putMap("coordinate", coordinate);
//                event.putMap("userLocation", userLocation);
//                event.putBoolean("updatingLocation", true);
//                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
//                        getId(),
//                        "onUpdateLocation",
//                        event
//                );
//            }
//        });
    }

}
