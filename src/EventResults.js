import React, { Component } from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { Container, Content, Button, Icon } from 'native-base';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import * as styles from './styles';
import * as actions from './actions';

class EventResults extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Event Results',
      headerLeft: (
        <Button dark transparent onPress={() => navigation.navigate('Home')}>
          <Icon name="home" type="FontAwesome5" />
        </Button>
      )
    };
  };

  state = {
    event: null,
    user: null
  };

  componentDidMount() {
    firebase.analytics().setCurrentScreen('EventResults', 'RaceYou');
    this.updateResults();
    this.resultsUpdater = setInterval(this.updateResults.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.resultsUpdater);
  }

  updateResults() {
    const doc = firebase
      .firestore()
      .collection('Events')
      .doc(this.props.navigation.getParam('eventId'));

    doc.get().then(response => {
      const event = { ...response.data(), id: response.id };
      const user = event.registrants[this.props.user.id];

      this.setState({ event, user });
    });
  }

  getPremium() {
    const self = this;
    firebase.analytics().logEvent('get_premium', { distance: this.state.event.distance });

    Alert.alert(
      'Upgrade to Premium',
      'Congratulations! As one of our early users, you\'ve earned a year of Premium for free.',
      [
        {text: 'Claim free year', onPress: () => {
          const premiumExpirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
          firebase.firestore().collection('Users').doc(self.props.user.id)
          .update({ premiumExpirationDate })
          .then(self.props.setUser({ ...self.props.user, premiumExpirationDate: {seconds: premiumExpirationDate.getTime() / 1000}}));
        }}
      ],
      {cancelable: false},
    );
  }

  isPremium() {
    const expires = this.props.user.premiumExpirationDate;
    return expires && new Date(expires.seconds * 1000).getTime() > new Date().getTime();
  }

  renderPremiumRank() {
    let genderRank, ageRank, genderAgeRank;

    if (this.isPremium()) {
        genderRank = 'Coming',
        ageRank = 'soon',
        genderAgeRank = '...'
    }

    return (
      <View style={[styles.premiumStatsContainer, {padding: (this.isPremium() ? 0 : 20), paddingHorizontal: '9%'}]}>
        { !this.isPremium() &&

          <View style={styles.premiumOverlayContainer}>
            <Text style={styles.premiumMessage}>Get age, gender, and elevation change: $1/month</Text>
            <Button style={styles.premiumButton} onPress={this.getPremium.bind(this)}><Text>Get Premium</Text></Button>
          </View>
        }

        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={ styles.headerRankContainer }><View style={styles.listBoxDark}><Text style={[styles.countdown, { fontSize: 18 }]}>{genderRank}</Text></View></View>
          <View style={ styles.headerRankContainer }><View style={styles.listBoxDark}><Text style={[styles.countdown, { fontSize: 18 }]}>{ageRank}</Text></View></View>
          <View style={ styles.headerRankContainer }><View style={styles.listBoxDark}><Text style={[styles.countdown, { fontSize: 18 }]}>{genderAgeRank}</Text></View></View>
        </View>

        <Text style={[styles.whiteText, { fontSize: 16 }]}>
          Elevation is the runner's max altitude minus their min altitude in feet.
        </Text>
      </View>
    );
  }

  renderSummary() {
    if (!this.state.user) {
      return;
    }

    const { user, event } = this.state;
    const secondsPerMile = user.finalTime / event.distance;

    return (
      <View style={{ marginTop: 30, marginBottom: 10, alignItems: 'center' }}>
        <Text style={[styles.header, { marginBottom: 5 }]}>You finished</Text>
        <Text style={styles.header}>{this.state.event.distance} miles @ {formattedSeconds(secondsPerMile)}/mile</Text>
      </View>
    );
  }

  renderResults() {
    if (!this.state.event) {
      return;
    }

    let runnersArray = [];
    const registrants = this.state.event.registrants;
    let otherRunners = 0;

    for(key in registrants) {
      if(registrants[key].finalTime) {
        runnersArray.push(registrants[key]);
      }
      else if(registrants[key].distance > 0) {
        otherRunners++;
      }
    }

    runnersArray.sort((a, b) => (a.finalTime - b.finalTime));

    return (
      <>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          { this.renderRunnerList(runnersArray) }
        </ScrollView>

        <View style={styles.tableRow}>
          <Text style={{ flex: 1, textAlign: 'center', color: '#777'}}>{otherRunners} more running...</Text>
        </View>
      </>
    );
  }

  renderRunnerList(runnersArray) {
    return runnersArray.map(
      (runner, index) =>
        <View key={index} style={styles.tableRow}>
          <Text numberOfLines={1} style={styles.tableCell}>{index+1}</Text>
          <Text numberOfLines={1} style={[styles.tableCell, { flex: 3 }]}>{runner.username}</Text>
          { this.isPremium() &&
            <>
              <Text numberOfLines={1} style={styles.tableCell}>{runner.gender}</Text>
              <Text numberOfLines={1} style={styles.tableCell}>{getAge(runner.birthday)}</Text>
              <Text numberOfLines={1} style={[styles.tableCell, { flex: 3 }]}>
                {runner.maxAlt && runner.minAlt ? (runner.maxAlt - runner.minAlt) | 0 : 0}ft
              </Text>
            </>
          }
          { !this.isPremium() && <View style={styles.premium3Col}><Text>Premium</Text></View> }
          <Text numberOfLines={1} style={styles.tableCell}>{formattedSeconds(runner.finalTime)}</Text>
        </View>
    );
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalTop, { paddingHorizontal: '1%'}]}>
          {this.renderSummary()}

          <View style={[styles.listBox, {marginBottom: 30, padding: 10, flex: 1, flexDirection: 'column' }]}>
            <View style={styles.tableRow}>
              <Text numberOfLines={1} style={styles.tableHeading}>Rank</Text>
              <Text numberOfLines={1} style={[styles.tableHeading, { flex: 3 }]}>Name</Text>
              <Text numberOfLines={1} style={styles.tableHeading}>Sex</Text>
              <Text numberOfLines={1} style={styles.tableHeading}>Age</Text>
              <Text numberOfLines={1} style={[styles.tableHeading, { flex: 3 }]}>Elevation</Text>
              <Text numberOfLines={1} style={styles.tableHeading}>Time</Text>
            </View>

            {this.renderResults()}
          </View>

          <View style={{ flexDirection: 'row', paddingHorizontal: '9%' }}>
            <View style={ styles.headerRankContainer }><Text style={styles.headerRank}>Rank / Sex</Text></View>
            <View style={ styles.headerRankContainer }><Text style={styles.headerRank}>Rank / Age</Text></View>
            <View style={ styles.headerRankContainer }><Text style={styles.headerRank}>Rank / Age + Sex</Text></View>
          </View>

          { this.renderPremiumRank() }
        </Content>
      </Container>
    );
  }
}

function getAge(birthTimestamp) {
  var today = new Date();
  var birthday = new Date(birthTimestamp.seconds * 1000);
  var age = today.getFullYear() - birthday.getFullYear();
  var m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}

function formattedSeconds(seconds) {
  return zeroPad(Math.floor(seconds/60)) +
  ":" +
  zeroPad(Math.floor(seconds) % 60);
}

function truncateDecimals(num, digits) {
  var numS = num.toString(),
    decPos = numS.indexOf('.'),
    substrLength = decPos === -1 ? numS.length : 1 + decPos + digits,
    trimmedResult = numS.substr(0, substrLength);

  return isNaN(trimmedResult) ? '0' : trimmedResult;
}

function zeroPad(myNumber) {
  return ("0" + myNumber).slice(-2);
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    events: state.events.list
  };
};

export default connect(mapStateToProps, actions)(EventResults);
