/* ********** */
// Setup Firebase database //
/* ********** */

const firebaseConfig = {
	apiKey: "AIzaSyDceC_32Jv-63KrXsH4Fxc4NTp_uauwPW8",
	authDomain: "messenger-app-e2961.firebaseapp.com",
	projectId: "messenger-app-e2961",
	storageBucket: "messenger-app-e2961.appspot.com",
	messagingSenderId: "424845842346",
	appId: "1:424845842346:web:547d8cd6468ab150e0bdd3",
	measurementId: "G-45C1MGDJ5B",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.database();
//msg Database
const msgRef = db.ref("/msgs");
const userRef = db.ref("/users");
