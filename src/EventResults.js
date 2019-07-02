import React, { Component } from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { Container, Content, Button } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import * as styles from './styles';
import * as actions from './actions';

class EventResults extends Component {
  static navigationOptions = {
      title: 'Event Results'
  }

  state = {
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

          <View style={{ padding: 10, width: '100%', marginBottom: 40 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', zIndex: 10, elevation: 6, borderRadius: 3, opacity: .85, backgroundColor: '#333'}}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19, maxWidth: 180, marginTop: 10, marginBottom: 10, textAlign: 'center' }}>Get age, gender, and splits for $1/month</Text>
              <Button style={[styles.button, { zIndex: 11, elevation: 7, backgroundColor: '#ffab40' }]}><Text>Get Premium</Text></Button>
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
