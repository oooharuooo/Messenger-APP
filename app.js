// Setup Firebase database
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
//to store data in the msgs folder by creating a reference in database
const msgRef = db.ref("/msgs");


// Main Script
const msgBtn = document.querySelector(".msgBtn");
const submitForm = document.querySelector(".form");
const msgContainer = document.querySelector(".msgContainer");

submitForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const msgText = document.querySelector("input[type=text]");
	// Push msg text to database
	msgRef.push(msgText.value);
	// Erase text message
	msgText.value = "";
});

// Append and display values from database to the UI
const updateMsgs = (data) => {
	console.log(data.node_.value_)
	msgContainer.innerHTML += `<li>${data.val()}</li>`; //add the <li> message to the chat window
};

msgRef.on("child_added", updateMsgs);
