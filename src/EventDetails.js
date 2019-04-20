import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
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
    this.updateCountdown();
    this.countdown = setInterval(this.updateCountdown.bind(this), 1000);
  }

  updateCountdown() {
    const currentDate = new Date();
    const startDate = this.event.time;
    this.setState({ timeLeft: Math.floor((startDate.getTime() - currentDate.getTime()) / 1000) });
  }

  clearCountdown() {
    clearInterval(this.countdown);
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

          <View style={styles.listBoxDark}>
            <Text style={styles.countdown}>
              <Text style={styles.countdown}>{Math.floor(this.state.timeLeft/60/60/24)}d </Text>
              <Text style={styles.countdown}>{Math.floor(this.state.timeLeft/60/60) % 24}h </Text>
              <Text style={styles.countdown}>{Math.floor(this.state.timeLeft/60) % 60}m </Text>
              <Text style={styles.countdown}>{Math.floor(this.state.timeLeft) % 60}s </Text>
            </Text>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events.list
  };
};

export default connect(mapStateToProps, actions)(EventDetails);
