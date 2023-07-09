import firebase from "firebase/compat/app"
import "firebase/compat/storage"
import "firebase/compat/firestore"

export const app = firebase.initializeApp({
    "projectId": "fir-storage-inventario",
    "appId": "1:350497294170:web:7cc39a7828ff7df8ba9563",
    "storageBucket": "fir-storage-inventario.appspot.com",
    "locationId": "us-central",
    "apiKey": "AIzaSyDmv_O-oPCuW3hZjmTXc33gDmLhw4xV5VE",
    "authDomain": "fir-storage-inventario.firebaseapp.com",
    "messagingSenderId": "350497294170"
  });