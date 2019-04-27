import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import 'intl';
import 'intl/locale-data/jsonp/en';
import EventCard from './components/EventCard';
import * as styles from './styles';
import * as actions from './actions';

class Home extends Component {
  static navigationOptions = {
      header: null
  }

  state = {
    loadingEvents: true
  }

  componentDidMount() {
    this.props.loadEvents()
    .then(() => this.setState({loadingEvents: false}));
  }

  eventRegister(event) {
    Alert.alert(
      'Confirm race signup',
      'Would you like to register for the ' +
      event.distance +
      ' mile race at ' +
      event.time.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true}) +
      ' on ' +
      event.time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) +
      '?',
      [
        {text: 'Oops, nope', style: 'cancel'},
        {text: 'Let\'s gooo!', onPress: () => this.props.registerForEvent(this.props.user, event)},
      ],
      { cancelable: false }
    );
  }

  renderEvents(events, isRegistered) {
    return events.map(
      (event, index) =>
        <EventCard
          key={index}
          distance={Number.parseFloat(event.distance).toFixed(1)}
          time={event.time.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}
          numRegistered={Object.keys(event.registrants).length}
          callback={() => {
            if (!isRegistered) {
              this.eventRegister(event);
            } else {
              this.props.navigation.navigate('EventDetails', { eventId: event.id });
            }
          }}
        />
    );
  }

  renderDates(dates, isRegistered) {
    if (dates && Object.keys(dates).length > 0) {
      const self = this;

      return Object.keys(dates).map(function(key, index) {
          const date = new Date(key);
          const month = date.toLocaleString('en-us', { month: 'short' });
          const day = date.toLocaleString('en-us', { day: '2-digit' });
          const year = date.toLocaleString('en-us', { year: 'numeric' });
          const events = dates[key];

          return (
            <View key={index} style={{ flexDirection: 'row', marginLeft: 15, marginTop: 15 }}>
              <View style={{ flexDirection: 'column', marginTop: 5, alignItems: 'center' }}>
                <Text style={{ fontSize: 15, color: '#666666' }}>{ month }</Text>
                <Text style={{ fontSize: 25, color: '#666666', fontWeight: 'bold' }}>{ day }</Text>
                <Text style={{ fontSize: 15, color: '#666666' }}>{ year }</Text>
              </View>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                {self.renderEvents(events, isRegistered)}
              </View>
            </View>
          );
      });
    } else if(this.state.loadingEvents) {
      return (
        <Text style={styles.listText}>{'Loading events... \n (Internet connection required)'}</Text>
      );
    } else {
      return (
        <Text style={styles.listText}>{'No events found'}</Text>
      )
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalTop]}>
          <View style={styles.listHeaderContainer}>
            <Text style={styles.header}>My Upcoming Races</Text>
          </View>
          <View style={styles.listBox}>
            <ScrollView>
              {this.renderDates(this.props.userEvents, true)}
            </ScrollView>
          </View>

          <View style={styles.listHeaderContainer}>
            <Text style={styles.header}>Available Races</Text>
          </View>
          <View style={[styles.listBox, { flex: 1, marginBottom: 20 }]}>
            <ScrollView>
              {this.renderDates(this.props.availableEvents, false)}
            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const events = state.events.list;
  const userId = state.user.id;

  const userEvents = [];
  const availableEvents = [];

  Object.values(events).forEach(event => {
    const date = event.time.toLocaleDateString("en-US");

    if(Object.keys(event.registrants).includes(userId)) {
      console.log(event, userId);

      if(!userEvents[date]) {
        userEvents[date] = [];
      }

      userEvents[date].push(event);
    } else {
      if(!availableEvents[date]) {
        availableEvents[date] = [];
      }

      availableEvents[date].push(event);
    }
  });

  return {
    userEvents,
    availableEvents,
    user: state.user
  };
};

export default connect(mapStateToProps, actions)(Home);
