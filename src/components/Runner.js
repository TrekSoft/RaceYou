import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';

// Parameters:
//   - percentComplete = 0 - 100
//   - username = String
class Runner extends Component {
  stringToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour+"99";
  }

  render() {
    return (
      <View style={{flex:1, width:'100%', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{height: 5, width: '100%', backgroundColor: 'grey', justifyContent: 'center'}}>
          <View style={{ paddingLeft: this.props.percentComplete+'%', flexDirection: 'row', alignItems: 'center'}}>
            <View style={{height: 20, width: 20, borderRadius: 45, marginRight: 10, backgroundColor:'black'}}></View>
            <View style={{padding: 5, borderRadius: 5, backgroundColor: this.stringToColor(this.props.username)}}>
              <Text style={{fontWeight: "bold"}}>{this.props.username}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Runner;
