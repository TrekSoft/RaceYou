import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Card,
  CardItem,
  Body,
  Text
} from 'native-base';

class EventCard extends Component {

  render() {
    return (
      <Card style={{ marginLeft: 15, marginRight: 15 }}>
        <CardItem button onPress={this.props.callback}>
          <Body style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View style={{ borderRadius: 90, backgroundColor: '#00bfa5ff', width: 65, height: 65, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>{this.props.distance}</Text>
              <Text style={{ color: '#fff', fontSize: 12 }}>miles</Text>
            </View>
            <View style={{ flexDirection: 'column', marginLeft: 15, height: 65, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>{this.props.time}</Text>
              {this.props.inProgress ? (
                <Text style={{ color: 'red'}}>In progress...</Text>
              ) : (
                <Text>{this.props.numRegistered} registered</Text>
              )}
            </View>
          </Body>
        </CardItem>
      </Card>
    );
  }
}

export default EventCard;
