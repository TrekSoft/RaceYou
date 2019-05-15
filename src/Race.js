import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import * as styles from './styles';
import * as actions from './actions';

class Race extends Component {
  static navigationOptions = {
      title: 'Live Race'
  }

  state = {

  }

  componentWillMount() {
    this.event = this.props.events[this.props.navigation.getParam('eventId')];
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.pageLight, styles.verticalTop, {paddingHorizontal: 0}]}>
          <View style={styles.raceHeader}>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>.3</Text>
              <Text style={styles.raceHeaderSubtext}>miles</Text>
            </View>
            <View style={styles.raceHeaderDivider}></View>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>1:34</Text>
              <Text style={styles.raceHeaderSubtext}>runtime</Text>
            </View>
            <View style={styles.raceHeaderDivider}></View>
            <View style={styles.raceHeaderSection}>
              <Text style={styles.raceHeaderText}>3rd</Text>
              <Text style={styles.raceHeaderSubtext}>/ 46</Text>
            </View>
          </View>
          <View style={{flex: 1, width: '100%', flexDirection: 'column'}}>
            <View style={{flex:1, width:'100%', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{height: 5, width: '100%', backgroundColor: 'grey', justifyContent: 'center'}}>
                <View style={{ paddingLeft: '0%', flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{height: 20, width: 20, borderRadius: 45, marginRight: 10, backgroundColor:'black'}}></View>
                  <View style={{padding: 5, borderRadius: 5, backgroundColor: 'white'}}>
                    <Text style={{fontWeight: "bold"}}>Elfindel</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{flex:1, width:'100%', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{height: 5, width: '100%', backgroundColor: 'grey'}}></View>
            </View>
            <View style={{flex:1, width:'100%', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{height: 5, width: '100%', backgroundColor: 'grey'}}></View>
            </View>
            <View style={{flex:1, width:'100%', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{height: 5, width: '100%', backgroundColor: 'grey'}}></View>
            </View>
            <View style={{flex:1, width:'100%', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{height: 5, width: '100%', backgroundColor: 'grey'}}></View>
            </View>
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

export default connect(mapStateToProps, actions)(Race);
