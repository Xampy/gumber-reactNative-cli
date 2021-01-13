import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableHighlight} from 'react-native';
import AppBarComponent from './components/AppBarComponent';
import {
    AdMobBanner
} from 'react-native-admob';


const testID = 'ca-app-pub-3940256099942544/6300978111';
const productionID = 'ca-app-pub-6525278703893250/8253186500';

const adUnitId = !__DEV__ ? productionID : testID;

export default class GumberGame extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displayerText: "",
            remainingText: 100,
            timerText: 30,
            winstate: "none",
            keyboardData: [],
            containerStyle: styles.container,

            //Hiding
            notiDisplayStyle: styles.hide,
            menuDisplayStyle: styles.show,
            gameDisplayStyle: styles.hide,
            settDisplayStyle: styles.hide,
            helpDisplayStyle: styles.hide,
        }

        this.eventHandling = false;
        this.stringEval = "";

        this.disabledKeys = [];

        this.data = []

        this.numberMin = 10
        this.numberMax = 100
        this.timer = 60

        //this.counter();

    }

    //Init the game here
    //on click of new game
    intiNewGame = () => {

        //Inititate the goal
        var inte;
        if( this.rand(0, 1, true)){
            inte = true
        }else {
            inte = false
        }

        this.goalFrom = this.roundFixedTwo(
             this.rand(
                this.numberMin,
                this.numberMax,
                true
            )
        )

        this.setState({
            remainingText: this.goalFrom,
            timerText: this.timer
        })
        this.disabledKeys = []
        //Set the keyboard
        this.getData();

        //Begin the counter
        this.counter();
    }

    //Init the level of the game
    setLevel = (level) => {
        if(level == 'b'){
            this.numberMax = 100
            this.numberMin = 10

            this.timer = 60 // 1 min

            //console.log("Level set to beginner")
        }else if(level == 'm'){
            this.numberMax = 1000
            this.numberMin = 100

            this.timer = 45
            //console.log("Level set to Medium")
        }else if(level == 'h'){
            this.numberMax = 1000
            this.numberMin = 10000

            this.timer = 30
            //console.log("Level set to Hight")
        }
    }

    /* ************  Vue Function ************************  */
    //Toggle the display of the menu
    toggleMenuDisplay = () => {
        let d = this.state.menuDisplayStyle
        if(d == styles.hide ){
            this.setState({
                menuDisplayStyle: styles.show
            })
        }else {
            this.setState({
                menuDisplayStyle: styles.hide
            })
        }
    }

    toggleGameDisplay = () => {
        let d = this.state.gameDisplayStyle
        if(d == styles.hide ){
            this.setState({
                gameDisplayStyle: styles.show
            })
        }else {
            this.setState({
                gameDisplayStyle: styles.hide
            })
        }
    }

    toggleHelpDisplay = () => {
        let d = this.state.helpDisplayStyle
        if(d == styles.hide ){
            this.setState({
                helpDisplayStyle: styles.show
            })
        }else {
            this.setState({
                helpDisplayStyle: styles.hide
            })
        }
    }

    toggleSettingsDisplay = () => {
        let d = this.state.settDisplayStyle
        if(d == styles.hide ){
            this.setState({
                settDisplayStyle: styles.show
            })
        }else {
            this.setState({
                settDisplayStyle: styles.hide
            })
        }
    }

    toggleNotificationDisplay = () => {
        let d = this.state.notiDisplayStyle
        if(d == styles.hide ){
            this.setState({
                
                notiDisplayStyle: styles.show
            })
        }else {
            this.setState({
                notiDisplayStyle: styles.hide
            })
        }
    }

    /* ************************************  */

    //The counter down
    counter = () => {
        this.f = setInterval(
            () => {
                let pr = this.state.timerText;
                if(pr - 1 >= 0){
                    this.setState({timerText: pr - 1});
                }else{
                    clearInterval(this.f);
                    this.toggleGameDisplay()

                    //change the background
                    this.setState({
                        winstate: "Time is Out",
                        containerStyle: styles.darkContainer
                    })
                    this.toggleNotificationDisplay()
                }
            },
            1000
        );
    }
    //Change displayer Text
    keyPressed = (value, disabled) => {
        //console.log('Value ' + value + " is " + disabled)
        if(disabled == false){
            let v = this.state.displayerText;

            switch (value) {
                case "OK":
                    //console.log("Start Resolving string ...");
                    //We evaluate the string
                    this.getEvaluatedString();
                    if(this.result >= 0){
                        this.changeRemaining(this.result);
                    }
                    break;
                case "del":
                    //Deleting the last elment
                    if(this.state.displayerText.length > 0){
                        //update string
                        this.stringEval = v.substr(0, v.length - 1);

                        //update the view
                        this.setState({
                            displayerText: this.stringEval,
                        });
                    }
                    //console.log("Deleting last element from the string ...");
                    break;
                case "x":
                    //update the string
                    this.stringEval = v + "x";
                    //console.log("The new string: " + this.stringEval);
                    this.setState({
                        displayerText: this.stringEval,
                    });
                    //console.log("Adding new Value x to string ...");
                    break;
                default:
                    //Only update the value by adding
                    this.stringEval = v + value;
                    this.setState({
                        displayerText: this.stringEval,
                    });
                    //console.log("Adding new Value to string ...");
                    break;
            }
        }

    }

    //Change the goal
    changeRemaining = (substract) => {
        let pv = this.state.remainingText;
        let r = pv - substract;

        //Be sure that the number will not exceed
        //the current value
        if(r >= 0){
            //Set the string to a new 
            this.stringEval = "";
            this.setState({
                remainingText: r,
                displayerText: this.stringEval,
            });
            //When remainning reach 0
            //the user win
            if(r == 0){
                //Stop the counter
                if(this.f){
                    clearInterval(this.f);
                }

                this.setState({
                    winstate: "You Win"
                })

                this.toggleGameDisplay()

                    //change the background
                this.setState({
                    containerStyle: styles.darkContainer
                })
                this.toggleNotificationDisplay()
            }
        }else {

        }
    }

  //Controller on the string
  controlString = () => {
      //The rule is that we have to find
      //at least one operator in the user
      //string
      let operators = ["+", "-", "/", "*"];
      let verified = false;

      for (let i = 0; i < operators.length && verified==false; i++) {
          let index = this.stringEval.indexOf(operators[i])

          //We got an index greater than 0
          //then the string contain at least one operator
          if(index > 0){
              verified = true;
          }
          
      }
      return verified;
  }
    //Evaluate string from user
    getEvaluatedString = () => {
        this.result = 0;
        this.stringEval = this.stringEval.replace('x', "*");
        //console.log('The string being controlled : ' + this.stringEval);
        if(this.controlString() == true){
            //console.log('Correct string by the controller...');
            try {
                this.result = eval(this.stringEval);    
            } catch (error) {
                //console.log(error)
            }
        }else {
            //console.log('Error from the string controller...');
        }
        //console.log('Te result gotten : ' + this.result)
        return this.roundFixedTwo(this.result);
    }

    //This function is used to desactivate some
    //keys
    desactivateKeys = () => {
        //Shuffles keys and select only
        //the firsts
        var ids = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        var tmp = ids[0];
        var j;
        for (let i = 0; i < ids.length; i++) {
            tmp = ids[i];
            j = this.rand(0, ids.length, true); //an integer

            ids.splice(i, 1, ids[j])
            ids.splice(j, 1, tmp)          
        }

        //Choosing random first four 
        var no = this.rand(3, 5, true)
        //console.log("Number to hide " + no);
        for (let i = 0; i < no; i++) {
            this.disabledKeys.push(ids[i]);
        }

        //console.log("Value of the array", this.disabledKeys);
    }

    rand = (_min, _max, integer) => {
        if(!integer) {
            return Math.random() * (_max - _min) + _min;
        }else {
            return Math.floor(Math.random() * (_max - _min) + _min);
        }
    }

    roundFixedTwo = (n) => {
        return (Math.round(n * 100))/100
    }
  /****************************************************** */ 
  //Get the key board data
  getData = () => { 
      //Set disabled buttons 
      this.desactivateKeys();
      var data = [];

      //want to construct 20 data
      var values = ["(", ")", " ", "del",
                    "1", "2", "3", "+",
                    "4", "5", "6", "-",
                    "7", "8", "9", "x",
                    "0", ".", "OK", "/"];
        for (let i = 0; i < values.length; i++) {
            let el = {};
            el['key'] = values[i];

            //Check if the element is disabled
            if(this.disabledKeys.includes(values[i]) ){
                el['style'] = styles.keyDisabled;
                el['disabled'] = true;
            }else {
                el['style'] = styles.key ;
                el["disabled"] = false;
            }

            data.push(el);
            
        }
        this.setState({keyboardData: data})
  }
  

    //A function for changing the text displayed 
    //On the surface
  render() {
      return (
        <View style={this.state.containerStyle}> 

            <View style={this.state.notiDisplayStyle}>
                <View style={styles.notification}>
                    <View style={styles.centerView}>
                        <Text style={styles.notiText}>{this.state.winstate}</Text>

                        <TouchableHighlight style={styles.helpTouch} >
                                <View style={styles.VHtext}>
                                    <Text onPress = {
                                        () => {
                                            this.toggleNotificationDisplay()

                                             //crestablish the background
                                            this.setState({
                                                containerStyle: styles.container
                                            })
                                            this.toggleMenuDisplay() 
                                        } 
                                    } style={styles.htext} >Back</Text>
                                </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>

            <View style={this.state.settDisplayStyle}>
                <View style={styles.centerView}>
                    <Text style={styles.helpTitle}>Settings</Text>
                    <Text style={ 
                        {
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 20
                        } 
                            }>Level</Text>

                    <TouchableHighlight style={styles.settingTouch} >
                            <View style={styles.VStext}>
                                <Text onPress = {
                                    () => {
                                        this.setLevel('b')
                                        this.toggleSettingsDisplay()
                                        this.toggleMenuDisplay() 
                                    } 
                                } style={styles.stext} >Beginner</Text>
                            </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.settingTouch} >
                            <View style={styles.VStext}>
                                <Text onPress = {
                                    () => {
                                        this.setLevel('m')
                                        this.toggleSettingsDisplay()
                                        this.toggleMenuDisplay() 
                                    } 
                                } style={styles.stext} >Medium</Text>
                            </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.settingTouch} >
                            <View style={styles.VStext}>
                                <Text onPress = {
                                    () => {
                                        this.setLevel('h')
                                        this.toggleSettingsDisplay()
                                        this.toggleMenuDisplay() 
                                    } 
                                } style={styles.stext} >Hight</Text>
                            </View>
                    </TouchableHighlight>
                </View>
                
            </View>

            <View style={this.state.helpDisplayStyle}>
                <View style={styles.centerView}>
                    <Text style={styles.helpTitle}>Help</Text>
                    <Text style={styles.helpText}>We need reach 0 to win the game.</Text>

                    <Text style={styles.helpText}>Important: all expressions must contain an operator.</Text>

                    <TouchableHighlight style={styles.helpTouch} >
                            <View style={styles.VHtext}>
                                <Text onPress = {
                                    () => {
                                        this.toggleHelpDisplay()
                                        this.toggleMenuDisplay() 
                                    } 
                                } style={styles.htext} >Back</Text>
                            </View>
                    </TouchableHighlight>
                </View>
            </View>




            <View style={styles.menu}>
                <View style={this.state.menuDisplayStyle}>
                    <Text style={styles.appName}>Gumber</Text>

                    <TouchableHighlight >
                        <View style={styles.Vtext}>
                            <Text onPress = {
                                 () => {
                                    this.intiNewGame()
                                    this.toggleMenuDisplay() 
                                    this.toggleGameDisplay()

                                  
                                 } 
                            } style={styles.mtext} >New Game</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight >
                        <View style={styles.Vtext}>
                            <Text onPress = { 
                                () => {
                                    this.toggleMenuDisplay()
                                    this.toggleSettingsDisplay()
                                }
                            } 
                            style={styles.mtext} >Settings</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.touchMB} >
                        <View style={styles.Vtext}>
                            <Text onPress = { () => {
                                this.toggleMenuDisplay()
                                this.toggleHelpDisplay()
                            }} style={styles.mtext} >Help</Text>
                        </View>
                    </TouchableHighlight>
                    
                    <View style={{ marginTop: 10 }}></View>

                    
                    <AdMobBanner
                        adSize="largeBanner"
                        adUnitID={ adUnitId } // Test ID, Replace with your-admob-unit-id
                        testDevices={[AdMobBanner.simulatorId]}
                        onAppEvent={event => console.log(event.name, event.info)}
                        onAdFailedToLoad={error => console.error(error)} />
                   

                    <Text style={styles.about}>Developped by Xam</Text>
                </View>
            </View>

            
            <View style={this.state.gameDisplayStyle}>
            <AppBarComponent></AppBarComponent>
                <View style={styles.shadow}>
                    
                    <View style={styles.remainningContainer}>
                        <Text style={styles.remain}>
                        Remaining :    
                        <Text style={styles.goal}>{this.state.remainingText}</Text>
                        </Text> 
                    </View>

                    <View style={styles.displayerContainer}>
                        <Text style={styles.displayerText}> { this.state.displayerText } </Text> 
                    </View>
                    
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{ this.state.timerText } s</Text> 
                    </View>

                    
                    <View style={styles.keyboardContainer}>          
                        <FlatList style={styles.board}
                        numColumns={4}
                        data={ this.state.keyboardData }
                        renderItem = { 
                            ( { item } ) => (
                                <TouchableHighlight onPress={ () => this.keyPressed(item.key, item.disabled) }>
                                    <View style={styles.keyV}> 
                                        <Text style={item.style}>{ item.key }</Text> 
                                    </View>
                                </TouchableHighlight>
                            )
                        }
                        />
                    </View>
                </View>
            </View>
        </View>
      );
  }
}




























const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2596b1',
      alignItems: 'center',
      marginTop: 20,
      flexDirection: 'column'
    },

    darkContainer: {
        flex: 1,
        backgroundColor: 'rgb(19, 75, 89)',
        alignItems: 'center'
    },


    remainningContainer: {
        backgroundColor: 'rgb(37, 150, 177)'
        
      },
    
    remain: {
        fontSize: 15,
        color: 'white',
        marginLeft: 10,
        marginTop: 10,
        textAlign: 'center'
      },
  
    goal: {
        fontSize: 30,
        marginLeft: 10
      },

    displayerContainer: {
        backgroundColor: 'white',
        width: 300,
        marginTop: 20,
        height: 150,
        borderRadius: 10,
        margin: 'auto',
        marginLeft: 20
      },
    
    displayerText: {
        fontSize: 30,
        color: 'rgb(37, 150, 177)',
        marginLeft: 10,
        
      },

    timerContainer: {
        marginTop: 20,
        borderRadius: 10,
      },
    
    timerText: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center' 
      },



      
    keyboardContainer: {
        backgroundColor: 'rgb(37, 150, 177)',
        marginTop: 60,
      },

    keyV: {
        width: 80,
        height: 60,
        borderRadius: 5,
        margin: 2,
        borderWidth: 1,
        borderColor: 'rgb(17, 140, 167)'
      },
  
    key: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
        borderRadius: 5,
        borderWidth: 0,
        borderColor: 'rgb(17, 140, 167)'
      },
    
    keyDisabled: {
        display: "none",
      },



    touchMB: {
        borderRadius: 10,
      },
    
    Vtext: {
        backgroundColor: 'white',
        paddingBottom: 5,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        marginTop: 20,
      },
    
    mtext: {
        fontSize: 35,
        color: 'rgb(37, 150, 177)',
        width: '100%',
        textAlign: 'center',
      },
    
    appName: {
        fontSize: 50,
        color: 'white',
        marginTop: 150,
        textAlign: 'center'
      },
    
    about: {
        color: 'white',
        marginTop: 50,
        textAlign: 'center'
      },

    //Menu Help
    helpTitle: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        width: 300, 
        marginTop: 190,
        marginBottom: 10
    },

    helpText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'justify',
        width: 300,
    },

    VHtext: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 10,
        marginTop: 20,
        width: 150
    },

    htext: {
        fontSize: 20,
        color: 'rgb(37, 150, 177)',
        width: 150,
        textAlign: 'center',
    },

    //Menu settings
   
    VStext: {
        backgroundColor: 'white',
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10,
        width: 150,
        marginTop: 10
    },
    stext: {
        fontSize: 20,
        color: 'rgb(37, 150, 177)',
        width: 150,
        textAlign: 'center',
    },

    //Notification
    notification: {
        width: 300,
        height: 300,
        backgroundColor: 'rgb(37, 150, 177)',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 250
    },

    notificationText: {
        width: 250,
        textAlign: 'center',
        padding: 50
    },

    notiText: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        width: 300,
    },

    
    hide: {
        display: 'none'
    },

    show: {
        display: 'flex'
    },

    shadow: {
        
    },

    centerView: {
        display: 'flex',
        alignItems: 'center'
    }
});
  