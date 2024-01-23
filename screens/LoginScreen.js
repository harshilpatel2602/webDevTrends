import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, firestore, auth } from '../firebaseConfig';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, update, onValue } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BackHandler } from 'react-native';


export default function LoginScreen() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(true);
    const [databaseData, setDatabaseData] = useState('');
    const [userName, setUserName] = useState('');
    const [showVerificationButton, setShowVerificationButton] = useState(false);
    const navigation = useNavigation();
   
    useEffect(() => {
      const backAction = () => {
        navigation.navigate('Main'); // Navigate to the "Main" screen
        return true; // Prevent default back button behavior
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove(); // Clean up the event listener
  
    }, [navigation]);

    const takePicture = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        if (status === 'granted') {
          const photo = await ImagePicker.launchCameraAsync();
          console.log(photo);
        } else {
          console.error('Camera permission not granted');
        }
      };

    const pickImage = async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
          if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync();
    
            if (result.canceled) {
              console.log('Image picking cancelled by the user');
            } else {
              console.log('Image picked successfully:', result);
            }
          } else {
            console.error('Camera roll permission not granted');
          }
        } catch (error) {
          console.error('Error picking image:', error.message);
        }
      };  

      const playAudio = async () => {
        try {
          const { status } = await Audio.requestPermissionsAsync();
          if (status !== 'granted') {
            console.error('Audio permission not granted');
            return;
          }
    
          sound = new Audio.Sound();
          await sound.loadAsync(require('../assets/audio/sound.mp3'));
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.error) {
              console.error('Error during playback:', status.error);
            }
          });
    
          await sound.playAsync();
        } catch (error) {
          console.error('Error playing audio:', error.message);
        }
      };
    
      const pauseAudio = async () => {
        try {
          if (sound) {
            await sound.pauseAsync();
          }
        } catch (error) {
          console.error('Error pausing audio:', error.message);
        }
      };
    useEffect(() => {
        if (loggedIn) {
            // Fetch the user's name from the Realtime Database based on the logged-in user's UID
            var userID = auth.currentUser.uid;
            var userRef = ref(db, 'users/' + userID);

            // Listen for changes in the user's data
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserName(userData.firstName + ' ' + userData.lastName);
                } else {
                    Alert.alert('User data not found in Realtime Database.');
                }
            });

            const user = auth.currentUser;

            // Check if the email is verified and show the verification button if not
            if (!user.emailVerified) {
                setShowVerificationButton(true);
            } else {
                setShowVerificationButton(false);
            }

        } else {
            // Handle the case where the user is not authenticated
            // You can redirect the user to the login screen or take other actions.
            setLoggedIn(false);
        }

    }, [loggedIn]);

    const signoutWithFirebase = () => {
        signOut(auth).then(function () {
            // if logout was successful
            if (!auth.currentUser) {
                Alert.alert('User was logged out!');
                setLoggedIn(false);
                navigation.navigate("Main");
            }
        });
    }

    const sendVerificationEmail = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                Alert.alert('Verification email sent. Please check your inbox.');
            })
            .catch((error) => {
                Alert.alert('Error sending verification email: ' + error.message);
            });
    }

    const saveDataWithFirebase = () => {
        var userID = auth.currentUser.uid;

        // Update the "text" field in Realtime DB if it already exists
        const dbRef = ref(db, 'users/' + userID);

        // Use the update method to modify the "text" field
        update(dbRef, {
            text: databaseData
        })
            .then(() => {
                Alert.alert('Data successfully updated in Realtime Database');
            })
            .catch((error) => {
                Alert.alert('Error updating data in Realtime Database: ' + error.message);
                console.error(error);
            });

        // SAVE TO FIRESTORE
             const userDocRef = doc(firestore, 'users', userID);
             setDoc(userDocRef, {
                 text: databaseData
             }, { merge: true })
                 .then(() => {
                     Alert.alert('Data successfully written to Firestore');
                 })
                 .catch((error) => {
                     Alert.alert('Error writing to Firestore: ' + error.message);
                   console.error(error);
                 });
    }

    const retrieveDataWithFirebase = () => {

        var userID = auth.currentUser.uid;
        const Ref = ref(db, '/users/' + userID);

        // USING REALTIME DB

        onValue(Ref, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data.text) {
                    // Update your component's state with the retrieved text data
                    setDatabaseData(data.text);
                    Alert.alert('Text data retrieved from Realtime Database');
                } else {
                    Alert.alert('No text data found in the database');
                }
            } else {
                Alert.alert('No data found in the Realtime Database');
            }
        });


    }
    return (
        <View style={styles.form}>
            {
                loggedIn &&
                <View>
                    <TextInput
                        style={[styles.textInput, { borderRadius: 11 }]}
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(value) => setDatabaseData(value)}
                        value={databaseData}
                        placeholder="Write something..."
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={playAudio}>
                            <FontAwesome name="music" size={24} color="black" />
                            <Text style={{ marginLeft: 10 }}>Soothing Music</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={pauseAudio}>
                            <FontAwesome name="pause" size={24} color="black" />
                            <Text style={{ marginLeft: 10 }}>Pause</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            <FontAwesome name="camera" size={24} color="black" />
                            <Text style={{ marginLeft: 10 }}>Take Picture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={pickImage}>
                            <FontAwesome name="image" size={24} color="black" />
                            <Text style={{ marginLeft: 10 }}>Pick Image</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} title="Save Data" color="black" onPress={saveDataWithFirebase} />
                        <Button style={styles.button} title="Load Data" color="black" onPress={retrieveDataWithFirebase} />
                    </View>
                    {/* Conditionally show the verification button  */}
                    {showVerificationButton && (
                        <Button style={styles.button} title="Send Verification Email" color="#0073e6" onPress={sendVerificationEmail} />
                    )}
                    <Button style={styles.signOutButton} title="Sign Out" color="#ff471a" onPress={signoutWithFirebase} />
                </View>
            }
        </View >
    )

}

const styles = StyleSheet.create({
    form: {
        flex: 1,
        margin: 30,
        marginTop: 60,
    },
    header: {
        fontSize: 30,
        paddingBottom: 50,
    },
    textInput: {
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 10,
      paddingVertical: 2,
      paddingHorizontal: 2,
      textAlignVertical: 'top',
      fontSize: 17,
      paddingLeft: 5,
  },
    buttonContainer: {
        paddingVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        width: '20%',
        marginBottom: 10,
    },
    signOutButton: {
        paddingVertical: 40,
        marginTop: 10,
    }
});