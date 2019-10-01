import React, { Component } from 'react';
import { View, ScrollView, Alert, Linking } from 'react-native';
import { Container, Content, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import firebase from 'react-native-firebase';
import EventCard from './components/EventCard';
import * as styles from './styles';
import * as actions from './actions';

class Home extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loadingEvents: true
  };

  componentDidMount() {
    firebase.analytics().setCurrentScreen('Home', 'RaceYou');
    this.props.loadEvents().then(() => this.setState({ loadingEvents: false }));
  }

  eventRegister(event) {
    Alert.alert(
      'Confirm race signup',
      'Would you like to register for the ' +
        event.distance +
        ' mile race at ' +
        moment(event.time).format('LLLL') +
        '?',
      [
        {
          text: 'Oops, nope',
          style: 'cancel'
        },
        {
          text: "Let's go!",
          onPress: () => this.props.registerForEvent(this.props.user, event)
        }
      ],
      { cancelable: false }
    );
  }

  renderEvents(events, isRegistered) {
    return events.map((event, index) => (
      <EventCard
        key={index}
        distance={Number.parseFloat(event.distance).toFixed(1)}
        time={moment(event.time).format('LT')}
        numRegistered={Object.keys(event.registrants).length}
        inProgress={moment(event.time).isSameOrBefore(new Date())}
        callback={() => {
          if (!isRegistered) {
            this.eventRegister(event);
          } else if (moment(event.time).isSameOrBefore(new Date())) {
            this.props.navigation.navigate('Race', {
              eventId: event.id
            });
          } else {
            this.props.navigation.navigate('EventDetails', {
              eventId: event.id
            });
          }
        }}
      />
    ));
  }

  renderDates(dates, isRegistered) {
    if (dates && Object.keys(dates).length > 0) {
      const self = this;

      return Object.keys(dates).map(function(key, index) {
        const date = new Date(key);
        const month = moment(date).format('MMM');
        const day = moment(date).format('DD');
        const dayOfWeek = moment(date).format('ddd');
        const events = dates[key];

        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              marginLeft: 15,
              marginTop: 15
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                marginTop: 5,
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: 15, color: '#666666' }}>{month}</Text>
              <Text style={styles.eventDateDay}>{day}</Text>
              <Text style={{ fontSize: 15, color: '#666666' }}>{dayOfWeek}</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              {self.renderEvents(events, isRegistered)}
            </View>
          </View>
        );
      });
    } else if (this.state.loadingEvents) {
      return (
        <Text style={styles.listText}>
          {'Loading events... \n (Internet connection required)'}
        </Text>
      );
    } else {
      return <Text style={styles.listText}>{'No events found'}</Text>;
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalTop]}>
          <View style={styles.listHeaderContainer}>
            <Text style={styles.header}>My Upcoming Events</Text>
          </View>
          <View style={[styles.listBox, { flex: 1 }]}>
            <ScrollView>
              {this.renderDates(this.props.userEvents, true)}
            </ScrollView>
          </View>

          <View style={styles.listHeaderContainer}>
            <Text style={styles.header}>Available Races</Text>
          </View>
          <View style={[styles.listBox, { flex: 1 }]}>
            <ScrollView>
              {this.renderDates(this.props.availableEvents, false)}
            </ScrollView>
          </View>

          <Button
            style={[styles.button, { marginVertical: 15 }]}
            onPress={() => Linking.openURL('mailto:raceyouapp@gmail.com')}
          >
            <Text>Questions/Feedback?</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const events = state.events.list;
  const userId = state.user.id;

  const userEvents = [];
  const availableEvents = [];

  Object.values(events).forEach(event => {
    const date = moment(event.time).format('MM/DD/YYYY');

    if (Object.keys(event.registrants).includes(userId)) {
      if (!userEvents[date]) {
        userEvents[date] = [];
      }

      userEvents[date].push(event);
    } else if (moment(event.time).isAfter(new Date())) {
      if (!availableEvents[date]) {
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

export default connect(
  mapStateToProps,
  actions
)(Home);
