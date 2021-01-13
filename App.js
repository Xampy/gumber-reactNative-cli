/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View
} from 'react-native';
import GumberGame from './src/GameActivity';

import { AdMobInterstitial } from 'react-native-admob';


const testID = 'ca-app-pub-3940256099942544/1033173712';
const productionID = 'ca-app-pub-6525278703893250/9319049681';

const adUnitId = !__DEV__ ? productionID : testID;

class App extends React.Component {
    componentDidMount(){
        AdMobInterstitial.setAdUnitID(adUnitId);
AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
    }

    render(){
        return (
            <View style={ styles.container }>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={ styles.container }>
                <GumberGame></GumberGame>
            </SafeAreaView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2596b1',
      },
});

export default App;
