import firebase from "firebase";
// import firestore from 'firebase/firestore'

// const setting = { timestampsInSnapshots: true };

const firebaseConfig = {
    apiKey: "AIzaSyCExgReHcucDT6vWhXeAmLubsOvOD_iRL0",
    authDomain: "mmc-chat-dev.firebaseapp.com",
    projectId: "mmc-chat-dev",
    storageBucket: "mmc-chat-dev.appspot.com",
    messagingSenderId: "637831201742",
    appId: "1:637831201742:web:0b928e84406b64a2dc619f",
    databaseUrl: "https://mmc-chat-dev-default-rtdb.firebaseio.com/"
};


firebase.initializeApp(firebaseConfig)
// firebase.firestore().settings(setting);

export default firebase;