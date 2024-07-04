package com.zenidnative;

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
    private ReadableMap initialConfiguration;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected DocumentPictureView createViewInstance(ThemedReactContext reactContext) {
        DocumentPictureView view = new DocumentPictureView(reactContext);
        view.open();

        if (initialConfiguration != null) {
            applyConfiguration(view, initialConfiguration, reactContext);
        }

        return view;
    }

    @ReactProp(name = "configuration")
    public void setConfiguration(DocumentPictureView view, ReadableMap configuration) {
        this.initialConfiguration = configuration;
        if (view != null) {
            applyConfiguration(view, configuration, (ThemedReactContext) view.getContext());
        }
    }

    private void applyConfiguration(DocumentPictureView view, ReadableMap configuration, ThemedReactContext reactContext) {
        try {
            boolean showVisualisation = configuration.hasKey("showVisualisation") && configuration.getBoolean("showVisualisation");
            boolean showHelperVisualisation = configuration.hasKey("showHelperVisualisation") && configuration.getBoolean("showHelperVisualisation");
            boolean showDebugVisualisation = configuration.hasKey("showDebugVisualisation") && configuration.getBoolean("showDebugVisualisation");
            String dataTypeRaw = configuration.hasKey("dataType") ? configuration.getString("dataType") : "picture";
            int roleRaw = configuration.hasKey("role") ? configuration.getInt("role") : -1;
            int countryRaw = configuration.hasKey("country") ? configuration.getInt("country") : 0;
            int pageRaw = configuration.hasKey("page") ? configuration.getInt("page") : -1;
            int codeRaw = configuration.hasKey("code") ? configuration.getInt("code") : -1;
            ReadableArray documentsRaw = configuration.hasKey("documents") ? configuration.getArray("documents") : null;
            ReadableMap settingsRaw = configuration.hasKey("settings") ? configuration.getMap("settings") : null;

            DocumentPictureSettings documentPictureSettings = createDocumentPictureSettings();
            view.setDocumentPictureSettings(documentPictureSettings);

            VisualizationSettings visualizationSettings = createDefaultVisualizationSettings(showDebugVisualisation, showHelperVisualisation, showVisualisation);
            view.enableDefaultVisualization(visualizationSettings);

            List<DocumentAcceptableInput.Filter> filters = createDocumentFilters(documentsRaw);
            DocumentAcceptableInput acceptableInput = new DocumentAcceptableInput(filters);
            view.setDocumentAcceptableInput(acceptableInput);

            if (view.getContext() instanceof LifecycleOwner) {
                view.setLifecycleOwner((LifecycleOwner) view.getContext());
            }

            setDefaultCallback(view, reactContext);

        } catch (Exception e) {
            Timber.e(e, "Failed to set configuration for DocumentPictureView");
        }
    }

    private DocumentPictureSettings createDocumentPictureSettings() {
        return new DocumentPictureSettings.Builder()
                .enableAimingCircle(true)
                .showTimer(true)
                .drawOutline(true)
                .build();
    }

    private VisualizationSettings createDefaultVisualizationSettings(boolean showDebugVisualization, boolean showHelperVisualization, boolean showTextInformation) {
        return new VisualizationSettings.Builder()
                .showDebugVisualization(showDebugVisualization)
                .showTextInformation(showHelperVisualization)
                .language(Language.ENGLISH)
                .build();
    }

    private List<DocumentAcceptableInput.Filter> createDocumentFilters(ReadableArray documentsRaw) {
        List<DocumentAcceptableInput.Filter> filters = new ArrayList<>();
        if (documentsRaw != null) {
            for (int i = 0; i < documentsRaw.size(); i++) {
                ReadableMap docMap = documentsRaw.getMap(i);
                if (docMap != null) {
                    int docRoleRaw = docMap.hasKey("role") ? docMap.getInt("role") : -1;
                    int docCountryRaw = docMap.hasKey("country") ? docMap.getInt("country") : 0;
                    int docPageRaw = docMap.hasKey("page") ? docMap.getInt("page") : -1;
                    int docCodeRaw = docMap.hasKey("code") ? docMap.getInt("code") : -1;

                    DocumentRole docRole = docRoleRaw != -1 ? DocumentRole.values()[docRoleRaw] : null;
                    DocumentCountry docCountry = DocumentCountry.values()[docCountryRaw];
                    DocumentPage docPage = docPageRaw != -1 ? DocumentPage.values()[docPageRaw] : null;

                    DocumentAcceptableInput.Filter filter = new DocumentAcceptableInput.Filter(docRole, docPage, docCountry, docCodeRaw);
                    filters.add(filter);
                }
            }
        }
        return filters;
    }

    private void setDefaultCallback(DocumentPictureView view, ThemedReactContext reactContext) {
        view.setCallback(new DocumentPictureView.Callback() {
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

                    try (FileInputStream fis = new FileInputStream(file)) {
                        fis.read(bytes);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    String encodedString = Base64.encodeToString(bytes, Base64.DEFAULT);
                    jsonResult = new JSONObject()
                            .put("stateIndex", documentPictureResult.getStateIndex())
                            .put("filePath", documentPictureResult.getFilePath())
                            .put("signature", documentPictureResult.getSignature())
                            .put("role", documentPictureResult.getRole())
                            .put("country", documentPictureResult.getCountry().toString())
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
    }

    @Override
    public void onDropViewInstance(DocumentPictureView view) {
        super.onDropViewInstance(view);
        if (view != null) {
            view.destroy();
        }
    }
}
