import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import BackgroundGeolocation from 'react-native-background-geolocation';
import firebase from 'react-native-firebase';
import * as styles from './styles';
import * as actions from './actions';

class EventDetails extends Component {
  static navigationOptions = {
    title: 'Event Details'
  };

  state = {
    timeLeft: null,
    event: this.props.events[this.props.navigation.getParam('eventId')]
  };

  componentDidMount() {
    firebase.analytics().setCurrentScreen('EventDetails', 'RaceYou');
    this.updateCountdown();
    this.countdown = setInterval(this.updateCountdown.bind(this), 1000);
    BackgroundGeolocation.ready(
      {
        reset: true,
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 1,
        debug: false
      },
      state => {
        if (!state.enabled) {
          BackgroundGeolocation.start();
        }
      }
    );
  }

  willLeavePage = this.props.navigation.addListener(
    'willBlur',
    this.clearUpdater.bind(this)
  );

  clearUpdater() {
    clearInterval(this.countdown);
  }

  updateCountdown() {
    const currentDate = new Date();
    const startDate = this.state.event.time;
    const timeLeft = Math.floor((startDate.getTime() - currentDate.getTime()) / 1000);

    if(timeLeft <= 0) {
      firebase.analytics().logEvent('race_started', { distance: this.state.event.distance });
      this.props.navigation.navigate('Race', { eventId: this.state.event.id });
    }

    this.setState({ timeLeft });
  }

  cancelEvent() {
    Alert.alert(
      'Confirm race cancellation',
      'Are you sure you don\'t want to run in this event?',
      [
        {text: 'No, keep it', style: 'cancel'},
        {text: 'Yeah, I\'m sure', onPress: () =>
          this.props.cancelEvent(this.props.user, this.state.event)
            .then(() => this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Home' })], 0))
        },
      ],
      { cancelable: false }
    );
  }

  renderParticipants() {
    return Object.values(this.state.event.registrants).map((registrant, index) =>
      <Text key={index}>{registrant.username}</Text>
    );
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalTop]}>
          <View style={{ marginTop: 40, marginBottom: 30 }}>
            <Text style={{ textAlign: 'center' }}>
              <Text style={styles.header}>Have this screen open to start your </Text>
              <Text style={[styles.header, { fontWeight: 'bold' }]}>{this.state.event.distance}</Text>
              <Text style={styles.header}> mile race in:</Text>
            </Text>
          </View>

          <View style={[styles.listBoxDark, {marginBottom: 30}]}>
            <Text style={styles.countdown}>
              <Text style={styles.countdown}>{Math.floor(this.state.timeLeft/60/60/24)}d </Text>
              <Text style={styles.countdown}>{Math.floor(this.state.timeLeft/60/60) % 24}h </Text>
              <Text style={styles.countdown}>{Math.floor(this.state.timeLeft/60) % 60}m </Text>
              <Text style={styles.countdown}>{Math.floor(this.state.timeLeft) % 60}s </Text>
            </Text>
          </View>

          <View style={[styles.listBox, {padding: 20, paddingBottom: 20, marginBottom: 30, flex: 1}]}>
            <Text style={{ fontSize: 20, marginBottom: 5 }}>Participants:</Text>
            <ScrollView>
              {this.renderParticipants()}
            </ScrollView>
          </View>

          <Button style={[styles.buttonLight, {marginBottom: 20}]} onPress={() => this.cancelEvent()}>
            <Text>Cancel Registration</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    events: state.events.list
  };
};

export default connect(mapStateToProps, actions)(EventDetails);
