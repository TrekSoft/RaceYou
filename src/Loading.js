import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Container,
  Content,
  Button,
  Text,
  Icon,
  Input,
  Item,
  ListItem,
  Left,
  Right,
  Radio,
  Picker
} from 'native-base';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { showErrorToast } from './utils/ErrorToast';
import * as styles from './styles';
import * as actions from './actions';

const months = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Loading extends Component {
  static navigationOptions = {
      header: null
  }

  state = {
    isLoading: true,
    isSubmitting: false,
    username: '',
    gender: null,
    birthMonth: null,
    birthYear: null
  };

  componentDidMount() {
    firebase.auth().signInAnonymously()
    .then((response) => {
      const user = response.user._user;
      this.props.loadUser(user.uid)
      .then((user) => {
        if(user.username) {
          this.props.navigation.navigate('Home');
        } else {
          this.setState({isLoading: false});
        }
      })
      .catch(() => this.setState({isLoading: false}) );
    })
    .catch(() => showErrorToast('Must have internet connection'));
  }

  onUsernameChange = (username) => {
    this.setState({ username });
  }

  onUsernameSubmit = () => {
    if(this.state.username && this.state.birthMonth && !this.state.birthYear.equals("Year")) {
      this.setState({isSubmitting: true});

      this.props.setUsername(this.props.user, this.state.username)
      .then(() => this.props.navigation.navigate('Home'));
    } else {
      showErrorToast('Oops, missing some info from you');
    }
  }

  renderSubmitButton = () => {
    if (this.state.isSubmitting) {
      return (
        <Button style={styles.buttonDisabled} disabled>
          <Text>Submitting</Text>
        </Button>
      )
    } else {
      return (
        <Button style={styles.button} onPress={this.onUsernameSubmit}>
          <Text>Submit</Text>
        </Button>
      );
    }
  }

  renderMonths = () => {
    return months.map((month, id) => {
      return <Picker.Item label={month} key={"month" + id} value={id+1} />;
    });
  }

  renderYears = () => {
    const today = new Date();
    const year = today.getFullYear();
    let years = ['Year'];

    for(let i = year; i>=year-120; i--) {
      years.push(i + '');
    }

    return years.map((year, id) =>
      <Picker.Item label={year} key={"year" + id} value={year} />
    );
  }

  renderForm() {
    if (this.state.isLoading) {
      return (<Text style={styles.whiteText}>Loading...</Text>);
    } else {
      return (
        <View style={{ width: 250, alignItems: 'center', flexDirection: 'column' }}>
          <Item style={{ width: '100%', borderColor: 'transparent', marginBottom: 5 }}>
            <Input
              style={{backgroundColor: '#fff', paddingLeft: 10, marginBottom: 15, marginTop: 25, borderRadius:5}}
              placeholder='Pick a username'
              value={this.state.username}
              onChangeText={this.onUsernameChange}
            />
          </Item>

          <View style={{ width: '100%', flexDirection: 'row', marginBottom: 15 }}>
            <TouchableOpacity style={{flex:1, flexDirection: 'row', alignItems: 'center', marginLeft: 10}} onPress={() => this.setState({ gender: 'm' })}>
              <Radio selectedColor="white" style={{ marginRight: 10 }} selected={this.state.gender && this.state.gender === 'm'}/>
              <Text style={styles.whiteText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{flex:1, flexDirection: 'row', alignItems: 'center'}}  onPress={() => this.setState({ gender: 'f' })}>
              <Radio selectedColor="white" style={{ marginRight: 10 }} selected={this.state.gender && this.state.gender === 'f'} />
              <Text style={styles.whiteText}>Female</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', marginBottom: 25 }}>
            <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 5, marginRight: 2 }}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: '100%' }}
                placeholder="Birth Month"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.birthMonth}
                onValueChange={(val) => this.setState({ birthMonth: val })}
              >
                {this.renderMonths()}
              </Picker>
            </View>

            <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 5, marginLeft: 2 }}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ flex: 1 }}
                placeholder="Birth Year"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.birthYear}
                onValueChange={(val) => this.setState({ birthYear: val })}
              >
                {this.renderYears()}
              </Picker>
            </View>
          </View>

          {this.renderSubmitButton()}
        </View>
      );
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalCenter]}>
          <Text style={styles.logo}>RaceYou</Text>
          { this.renderForm() }
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => (
  {
    user: state.user
  }
);

export default connect(mapStateToProps, actions)(Loading);
