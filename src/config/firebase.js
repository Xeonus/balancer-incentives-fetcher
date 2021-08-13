import firebase from 'firebase/app';
import 'firebase/analytics';

//Config
var firebaseConfig = {
    apiKey: "AIzaSyBvvw5_p8_KV4kIi2OJoWkkOZ61HLittaY",
    authDomain: "balancer-incentives.firebaseapp.com",
    projectId: "balancer-incentives",
    storageBucket: "balancer-incentives.appspot.com",
    messagingSenderId: "1020890917589",
    appId: "1:1020890917589:web:db26f4a3a40f544c51d05c",
    measurementId: "G-KYST68GWT0"
  };


//init config
if (typeof window !== 'undefined' && !firebase.apps.length) {
 firebase.initializeApp(firebaseConfig);
 //Start analytics
 firebase.analytics();
}

 export default firebase;