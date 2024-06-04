import {useEffect} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';

const {MyEventEmitter} = NativeModules;

export const useCustomEventCallback = <T,>(
  eventName: string,
  callback: (event: T) => void,
) => {
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(MyEventEmitter);
    const eventListener = eventEmitter.addListener(eventName, (event: T) => {
      callback(event);
    });

    return () => {
      eventListener.remove();
    };
  }, [eventName, callback]);
};
