/* ********** */
// Main Script //
/* ********** */

const msgBtn = document.querySelector(".msgBtn");
const msgForm = document.querySelector(".msgForm");
const msgContainer = document.querySelector(".msgContainer");
const displayContainer = document.querySelector(".displayContainer");

const errorMsg = document.querySelector(".errorMsg");
const logInEmail = document.querySelector("#logInEmail");
const logInPassword = document.querySelector("#logInPassword");
const registerName = document.querySelector("#registerName");

const msgPage = document.querySelector(".msgPage");
const welcomePage = document.querySelector(".welcomePage");

let userInfo = {};
let dataName;

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

// display register successful or fail msg function
const registeredMsg = (msg) => {
	msg.classList.remove("displayNone");
	setTimeout(() => {
		msg.classList.add("displayNone");
	}, 3000);
};

/* ******************* */
/* User Login Form */
/* ******************* */
const userLogInForm = document.querySelector(".userLogInForm");
userLogInForm.addEventListener("submit", (e) => {
	const formPage = document.querySelector(".formPage");
	const nameRegisterForm = document.querySelector(".nameRegisterForm");

	e.preventDefault();

	const signInWithEmailPassword = (user) => {
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
				if (userCredential) {
					// display name register form only if there is no displayName in Database
					if (userCredential.user.displayName === null) {
						nameRegisterForm.classList.remove("displayNone");
						nameRegisterForm.addEventListener("submit", (e) => {
							e.preventDefault();
							// Append name to database
							userCredential.user.displayName = registerName.value;
							// dataName = { dataName: registerName.value };
							// userInfo = { ...dataName };

							// Remove name register form
							nameRegisterForm.remove();
							welcomeBackMsg(registerName);
						});
					} else {
						welcomeBackMsg(userCredential);
					}
				}
			})
			.catch((error) => {
				// Display incorrect msg
				registeredMsg(errorMsg);
			});
		// [END auth_sign-in_password]

		// Display welcome back msg if user already registered
		const welcomeBackMsg = (name) => {
			// Remove Welcome Page
			welcomePage.remove();
			msgPage.classList.remove("displayNone");

			// Display Welcome Msg
			const welcomeMsgContainer = document.createElement("li");

			welcomeMsgContainer.classList.add("welcomeMsgContainer");
			welcomeMsgContainer.innerHTML = `
					<div class="leftToRightEffect">
						<p>Hello,
							<span>
								${name.user.displayName || registerName.value}
							</span>
						</p>
						<p>${name.user.displayName ? "Welcome back" : "Welcome"} !!!</p>
					</div>`;
			msgForm.classList.add("displayNone");

			msgContainer.appendChild(welcomeMsgContainer);
			// Remove welcome msg and display msg data
			setTimeout(() => {
				welcomeMsgContainer.remove();
				msgForm.classList.remove("displayNone");
				msgRef.on("child_added", updateMsgs);
				// msgRef.on("child_changed", removeMsgs);
			}, 3000);
		};
	};
	signInWithEmailPassword();
});

/* ******************* */
/* Msg Form Display */
/* ******************* */

msgForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const msgText = document.querySelector("#msg");
	const { displayName, email } = firebase.auth().currentUser;
	const postId = db.ref("/msgs").push().key;
	// const uniqueID = () => {
	// 	return "_" + Math.random().toString(36).substr(2, 9);
	// };

	//Using Google Realtime Database to store user information
	userInfo = {
		// ...dataName,
		uniqueID: postId,
		dataName: displayName,
		dataMsg: msgText.value,
		dataEmail: email,
	};

	// Push user information to database
	db.ref("msgs/" + postId).set(userInfo);

	// Erase text message
	msgText.value = "";
});

// Append and display values from database to the UI
const updateMsgs = (snapshot) => {
	const { dataName, dataMsg, dataEmail, uniqueID } = snapshot.val();
	const { email } = firebase.auth().currentUser;

	msgContainer.innerHTML += `
			<li id="msg${uniqueID}" class="singleMSG ${
		email === dataEmail ? "alignmentRight" : "alignmentLeft"
	}">
				<span>${
					email === dataEmail
						? `<button data-id="${uniqueID}"class="removeMsgBtn"><i class="fas fa-trash"></i></button>`
						: `${dataName} :`
				}</span>
				<p>${dataMsg}</p>

		</li>`;
	const removeBtn = Array.from(document.querySelectorAll(".removeMsgBtn"));
	removeBtn.map((btn) => {
		btn.addEventListener("click", () => {
			const btnID = btn.getAttribute("data-id");

			msgRef.on("child_removed", (snapshot) => {
				document.getElementById(`msg${snapshot.key}`).innerHTML =
					"Message has been removed";
				console.log(snapshot);
			});
			msgRef.child(btnID).remove();
			// msgRef.child(btnID).set({
			// 	dataName,
			// 	dataEmail,
			// 	dataMsg: "Message removed",
			// });
		});
	});
	// data.forEach((snapshot) => {
	// 	console.log(snapshot.val());
	// 	console.log(snapshot.key);

	// });

	// Auto scroll to bottom
	displayContainer.scrollTop = displayContainer.scrollHeight;
};

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		var uid = user.uid;
		console.log(user.displayName);
		// ...
	} else {
		// User is signed out
		// ...
	}
});

document.querySelector(".logOut").addEventListener("click", () => {
	function signOut() {
		// [START auth_sign_out]
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
			})
			.catch((error) => {
				// An error happened.
			});
		// [END auth_sign_out]
	}
	signOut();
});
function signOut() {
	// [START auth_sign_out]
	firebase
		.auth()
		.signOut()
		.then(() => {
			// Sign-out successful.
		})
		.catch((error) => {
			// An error happened.
		});
	// [END auth_sign_out]
}
// document.addEventListener("DOMContentLoaded", signOut);
