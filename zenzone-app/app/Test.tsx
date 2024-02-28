import {CenteredView, MyText, SafeView} from '@elements/SharedElements';
import React from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const Test = () => {
  return (
    <SafeView>
      <CenteredView full>
        <MyText>Test</MyText>
      </CenteredView>
    </SafeView>
  );
};

export default Test;
