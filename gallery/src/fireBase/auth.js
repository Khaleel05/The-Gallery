//import Home from "../pages/Home";
import { auth } from "./firebase"; 

import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword } from "firebase/auth";

//Creating a new user 
export const doCreateUserWithEmailAndPassword = async(email, password) =>{
    return createUserWithEmailAndPassword(auth, email, password)
};

//Signing in a existing user
export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async() => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    //as an extra step you could save the users information in fire storage using the 'result.user' and save it there
    return result;
};

//Signing out the user
export const doSignOut = () => {
    return auth.signOut();
};

//reset password function
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

//change password function
export const doPasswordChange = (email) => {
    return updatePassword(auth, email);
}; 

//send email verificaiton email
// export const sendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: '${window.location.origin}/Home',
//     });
// };