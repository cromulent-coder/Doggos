/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableHighlight, Image, FlatList} from 'react-native';
import {AsyncStorage} from 'react-native';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const STORAGE_KEY = 'DOGS';

type Props = {};
export default class App extends Component<Props> {
	
	constructor(props) {
		super(props)
		this.dogList = []
		this.state = { count: 0,
						uri: 'https://dog.ceo/api/breeds/image/random',
						status:'success',
						message:'https:\/\/images.dog.ceo\/breeds\/retriever-golden\/n02099601_1028.jpg',
						arrayHolder: []}
	}	
	
	componentDidMount() {
		this.getDogsFromApi();
		this.load();
	}
 
	
	onPositive = () => {
		this.save(this.state.message, (new Date).getTime());
	}
	
	onNegative = () => {
		this.getDogsFromApi();
	}
	
	load = async () => {
    try {
      const dogs = await AsyncStorage.getItem(STORAGE_KEY)

      if (dogs !== null) {
        this.dogList = JSON.parse(dogs);
		this.setState({ arrayHolder: [...this.dogList] })
      }
    } catch (e) {
      console.error('Failed to load name.')
    }
  }

  save = async (name, t) => {
    try {
		this.dogList.push({message:name,time:(new Date(t)).toString()});
		this.setState({ arrayHolder: [...this.dogList] })
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.dogList))
	  this.getDogsFromApi();
    } catch (e) {
      console.error('Failed to save name.')
    }
  }
	
	getDogsFromApi() {
		return fetch('https://dog.ceo/api/breeds/image/random')
		.then((response) => response.json())
		.then((responseJson) => {
			  this.setState({
				message: responseJson.message
				});
		  return responseJson.message;
		})
		.catch((error) => {
		  console.error(error);
		});
	}
	
	renderItem = ({item}) => {
    return (
	  <View style={styles.boxContainer}>
		<Image
		style={{width: 50, height: 50}}
		source={{uri: item.message}}
		/>
		<Text style={styles.row}>
			{item.time}
		</Text>
	  </View>
    )
  }
  
  _listEmptyComponent = () => {
    return (
        <View>
            // any activity indicator or error component
        </View>
    )
}

	
	render() {
	return (
	  <View style={styles.container}>
		<Image
          style={{width: 300, height: 300}}
          source={{uri : this.state.message}}
        />
		
		<View style={styles.boxContainer}>
		
			<TouchableHighlight
			 style={styles.button}
			 onPress={this.onPositive}>
			 
				<Image
				  style={{width: 50, height: 50}}
				  source={{uri: 'https://pluspng.com/img-png/png-tick-png-file-tick-mark-icon-png-6619-png-480.png'}}
				/>
			 
			</TouchableHighlight>
			
			<TouchableHighlight
			 style={styles.button}
			 onPress={this.onNegative}>
			 
				<Image
				  style={{width: 50, height: 50}}
				  source={{uri: 'https://image.flaticon.com/icons/png/512/53/53804.png'}}
				/>
			 
			</TouchableHighlight>
		
		</View>
		
		<FlatList
			style={styles.listContainer}
			data={this.state.arrayHolder}
			renderItem={this.renderItem}
			keyExtractor={(item, index) => index.toString()}
		/>
		
	  </View>
	);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  boxContainer: {
    flex: 1,
	flexDirection: 'row',
	justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  listContainer: {
    marginTop: 20,
    flex: 1,
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'skyblue',
  },
});
