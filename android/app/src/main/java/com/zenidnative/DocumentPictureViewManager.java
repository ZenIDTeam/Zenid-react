package com.zenidnative;

import android.widget.Toast;

import androidx.lifecycle.LifecycleOwner;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;
import com.otaliastudios.cameraview.size.SizeSelectors;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;

import cz.trask.zenid.sdk.DocumentPictureResult;
import cz.trask.zenid.sdk.DocumentPictureSettings;
import cz.trask.zenid.sdk.DocumentPictureState;
import cz.trask.zenid.sdk.DocumentPictureView;
import cz.trask.zenid.sdk.Language;
import cz.trask.zenid.sdk.NfcStatus;
import cz.trask.zenid.sdk.VisualizationSettings;
import timber.log.Timber;

public class DocumentPictureViewManager extends SimpleViewManager<DocumentPictureView> {

    public static final String REACT_CLASS = "DocumentPictureView";
    private DocumentPictureView documentPictureView;
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected DocumentPictureView createViewInstance(ThemedReactContext reactContext) {
        documentPictureView = new DocumentPictureView(reactContext);
        documentPictureView.setLifecycleOwner((LifecycleOwner) reactContext.getCurrentActivity());

        VisualizationSettings visualizationSettings = new VisualizationSettings.Builder()
                .showDebugVisualization(false)
                .language(Language.ENGLISH)
                .showTextInformation(true)
                .build();

        DocumentPictureSettings documentPictureSettings = new DocumentPictureSettings.Builder()
                .enableAimingCircle(true)
                .build();

        documentPictureView.setPreviewStreamSize(SizeSelectors.biggest());
        documentPictureView.setDocumentPictureSettings(documentPictureSettings);
        documentPictureView.enableDefaultVisualization(visualizationSettings);

        documentPictureView.setCallback(new DocumentPictureView.Callback() {
            @Override
            public void onStateChanged(DocumentPictureState documentPictureState) {
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onDocumentPictureStateChanged", documentPictureState.ordinal());



            }

            @Override
            public void onPictureTaken(DocumentPictureResult documentPictureResult, NfcStatus nfcStatus) {

                String jsonResult = null;
                try {

                    jsonResult = new JSONObject()
                            .put("stateIndex",documentPictureResult.getStateIndex())
                            .put("filePath",documentPictureResult.getFilePath())
                            .put("signature", documentPictureResult.getSignature())
                            .put( "role", documentPictureResult.getRole())
                            .put("country",documentPictureResult.getCountry().toString())
                            .put("pageCode", documentPictureResult.getPage().getCode())

                            .toString();
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("onPictureTaken", jsonResult);


            }


        });

        return documentPictureView;
    }
}
