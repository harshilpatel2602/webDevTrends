import React, { useState } from 'react';
import { View, TextInput, Text, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set} from 'firebase/database';

export default function App() {
    const [registrationFirstName, setRegistrationFirstName] = useState('');
    const [registrationLastName, setRegistrationLastName] = useState('');
    const [registrationEmail, setRegistrationEmail] = useState('');
    const [registrationPassword, setRegistrationPassword] = useState('');
    const [databaseData, setDatabaseData] = useState('');
    const navigation = useNavigation();

    const registerWithFirebase = async () => {
        if (registrationEmail.length < 4) {
            Alert.alert('Please enter an email address.');
            return;
        }

        if (registrationPassword.length < 4) {
            Alert.alert('Please enter a password.');
            return;
        }

        try {
            // Create a user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                registrationEmail,
                registrationPassword
            );

            // User registered successfully
            Alert.alert('User registered!');

            // Save user information in the Realtime Database
            const userID = userCredential.user.uid;
            const usersRef = ref(db, 'users/' + userID);

            const email = registrationEmail;
            set(usersRef, {
                firstName: registrationFirstName,
                lastName: registrationLastName,
                email: email,
            });

            // Navigate to the "Main" screen
            navigation.navigate('Main');
        } catch (error) {
            if (error.code === 'auth/weak-password') {
                Alert.alert('The password is too weak.');
            } else {
                Alert.alert(error.message);
            }
            console.error(error);
        }
    }

    return (
        <View style={styles.form}>
            <View>
                <View>
                    <Text style={styles.header}>REGISTER WITH NOTES</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setRegistrationFirstName(value)}
                        name='firstName'
                        placeholder="FIRST NAME"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setRegistrationLastName(value)}
                        name='lastName'
                        placeholder="LAST NAME"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setRegistrationEmail(value)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="email"
                        keyboardType="email-address"
                        placeholder="ENTER YOUR EMAIL ID"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setRegistrationPassword(value)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="password"
                        keyboardType="visible-password"
                        placeholder="ENTER YOUR PASSCODE"
                        secureTextEntry={true}
                    />
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} title="Register" color="#0073e6" onPress={registerWithFirebase} />
                        <Button style={styles.button} color="red" title="Cancel" onPress={() => navigation.navigate('Main')} />
                    </View>
                </View>
            </View>
        </View >
    );
}
const styles = StyleSheet.create({
    form: {
        flex: 1,
        margin: 30,
        marginTop: 60,
    },
    header: {
        fontSize: 28,
        textAlign: 'center',
        paddingBottom: 50,
    },
    textInput: {
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 15,
      paddingVertical: 14,
      paddingHorizontal: 2,
      textAlignVertical: 'top',
      fontSize: 17,
      paddingLeft: 5,
      borderRadius: 10, 
  },
    buttonContainer: {
        paddingVertical: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginStart: 33,
    },
    button: {
        width: '40%',
    },
    signOutButton: {
        paddingVertical: 40
    }
});
