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

  componentDidMount() {
    this.props.loadEvents(this.props.user.events);
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

  renderEvents(events) {
    return events.map(
      (event, index) =>
        <EventCard
          key={index}
          distance={Number.parseFloat(event.distance).toFixed(1)}
          time={event.time.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}
          numRegistered={event.registrants.length}
          callback={() => {
            if (!event.isRegistered) {
              this.eventRegister(event);
            }
          }}
        />
    );
  }

  renderDates(dates, unavailableMessage) {
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
                {self.renderEvents(events)}
              </View>
            </View>
          );
      });
    } else {
      return (
        <Text style={styles.listText}>{unavailableMessage}</Text>
      );
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
              {this.renderDates(this.props.userEvents, 'You currently have no upcoming events.\n Sign up for one below.')}
            </ScrollView>
          </View>

          <View style={styles.listHeaderContainer}>
            <Text style={styles.header}>Available Races</Text>
          </View>
          <View style={[styles.listBox, { flex: 1, marginBottom: 20 }]}>
            <ScrollView>
              {this.renderDates(this.props.availableEvents, 'Loading events...\n (internet connection required)')}
            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => (
  {
    userEvents: state.events.userEvents,
    availableEvents: state.events.availableEvents,
    user: state.user
  }
);

export default connect(mapStateToProps, actions)(Home);
