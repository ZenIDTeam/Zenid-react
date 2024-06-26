package com.zenidnative;

import android.widget.Toast;

import androidx.lifecycle.LifecycleOwner;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;
import com.otaliastudios.cameraview.size.SizeSelectors;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import android.util.Base64;

import cz.trask.zenid.sdk.DocumentAcceptableInput;
import cz.trask.zenid.sdk.DocumentCountry;
import cz.trask.zenid.sdk.DocumentPage;
import cz.trask.zenid.sdk.DocumentPictureResult;
import cz.trask.zenid.sdk.DocumentPictureSettings;
import cz.trask.zenid.sdk.DocumentPictureState;
import cz.trask.zenid.sdk.DocumentPictureView;
import cz.trask.zenid.sdk.DocumentRole;
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
                    File file = new File(documentPictureResult.getFilePath());
                    byte[] bytes = new byte[(int) file.length()];

                    try(FileInputStream fis = new FileInputStream(file)) {
                        fis.read(bytes);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    String encodedString = Base64.encodeToString(bytes, Base64.DEFAULT);
                    jsonResult = new JSONObject()
                            .put("stateIndex",documentPictureResult.getStateIndex())
                            .put("filePath",documentPictureResult.getFilePath())
                            .put("signature", documentPictureResult.getSignature())
                            .put( "role", documentPictureResult.getRole())
                            .put("country",documentPictureResult.getCountry().toString())
                            .put("pageCode", documentPictureResult.getPage().getCode())
                            .put("file", encodedString)

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

    @ReactProp(name = "acceptableInput")
    public void setAcceptableInput(DocumentPictureView view, ReadableArray acceptableInputArray) {
        List<DocumentAcceptableInput.Filter> filters = new ArrayList<>();
        for (int i = 0; i < acceptableInputArray.size(); i++) {
            ReadableMap filterMap = acceptableInputArray.getMap(i);
            DocumentRole role = DocumentRole.valueOf(filterMap.getString("documentRole"));
            DocumentPage page = DocumentPage.valueOf(filterMap.getString("documentPage"));
            DocumentCountry country = DocumentCountry.valueOf(filterMap.getString("documentCountry"));
            Integer code = filterMap.hasKey("documentCode") ? filterMap.getInt("documentCode") : null;
            DocumentAcceptableInput.Filter filter = new DocumentAcceptableInput.Filter(role, page, country, code);
            filters.add(filter);
        }
        DocumentAcceptableInput acceptableInput = new DocumentAcceptableInput(filters);
        view.setDocumentAcceptableInput(acceptableInput);
    }
}
