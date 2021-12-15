import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const config = {
    apiKey: "AIzaSyB3oFoYasFl834Gc7tLgrae6PWqlfSTmFI",
    authDomain: "matjstyper.firebaseapp.com",
    projectId: "matjstyper",
    storageBucket: "matjstyper.appspot.com",
    messagingSenderId: "761292342",
    appId: "1:761292342:web:f1ec7c6c67a9734de35a97",
    measurementId: "G-V0R4N035FE"
}

const app = initializeApp(config);

const db = getFirestore()

export { db } 