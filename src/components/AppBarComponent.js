import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';


export default class AppBarComponent extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <View style={styles.container}> 
                <Text style={styles.text}>Gumber</Text>            
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(37, 150, 177)',
      alignItems: 'flex-start'
    },

    text: {
        color: 'white',
        fontSize: 20
    }
});