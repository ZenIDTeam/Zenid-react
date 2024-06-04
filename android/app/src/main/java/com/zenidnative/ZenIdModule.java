package com.zenidnative;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.views.view.ReactViewGroup;

import com.otaliastudios.cameraview.size.SizeSelectors;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.annotation.Nullable;

import cz.trask.zenid.sdk.DocumentModule;
import cz.trask.zenid.sdk.ZenId;
import cz.trask.zenid.sdk.DocumentPictureResult;
import cz.trask.zenid.sdk.DocumentPictureSettings;
import cz.trask.zenid.sdk.DocumentPictureState;
import cz.trask.zenid.sdk.DocumentPictureView;
import cz.trask.zenid.sdk.Language;
import cz.trask.zenid.sdk.NfcStatus;
import cz.trask.zenid.sdk.NfcValidatorException;
import cz.trask.zenid.sdk.VisualizationSettings;
import cz.trask.zenid.sdk.api.ApiConfig;
import cz.trask.zenid.sdk.api.ApiService;
import cz.trask.zenid.sdk.api.model.InitResponseJson;
import cz.trask.zenid.sdk.api.model.SampleJson;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import timber.log.Timber;

public class ZenIdModule extends ReactContextBaseJavaModule {

    private ZenId zenId;
    private ApiService apiService;

    public ZenIdModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ZenIdModule";
    }

    @ReactMethod
    public void initializeSdk(Promise promise) {
        if (ZenId.isSingletonInstanceExists()) {
            promise.resolve("SDK already initialized");
        } else {
            zenId = new ZenId.Builder()
                    .applicationContext(getReactApplicationContext())
                    .modules(new DocumentModule())
                    .build();

            ZenId.setSingletonInstance(zenId);

            zenId.initialize(new ZenId.InitCallback() {
                @Override
                public void onInitialized() {
                    promise.resolve("SDK initialized successfully");
                }


            });
        }
    }

    @ReactMethod
    public void initializeApiService(String baseUrl, String apiKey, Promise promise) {
        try {
            HttpLoggingInterceptor httpLoggingInterceptor = new HttpLoggingInterceptor(message -> {
                Timber.tag("OkHttp").d(message);
            });
            httpLoggingInterceptor.setLevel(HttpLoggingInterceptor.Level.HEADERS);

            OkHttpClient okHttpClient = new OkHttpClient().newBuilder()
                    .addInterceptor(httpLoggingInterceptor)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .build();

            ApiConfig apiConfig = new ApiConfig.Builder()
                    .baseUrl(baseUrl)
                    .apiKey(apiKey)
                    .build();

            apiService = new ApiService.Builder()
                    .apiConfig(apiConfig)
                    .okHttpClient(okHttpClient)
                    .build();

            promise.resolve("ApiService initialized successfully");
        } catch (Exception e) {
            promise.reject("ApiService Initialization Error", e);
        }
    }

    @ReactMethod
    public void initAuthorizeButton(String profile ,Promise promise) {
        try {
            String challengeToken = ZenId.get().getSecurity().getChallengeToken();
            Timber.i("challengeToken: %s", challengeToken);
            apiService.getInitSdk(challengeToken).enqueue(new Callback<InitResponseJson>() {
                @Override
                public void onResponse(Call<InitResponseJson> call, Response<InitResponseJson> response) {
                    String responseToken = response.body().getResponse();
                    Timber.i("responseToken: %s", responseToken);
                    boolean authorized = ZenId.get().getSecurity().authorize(getReactApplicationContext(), responseToken);
                    
                    ZenId.get().getSecurity().selectProfile(profile);
                    promise.resolve("Authorization: " +authorized);
                }

                @Override
                public void onFailure(Call<InitResponseJson> call, Throwable t) {
                    Timber.e(t);
                    promise.reject("Authorization Error", t);
                }
            });
        } catch (Exception e) {
            promise.reject("Authorization Error", e);
        }
    }

    @ReactMethod
    public void authorize(String responseToken, Promise promise) {
        try {
            boolean authorized = ZenId.get().getSecurity().authorize(getReactApplicationContext(), responseToken);
            promise.resolve(String.valueOf(authorized));
        } catch (Exception e) {
            promise.reject("Authorization Error", e);
        }
    }

    @ReactMethod
    public void selectProfile(String profile, Promise promise) {
        try {
            ZenId.get().getSecurity().selectProfile(profile);
            promise.resolve("Profile selected");
        } catch (Exception e) {
            promise.reject("Profile Selection Error", e);
        }
    }
    @ReactMethod
    public void getChallengeToken(Promise promise) {
        try {
            String challengeToken = ZenId.get().getSecurity().getChallengeToken();
            promise.resolve(challengeToken);
        } catch (Exception e) {
            promise.reject("Challenge Token Error", e);
        }
    }

    @ReactMethod
    public void activateTakeNextDocumentPicture(int viewId, Promise promise) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(nativeViewHierarchyManager -> {
            DocumentPictureView documentPictureView = (DocumentPictureView) nativeViewHierarchyManager.resolveView(viewId);
            try {
                documentPictureView.activateTakeNextDocumentPicture();
                promise.resolve("Next document picture activated");
            } catch (NfcValidatorException e) {
                promise.reject("NFC Validator Exception", e);
            }
        });
    }


}
