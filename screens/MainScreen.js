import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';


export default function App() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigation = useNavigation();

    const loginWithFirebase = () => {
        if (loginEmail.length < 4) {
            Alert.alert('Please enter an email address.');
            return;
        }

        if (loginPassword.length < 4) {
            Alert.alert('Please enter a password.');
            return;
        }

        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then(function (_firebaseUser) {
                Alert.alert('User logged in!');
                setLoggedIn(true);
                setLoginEmail('');
                setLoginPassword('');
                navigation.navigate("LoginScreen");
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode === 'auth/wrong-password') {
                    Alert.alert('Wrong password.');
                }
                else {
                    Alert.alert(errorMessage);
                }
            }
            );

    }

    return (
        <View style={styles.form}>
            {!loggedIn &&
                <View>
                    <Text style={styles.header}>Secret Notes</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setLoginEmail(value)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="email"
                        keyboardType="email-address"
                        placeholder="Enter your email-id"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setLoginPassword(value)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="password"
                        keyboardType="default"
                        placeholder="Enter your passcode"
                        secureTextEntry={true}
                    />
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} title="Register with Us" color='#ff471a' onPress={() => navigation.navigate('RegisterScreen')} />
                        <Button style={styles.button} title="Login" color='#0073e6' onPress={loginWithFirebase} />
                    </View>
                </View>
            }
        </View >
    );
}

const styles = StyleSheet.create({
    form: {
        flex: 1,
        margin: 40,
        marginTop: 110,
    },
    header: {
        fontSize: 40,
        paddingBottom: 20,
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 10, // Adding borderRadius to give curved corners
        fontSize: 17,
      },
    buttonContainer: {
        paddingVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        width: '40%',
    },
    signOutButton: {
        paddingVertical: 40
    }
});

