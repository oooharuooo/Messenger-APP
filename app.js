/* ********** */
// Main Script //
/* ********** */

const msgBtn = document.querySelector(".msgBtn");
const msgForm = document.querySelector(".msgForm");
const msgContainer = document.querySelector(".msgContainer");
const msgPage = document.querySelector(".msgPage");
const errorMsg = document.querySelector(".errorMsg");
const registerName = document.querySelector("#registerName");
const welcomePage = document.querySelector(".welcomePage");

/* ******************* */
/* User Register Form */
/* ******************* */

const registerForm = document.querySelector(".userRegisterForm");
registerForm.addEventListener("submit", (e) => {
	const registerEmail = document.querySelector("#registerEmail");
	const registerPassword = document.querySelector("#registerPassword");
	const successMsg = document.querySelector(".successMsg");

	e.preventDefault();

	const signUpWithEmailPassword = (e) => {
		const email = registerEmail.value;
		const password = registerPassword.value;

		// [START auth_signup_password]
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Display msg when user successful registered

				registeredMsg(successMsg);
			})
			.catch((error) => {
				// Display error when email is already registered
				registeredMsg(errorMsg);
			});
		// [END auth_sign-in_password]
	};

	signUpWithEmailPassword();

	// Erase value input
	registerForm.reset();
});

// const user = firebase.auth().currentUser;
// user.updateProfile({
// 	displayName: registerName.value,
// });
// console.log(user);
// firebase.auth().onAuthStateChanged((user) => {
// 	if (user) {
// 		// User is signed in, see docs for a list of available properties
// 		// https://firebase.google.com/docs/reference/js/firebase.User
// 		var uid = user.uid;
// 		var displayName = user.displayName;
// 		console.log(user);
// 		// ...
// 	} else {
// 		// User is signed out
// 		// ...
// 	}
// });
/* *********** */
/* Login Form */
/* ********** */

const userLogInForm = document.querySelector(".userLogInForm");
userLogInForm.addEventListener("submit", (e) => {
	const logInEmail = document.querySelector("#logInEmail");
	const logInPassword = document.querySelector("#logInPassword");

	const formPage = document.querySelector(".formPage");
	const nameRegisterForm = document.querySelector(".nameRegisterForm");

	e.preventDefault();

	const signInWithEmailPassword = () => {
		const email = logInEmail.value;
		const password = logInPassword.value;
		// [START auth_sign-in_password]
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				// Remove Welcome Page and display Msg Page
				formPage.remove();

				// display name register form only if there is no displayName in Database
				const user = firebase.auth().currentUser;
				if (user.displayName === null) {
					nameRegisterForm.classList.remove("displayNone");
					nameRegisterForm.addEventListener("submit", (e) => {
						e.preventDefault();
						user.updateProfile({
							displayName: registerName.value,
						});
						// Remove name register form
						nameRegisterForm.remove();
						// Display msg page
						msgPage.classList.remove("displayNone");
					});
				} else {
					msgPage.classList.remove("displayNone");
				}

				console.log(user, user.displayName);
			})
			.catch((error) => {
				// Display incorrect msg
				registeredMsg(errorMsg);
			});
		// [END auth_sign-in_password]
	};
	signInWithEmailPassword();
});

// display success or fail msg function
const registeredMsg = (msg) => {
	msg.classList.remove("displayNone");
	setTimeout(() => {
		msg.classList.add("displayNone");
	}, 3000);
};

/* ******************* */
/* Msg Form Display */
/* ******************* */

msgForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const msgText = document.querySelector("input[type=text]");
	// Push msg text to database and insure message is not empty
	msgRef.push(msgText.value);

	// Erase text message
	msgText.value = "";
});

// Append and display values from database to the UI
const updateMsgs = (data) => {
	const { username, msg } = data.val();
	msgContainer.innerHTML += `<li class="singleMSG ${
		logInUsername.value === username ? "alignmentRight" : "alignmentLeft"
	}">
	<p>${msg}</p></li>`;
	if (logInUsername.value === username) {
		msgContainer.innerHTML += `<button>delete</button>`; //add the <li> message to the chat window
	}
};
msgRef.on("child_added", updateMsgs);
