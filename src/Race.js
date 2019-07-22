import React, { Component } from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { Container, Content, Button, Fab, Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { playSounds } from './utils/SoundPlayer';
import { showErrorToast } from './utils/ErrorToast';
import Runner from './components/Runner';
import * as styles from './styles';
import * as actions from './actions';

const RANK_PREFIX = 'rank_';
const NUM_PREFIX = 'num_';
const YARDS_PER_MILE = 1760;

class Race extends Component {
  static navigationOptions = {
      title: 'Live Race'
  }

  state = {
    event: null,
    longitude: null,
    latitude: null,
    altitude: null,
    distance: 0.0,
    b1: null,
    b2: null,
    a1: null,
    a2: null,
    time: 0,
    place: '--',
    totalRunners: '--',
    mute: false,
    lastMileSoundPlayed: 0
  }

  willLeavePage = this.props.navigation.addListener('willBlur', this.clearUpdater.bind(this));

  componentDidMount() {
    this.updateReadout();
    this.readoutUpdater = setInterval(this.updateReadout.bind(this), 1000);
  }

  clearUpdater() {
    clearInterval(this.readoutUpdater);
  }

  updateReadout() {
    // Update location
    navigator.geolocation.getCurrentPosition(
      position => {
        // Get latest copy of the event before updating it
        const doc = firebase.firestore().collection('Events').doc(this.props.navigation.getParam('eventId'));

        doc.get()
        .then((response) => {
          const event = {...response.data(), id: response.id};
          this.setState({event});

          // Update time
          const now = new Date();
          this.setState({ time: (now.getTime() - this.state.event.time.getTime()) / 1000 });

          const user = event.registrants[this.props.user.id];

          if(user.distance) {
            this.setState({distance: parseFloat(user.distance)});
          }

          const oldLat = this.state.latitude;
          const oldLon = this.state.longitude;
          const newLat = position.coords.latitude;
          const newLon = position.coords.longitude;
          let newDist;

          if(oldLat != null && oldLon != null) {
            newDist = parseFloat(this.state.distance) + parseFloat(distanceInMiles(oldLat, oldLon, newLat, newLon));
          } else {
            newDist = this.state.distance;
          }

          let newRegistrants = this.state.event.registrants;
          newRegistrants[this.props.user.id].distance = newDist;

          let runnersArray = [];
          for(key in newRegistrants) {
            runnersArray.push(newRegistrants[key]);
          }

          runnersArray.sort((a, b) => (b.distance - a.distance));

          for(let i=0; i<runnersArray.length; i++) {
            if(runnersArray[i].id == user.id) {
              this.setState({ place: i+1, totalRunners: runnersArray.length });

              let a1, a2, b1, b2;
              a1 = a2 = b1 = b2 = null;

              if(i>=2) {
                a2 = runnersArray[i-2];
              }

              if(i>=1) {
                a1 = runnersArray[i-1];
              }

              if(i<runnersArray.length-2) {
                b2 = runnersArray[i+2];
              }

              if(i<runnersArray.length-1) {
                b1 = runnersArray[i+1];
              }

              this.setState({ a1, a2, b1, b2 });
            }
          }

          if(newDist >= event.distance) {
            newRegistrants[this.props.user.id].finalPlace = this.state.place;
            newRegistrants[this.props.user.id].finalTime = this.state.time;
          }

          doc.set({registrants: newRegistrants}, { merge: true })
          .then(() => {
            this.setState({
              longitude: newLon,
              latitude: newLat,
              altitude: position.coords.altitude,
              distance: newDist
            });
          })
          .catch(() => showErrorToast('Failed to upload race progress data'));

          if(newDist >= event.distance) {
            this.props.navigation.navigate('EventResults', { eventId: event.id });
          }

          if((newDist|0) > this.state.lastMileSoundPlayed && !this.state.mute) {
            this.setState({ lastMileSoundPlayed: (newDist|0) });
            this.playUpdate();
          }
        })
        .catch(() => showErrorToast('Failed to retrieve race data'));;
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  playUpdate() {
    let message = [];
    const place = parseInt(this.state.place);
    if(!isNaN(place)) {
      message.push('you_are_currently');

      if(place<100) {
        message.push('in');
        message = message.concat(getRankSound(place));
      } else {
        message.push('below', 'rank_100');
      }

      message.push('place');
    }

    const a1 = this.state.a1;
    const b1 = this.state.b1;

    if(a1!==null) {
      const distBehind = a1.distance - this.state.distance;
      message = message.concat(getNumSound((distBehind*YARDS_PER_MILE)|0));
      message = message.concat(['yards', 'behind', 'the_next_runner']);
    }

    if(a1!==null && b1!==null) {
      message.push('and');
    }

    if(b1!==null) {
      const distAhead = this.state.distance - b1.distance;
      message = message.concat(getNumSound((distAhead*YARDS_PER_MILE)|0));
      message = message.concat(['yards', 'ahead_of', 'the_previous_runner']);
    }

    playSounds(message);
  }

  renderRunners() {
    if(this.state.event) {
      return (
        <>
          {this.state.a2 ? <Runner percentComplete={(this.state.a2.distance / this.state.event.distance) * 100} username={this.state.a2.username} /> : <></>}
          {this.state.a1 ? <Runner percentComplete={(this.state.a1.distance / this.state.event.distance) * 100} username={this.state.a1.username} /> : <></>}
          <Runner percentComplete={(this.state.distance / this.state.event.distance) * 100} username={this.props.user.username} />
          {this.state.b1 ? <Runner percentComplete={(this.state.b1.distance / this.state.event.distance) * 100} username={this.state.b1.username} /> : <></>}
          {this.state.b2 ? <Runner percentComplete={(this.state.b2.distance / this.state.event.distance) * 100} username={this.state.b2.username} /> : <></>}
        </>
      );
    } else {
      return (
        <View style={{flex:1, width:'100%', justifyContent: 'center', alignItems: 'center'}}>
          <Text>Acquiring GPS...</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.pageLight, styles.verticalTop, {paddingHorizontal: 0}]}>
          <View style={styles.raceHeader}>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>{this.state.distance.toFixed(2)}</Text>
              <Text style={styles.raceHeaderSubtext}>miles</Text>
            </View>
            <View style={styles.raceHeaderDivider}></View>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>
                {zeroPad(Math.floor(this.state.time/60))}
                :
                {zeroPad(Math.floor(this.state.time) % 60)}
              </Text>
              <Text style={styles.raceHeaderSubtext}>runtime</Text>
            </View>
            <View style={styles.raceHeaderDivider}></View>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>{this.state.place}</Text>
              <Text style={styles.raceHeaderSubtext}>/ {this.state.totalRunners}</Text>
            </View>
          </View>
          <View style={{flex: 1, width: '100%', flexDirection: 'column'}}>
            {this.renderRunners()}
          </View>
          <Fab
            style={{ backgroundColor: '#1485cc' }}
            position="bottomRight"
            onPress={() => this.setState({ mute: !this.state.mute })}>
            {!this.state.mute && <Icon name="volume-up" type="FontAwesome5" />}
            {this.state.mute && <Icon name="volume-mute" type="FontAwesome5" />}
          </Fab>
        </Content>
      </Container>
    );
  }
}

function zeroPad(myNumber) {
  return ("0" + myNumber).slice(-2);
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

function getRankSound(place) {
  // Currently don't support ranks greater than 100
  if(place>100) {
    return [];
  }

  if(place < 20 || place % 10 === 0) {
    return [RANK_PREFIX + place];
  }
  else {
    return [NUM_PREFIX + (place-place%10), RANK_PREFIX + place%10];
  }
}

function getNumSound(num) {
  // Currently don't support numbers greater than or equal to a billion
  if(num>1000000000) {
    return [];
  }

  if(num > 0 && num < 20) {
    return [NUM_PREFIX + num];
  }
  else if(num < 100){
    return [NUM_PREFIX + (num-num%10)].concat(getNumSound(num%10));
  }
  else if(num < 1000){
    return [NUM_PREFIX + (num-num%100)/100, 'hundred'].concat(getNumSound(num%100));
  }
  else if(num < 1000000){
    return getNumSound((num-num%1000)/1000).concat(['thousand'].concat(getNumSound(num%1000)));
  }
  else {
    return getNumSound((num-num%1000000)/1000000).concat(['million'].concat(getNumSound(num%1000000)));
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, actions)(Race);
