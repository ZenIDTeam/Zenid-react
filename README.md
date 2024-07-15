# ZenID Integration for React Native

This module integrates the ZenID SDK into your React Native application, allowing you to perform document verification. The integration covers both iOS and Android platforms.

## Table of Contents

- [ZenID Integration for React Native](#zenid-integration-for-react-native)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [iOS Installation](#ios-installation)
    - [Android Installation](#android-installation)
  - [Usage](#usage)
    - [Authorization](#authorization)
      - [JavaScript](#javascript)
    - [Document Verification](#document-verification)
      - [JavaScript](#javascript-1)
    - [Sending Image with Signature](#sending-image-with-signature)
  - [Configuration](#configuration)
    - [iOS](#ios)
    - [Android](#android)
  - [API Documentation](#api-documentation)
    - [Methods](#methods)
      - [`ZenId.getChallengeToken()`](#zenidgetchallengetoken)
      - [`ZenId.authorize(responseToken)`](#zenidauthorizeresponsetoken)
    - [DocumentPictureView](#documentpictureview)
  - [Hooks](#hooks)
    - [`useOnDocumentPictureStateChanged`](#useondocumentpicturestatechanged)
    - [`useOnPictureTaken`](#useonpicturetaken)
  - [Known Issues](#known-issues)
  - [More info](#more-info)

## Features

- Document verification (ID card, Passport, Driving license, etc.)

## Prerequisites

- React Native 0.60 or higher
- iOS 13.0 or higher
- Android 5.0 (API level 21) or higher
- Xcode 15 or higher
- Android Studio with NDK 21.3.6528147

## Installation

Instalation is already complete in this repository, but it can be needed to verify for your usecase

### iOS Installation

1. **Static Linking of Frameworks**

Link your project against `RecogLib.xcframework` and `LibZenid.xcframework` frameworks. Frameworks are located in the `Sources` directory of the ZenID SDK.

2. **Installation with SPM**

- Open your Xcode project.
- Add remote package dependency `https://github.com/ZenIDTeam/ZenID-ios.git`.
- In your app target, General tab add **LibZenid_iOS** and **Recoglib_iOS** frameworks.

3. **Add ZenID modules**
   Add ZenId modules provided to `./Modules` in root of application

### Android Installation

1. **Add the required AAR files**

Put the ZenID AAR files in the `libs` folder of your app.

2. **Update `build.gradle`**

Edit the `build.gradle` file of your app and add the following dependencies:

```groovy
ext {
    okHttpVersion = '3.14.9'
    retrofitVersion = '2.6.2'
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.2.0'
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
    implementation "com.squareup.okhttp3:okhttp:$okHttpVersion"
    implementation "com.squareup.okhttp3:logging-interceptor:$okHttpVersion"
    implementation "com.squareup.retrofit2:retrofit:$retrofitVersion"
    implementation "com.squareup.retrofit2:converter-gson:$retrofitVersion"
    implementation 'com.jakewharton.timber:timber:4.7.1'
    implementation 'com.otaliastudios:cameraview:2.6.4'
    implementation fileTree(include: ['*.aar'], dir: 'libs')
}
```

3. **Add credentials to updated Android camera**

To reduce the size of your APK, apply APK split by ABI:

```groovy
    maven {
            url 'https://maven.pkg.github.com/ZenIDTeam/CameraView'
            credentials {
                username = "ZenIDTeam"
                password = "---your key---"
            }

        }
```

## Usage

### Authorization

Before using any SDK features, you need to authorize the SDK.

#### JavaScript

1. **Initialize app (needed for android only, but it can be called for ios aswell)**

   ```javascript
   useEffect(() => {
     ZenId.initializeSdk()
       .then(message => {
         console.log(message);
         setIsLoading(false);
       })
       .catch(error => {
         console.error(error);
       });
   }, []);
   ```

1. **Get challengeToken from SDK and send `challengeToken` to the initSDK API endpoint and authorize the SDK:**

```javascript
import axios from 'axios';

const authorizeSDK = async () => {
  const challengeToken = await ZenId.getChallengeToken();

  try {
    const response = await axios.get(
      `https://your-api-url/initSdk?token=${challengeToken}`,
    );
    const responseToken = response.data.Response;

    const authorized = await ZenId.authorize(responseToken);
    if (authorized) {
      console.log('SDK authorized successfully');
    } else {
      console.error('SDK authorization failed');
    }
  } catch (error) {
    console.error('Error during SDK authorization:', error);
  }
};
```

1. **Select profile**
   After authorization you need to select profile of app... if you pass empty string, default profile will be selected

```javascript
ZenId.selectProfile('');
```

### Document Verification

#### JavaScript

1. **Use DocumentPictureView Component from sdk to show camera capture:**

```javascript
<ZenId.DocumentPictureView
  configuration={configuration}
  ref={documentPictureViewRef}
  style={{
    flex: 1,
    width: '100%',
    height: '100%',
  }}
/>
```

2. **use UseOnPictureTaken hook with provided callback to handle picture take event**

```javascript
const handlePictureTaken = (response: PictureTakenResult) => {
  console.log('Document Picture Taken: ', response);
  setIsLoading(true);
  sendSamplePicture(response).then(data => {
    if (!data) {
      return;
    }
    navigation.navigate('Result', {data});
  });
};
```

### Sending Image with Signature

To send the image along with its signature using base64 octet-stream, you can follow this approach:

1. **Send image data provided in callback from sdk to Backend as octet stream with appended signature at the end of request:**

```javascript
const sendImageWithSignature = async (imageData, signature) => {
  const imageData = base64toBinary(file);
  console.log('Reading file');
  const encoder = new TextEncoder();

  const signatureData = encoder.encode(signature);
  const httpBodyData = new Uint8Array(imageData.length + signatureData.length);
  httpBodyData.set(imageData, 0);
  httpBodyData.set(signatureData, imageData.length);

  const url = new URL(baseUrl + 'sample');

  url.searchParams.append('country', country.toString());
  url.searchParams.append('pageCode', pageCode.toString());
  url.searchParams.append('role', role.toString());
  url.searchParams.append('stateIndex', stateIndex.toString());
  url.searchParams.append('expectedSampleType', 'DocumentPicture');
  url.searchParams.append('api_key', apiKey);
  console.log('url', url.toString());

  const response = await axiosInstance
    .post(url.toString(), httpBodyData, {
      headers: {
        'Content-type': '"application/octet-stream"',
        Accept: 'application/json',
        'Content-Length': httpBodyData.length.toString(),
      },
    })
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Server responded with status:', error.response.status);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
      console.error('Error config:', error.config);
    });
};
```

## Configuration

### iOS

Link your project against the required frameworks and configure your Xcode project as specified in the installation steps.

### Android

Add the necessary dependencies and configure your `build.gradle` file as specified in the installation steps.

## API Documentation

### Methods

#### `ZenId.getChallengeToken()`

Fetches the challenge token required for SDK authorization.

**Usage:**

```javascript
const challengeToken = await ZenId.getChallengeToken();
```

#### `ZenId.authorize(responseToken)`

Authorizes the SDK with the provided response token.

**Parameters:**

- `responseToken` (string): The response token received from the initSDK API endpoint.

**Usage:**

```javascript
const authorized = await ZenId.authorize(responseToken);
if (authorized) {
  console.log('SDK authorized successfully');
} else {
  console.error('SDK authorization failed');
}
```

### DocumentPictureView

The `DocumentPictureView` component is used to capture and verify documents.

**Usage:**

```javascript
import {DocumentPictureView} from './ZenId';

const MyDocumentPictureView = () => {
  const handleStateChanged = state => {
    console.log('State changed:', state);
  };

  const handlePictureTaken = result => {
    console.log('Picture taken:', result);
  };

  return (
    <DocumentPictureView
      configuration={{
        showVisualisation: true,
        showHelperVisualisation: false,
        showDebugVisualisation: false,
        dataType: 'picture',
        role: DocumentRole.Idc,
        country: DocumentCountry.Cz,
        page: DocumentPage.Front,
        code: 1234,
        documents: [
          {
            role: DocumentRole.Idc,
            country: DocumentCountry.Cz,
            page: DocumentPage.Front,
            code: 1234,
          },
        ],
        settings: {key: 'value'},
      }}
    />
  );
};

export default MyDocumentPictureView;
```

Jistě, zde je dokumentace pro všechny hooky, které poskytujete ve vašem modulu:

---

## Hooks

**Parameters:**

- `callback` (function): The callback function to handle the event.

### `useOnDocumentPictureStateChanged`

This hook is used to handle changes in the document picture state.

**Usage:**

```javascript
import {useOnDocumentPictureStateChanged} from './ZenId';

const onStateChanged = useOnDocumentPictureStateChanged(state => {
  console.log('Document picture state changed:', state);
});
```

**Parameters:**

- `callback` (function): The callback function to handle state changes.

### `useOnPictureTaken`

This hook is used to handle the event when a picture is taken.

**Usage:**

```javascript
import {useOnPictureTaken} from './ZenId';

const onPictureTaken = useOnPictureTaken(result => {
  console.log('Picture taken:', result);
});
```

**Parameters:**

- `callback` (function): The callback function to handle the picture taken event.

## Known Issues

- Make sure to handle the necessary permissions for camera access on both iOS and Android.
- Ensure that the device has a working camera for document verification.

## More info

- [ZenId-ios](https://github.com/ZenIDTeam/ZenID-ios/blob/master/README.md)
- [ZenId-Android](https://github.com/ZenIDTeam/ZenID-android-sample)
