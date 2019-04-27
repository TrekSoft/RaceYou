import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import * as styles from './styles';
import * as actions from './actions';

class EventDetails extends Component {
  static navigationOptions = {
      title: 'Event Details'
  }

  state = {
    timeLeft: null
  }

  willLeavePage = this.props.navigation.addListener('willBlur', this.clearCountdown.bind(this));

  componentWillMount() {
    this.event = this.props.events[this.props.navigation.getParam('eventId')];
    // const currentTime = new Date();
    // this.event.time = new Date(currentTime.getTime() + 5000);
    this.updateCountdown();
    this.countdown = setInterval(this.updateCountdown.bind(this), 1000);
  }

  updateCountdown() {
    const currentDate = new Date();
    const startDate = this.event.time;
    const timeLeft = Math.floor((startDate.getTime() - currentDate.getTime()) / 1000);

    if(timeLeft <= 0) {
      this.props.navigation.navigate('Race', { eventId: this.event.id });
    }

    this.setState({ timeLeft });
  }

  clearCountdown() {
    clearInterval(this.countdown);
  }

  cancelEvent() {
    Alert.alert(
      'Confirm race cancellation',
      'Are you sure you don\'t want to run in this event?',
      [
        {text: 'No, keep it', style: 'cancel'},
        {text: 'Yeah, I\'m sure', onPress: () =>
          this.props.cancelEvent(this.props.user, this.event)
            .then(() => this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Home' })], 0))
        },
      ],
      { cancelable: false }
    );
  }

  renderParticipants() {
    return Object.values(this.event.registrants).map((registrant, index) =>
      <Text key={index}>{registrant.username}</Text>
    );
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalTop]}>
          <View style={{ marginTop: 50, marginBottom: 30 }}>
            <Text style={{ textAlign: 'center' }}>
              <Text style={styles.header}>Have this screen open to start your </Text>
              <Text style={[styles.header, { fontWeight: 'bold' }]}>{this.event.distance}</Text>
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
