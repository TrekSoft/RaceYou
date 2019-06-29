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
          <View style={{ marginTop: 40, marginBottom: 20, alignItems: 'center' }}>
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
                <Text numberOfLines={1} style={styles.tableCell}>M</Text>
                <Text numberOfLines={1} style={styles.tableCell}>35</Text>
                <Text numberOfLines={1} style={styles.tableCell}>34:01</Text>
              </View>
            </ScrollView>
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
