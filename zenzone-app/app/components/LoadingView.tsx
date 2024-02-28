import {HEIGHT} from '@constants/const';
import {CenteredView, SafeView} from '@elements/SharedElements';
import React from 'react';
import {ActivityIndicator} from 'react-native';

const LoadingView = () => {
  return (
    <SafeView>
      <CenteredView
        style={{
          height: HEIGHT,
        }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </CenteredView>
    </SafeView>
  );
};

export default LoadingView;
