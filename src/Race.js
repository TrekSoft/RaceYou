import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Runner from './components/Runner';
import * as styles from './styles';
import * as actions from './actions';

class Race extends Component {
  static navigationOptions = {
      title: 'Live Race'
  }

  state = {
    longitude: null,
    latitude: null,
    altitude: null,
    distance: 0.0
  }

  componentWillMount() {
    this.event = this.props.events[this.props.navigation.getParam('eventId')];

    this.getLocation();
    this.locationUpdater = setInterval(this.getLocation.bind(this), 1000);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const oldLat = this.state.latitude;
        const oldLon = this.state.longitude;
        const newLat = position.coords.latitude;
        const newLon = position.coords.longitude;
        let newDist;

        if(oldLat != null && oldLon != null) {
          newDist = (parseFloat(this.state.distance) + parseFloat(distanceInMiles(oldLat, oldLon, newLat, newLon))).toFixed(2);
        } else {
          newDist = this.state.distance;
        }

        this.setState({
          longitude: newLon,
          latitude: newLat,
          altitude: position.coords.altitude,
          distance: newDist
        });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.pageLight, styles.verticalTop, {paddingHorizontal: 0}]}>
          <View style={styles.raceHeader}>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>{this.state.distance}</Text>
              <Text style={styles.raceHeaderSubtext}>miles</Text>
            </View>
            <View style={styles.raceHeaderDivider}></View>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>2:24</Text>
              <Text style={styles.raceHeaderSubtext}>runtime</Text>
            </View>
            <View style={styles.raceHeaderDivider}></View>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>3rd</Text>
              <Text style={styles.raceHeaderSubtext}>/ 46</Text>
            </View>
          </View>
          <View style={{flex: 1, width: '100%', flexDirection: 'column'}}>
            <Runner percentComplete="60" username="good-guy" />
            <Runner percentComplete="55" username="myruggy89" />
            <Runner percentComplete={(this.state.distance / this.event.distance) * 100} username="svandermark" />
            <Runner percentComplete="32" username="Patches46" />
            <Runner percentComplete="21" username="dwreyes" />
          </View>
        </Content>
      </Container>
    );
  }
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInMiles(lat1, lon1, lat2, lon2) {
  return distanceInKm(lat1, lon1, lat2, lon2) * 0.62137119;
}

function distanceInKm(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return earthRadiusKm * c;
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    events: state.events.list
  };
};

export default connect(mapStateToProps, actions)(Race);
