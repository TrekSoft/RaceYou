import React, { Component } from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { Container, Content, Button } from 'native-base';
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import * as styles from './styles';
import * as actions from './actions';

class EventResults extends Component {
  static navigationOptions = {
      title: 'Event Results'
  }

  state = {
  }

  getPremium() {
    const self = this;

    Alert.alert(
      'Upgrade to Premium',
      'Congratulations! As one of our first users, we are giving you a year of Premium for free.',
      [
        {text: 'Claim free year', onPress: () => {
          const premiumExpirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
          console.log(self.props);
          firebase.firestore().collection('Users').doc(self.props.user.id)
          .update({ premiumExpirationDate })
          .then(self.props.setUser({ ...self.props.user, premiumExpirationDate }));
        }},
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalTop]}>
          <View style={{ marginTop: 30, marginBottom: 10, alignItems: 'center' }}>
            <Text style={[styles.header, { marginBottom: 5 }]}>You finished 3rd!</Text>
            <Text style={styles.header}>3.1 miles @ 7:17/mile</Text>
          </View>

          <View style={[styles.listBox, {marginBottom: 30, padding: 10, flex: 1, flexDirection: 'column' }]}>
            <View style={styles.tableRow}>
              <Text numberOfLines={1} style={styles.tableHeading}>Rank</Text>
              <Text numberOfLines={1} style={[styles.tableHeading, { flex: 3 }]}>Name</Text>
              <Text numberOfLines={1} style={styles.tableHeading}>Sex</Text>
              <Text numberOfLines={1} style={styles.tableHeading}>Age</Text>
              <Text numberOfLines={1} style={styles.tableHeading}>Time</Text>
            </View>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
              <View style={styles.tableRow}>
                <Text numberOfLines={1} style={styles.tableCell}>1</Text>
                <Text numberOfLines={1} style={[styles.tableCell, { flex: 3 }]}>ThisIsALongNameTest</Text>
                <View style={styles.premium2Col}><Text>Premium</Text></View>
                <Text numberOfLines={1} style={styles.tableCell}>34:01</Text>
              </View>
            </ScrollView>
            <View style={styles.tableRow}>
              <Text style={{ flex: 1, textAlign: 'center', color: '#777'}}>31 more running...</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={ styles.headerRankContainer }><Text style={styles.headerRank}>Rank/Females</Text></View>
            <View style={ styles.headerRankContainer }><Text style={styles.headerRank}>Rank/25-30</Text></View>
            <View style={ styles.headerRankContainer }><Text style={styles.headerRank}>Rank/25-30 F</Text></View>
          </View>

          <View style={styles.premiumStatsContainer}>
            <View style={styles.premiumOverlayContainer}>
              <Text style={styles.premiumMessage}>Get age, gender, and splits for $1/month</Text>
              <Button style={styles.premiumButton} onPress={this.getPremium.bind(this)}><Text>Get Premium</Text></Button>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={ styles.headerRankContainer }><View style={styles.listBoxDark}></View></View>
              <View style={ styles.headerRankContainer }><View style={styles.listBoxDark}></View></View>
              <View style={ styles.headerRankContainer }><View style={styles.listBoxDark}></View></View>
            </View>

            <Button style={styles.button} onPress={() => console.log('View splits')}>
              <Text style={styles.buttonText}>View Splits</Text>
            </Button>
          </View>
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

export default connect(mapStateToProps, actions)(EventResults);
