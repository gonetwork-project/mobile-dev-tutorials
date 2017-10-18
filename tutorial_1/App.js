/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import WebViewBridge from 'react-native-webview-bridge';

const injectScript = `
  (function () {
    //https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify


    CallbackHandler=function(result){
        //marshall the data
        if(WebViewBridge){
          WebViewBridge.send(JSON.stringify(result));
        }
    }
    if (WebViewBridge) {

      WebViewBridge.onMessage = function(message){
          try{
            if(message === "get_accounts"){
              var accounts = GetAccounts();
              CallbackHandler({result:accounts});
            }
          }catch(e){
            CallbackHandler(e);
          }
      }
    }

  }());`;



//we will need this for futre work
var WVB_GLOBAL = null;

export default class App extends Component<{}> {
  onBridgeMessage(message) {
    try{
      if (this.refs['webviewbridge'] !== null) {
        var msg = JSON.parse(message);
        var accounts = msg.result;
        alert("react-native accounts array:"+accounts);
        }
    }catch(err){

    }
  }

  onButtonPress(){
    this.webviewbridge.sendToBridge("get_accounts");

  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <WebViewBridge
              ref={(ref) => {this.webviewbridge = ref; WVB_GLOBAL = ref;}}
              onBridgeMessage={(m) => this.onBridgeMessage(m)}
              javaScriptEnabled={true}
              injectedJavaScript={injectScript}
              // If you run android, sorry you gotta deal with some local file stuff :()
              //source={() =>
              //   Platform.OS === 'ios' ? require('./html/web3.html') :
              //     { uri: 'file:///android_asset/path-to/the-linked-file.html' }}
              source={require('./html/web3.html')}
              style={styles.webview} />
        <Button
          onPress={() => this.onButtonPress()}
          title="Get Accounts"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
   webview: {
    marginTop: 20,
    maxHeight: 200,
    width: 320,
    flex: 1
  },
});
