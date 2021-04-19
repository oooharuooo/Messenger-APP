/* ********** */
// Main Script //
/* ********** */

const msgBtn = document.querySelector(".msgBtn");
const msgForm = document.querySelector(".msgForm");
const msgContainer = document.querySelector(".msgContainer");

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

	// display register successful or fail msg function
	const registeredMsg = (msg) => {
		msg.classList.remove("displayNone");
		setTimeout(() => {
			msg.classList.add("displayNone");
		}, 3000);
	};

	signUpWithEmailPassword();

	// Erase value input
	registerForm.reset();
});

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
		const userData = firebase.auth().currentUser;

		// [START auth_sign-in_password]
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				// Remove Welcome Page and display Msg Page
				formPage.remove();

				// display name register form only if there is no displayName in Database
				if (userData.displayName === null) {
					nameRegisterForm.classList.remove("displayNone");
					nameRegisterForm.addEventListener("submit", (e) => {
						e.preventDefault();
						// Append name to database
						userData.updateProfile({
							displayName: registerName.value,
						});
						dataName = { dataName: registerName.value };
						userInfo = { ...dataName };

						// Remove name register form
<<<<<<< HEAD
						nameRegisterForm.remove();
						welcomeBackMsg(registerName);
=======
						welcomePage.remove();

						// Display msg page
						msgPage.classList.remove("displayNone");
						msgRef.on("child_added", updateMsgs);
>>>>>>> parent of 83c0f41 (Project completed (code clean-up needed))
					});
				} else {
					welcomeBackMsg(userData);
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
						<p>Hello, <span>${name.displayName || registerName.value}</span></p>
						<p>${name.displayName ? "Welcome back" : "Welcome"} !!!</p>
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
<<<<<<< HEAD
	const postId = db.ref("/msgs").push().key;
	// const uniqueID = () => {
	// 	return "_" + Math.random().toString(36).substr(2, 9);
	// };

	//Using Google Realtime Database to store user information
	userInfo = {
		...dataName,
		uniqueID: postId,
=======
	
	// 
	const userInfo = {
>>>>>>> parent of 83c0f41 (Project completed (code clean-up needed))
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
<<<<<<< HEAD
const updateMsgs = (snapshot) => {
	const { dataName, dataMsg, dataEmail, uniqueID } = snapshot.val();
	const { email } = firebase.auth().currentUser;

	msgContainer.innerHTML += `
			<li class="singleMSG ${
				email === dataEmail ? "alignmentRight" : "alignmentLeft"
			}">
				<span>${
					email === dataEmail ? "" : `${dataName} :`
					// ? `<button class="removeMsgBtn"><i class="fas fa-trash"></i></button>`
					// : `${dataName} :`
				}</span>
				<p>${dataMsg}</p>

		</li>`;
	// const removeBtn = Array.from(document.querySelectorAll(".removeMsgBtn"));
	// removeBtn.map((btn) => {
	// 	btn.addEventListener("click", () => {
	// 		console.log(uniqueID);

	// db.ref("msgs/" + uniqueID).set({
	// 	dataName,
	// 	dataEmail,
	// 	uniqueID,
	// 	dataMsg: "dat",
	// });
	// 	});
	// });
	// data.forEach((snapshot) => {
	// 	console.log(snapshot.val());
	// 	console.log(snapshot.key);

	// });

	// Auto scroll to bottom
	displayContainer.scrollTop = displayContainer.scrollHeight;
};

// document.querySelectorAll(".removeMsgBtn").forEach((btn) => {
// 	const singleMSG = document.querySelector(".singleMSG");
// 	const updates = { dataMsg: "datzcvgf" };
// 	// msgRef.on("child_changed", function (snapshot) {
// 	// 	console.log(snapshot.val(), "child_changed");
// 	// });
// 	btn.addEventListener("click", (e) => {
// 		// msgRef.child(snapshot.key).update(updates);
// 		// msgRef.on("child_added", updateMsgs);
// 		// msgRef.child("-MYUl4u3ZmVo7Q0kQMtK").set(
// 		// 	{
// 		// 		// dataName: dataName,
// 		// 		dataMsg: "msgTextz123z",
// 		// 		// dataEmail: dataEmail,
// 		// 	}
// 		// 	// 	msgRef.on("child_added", function (snapshot) {
// 		// 	// 		console.log(snapshot);
// 		// 	// 	})
// 		// 	// );
// 		// 	// console.log(data.key);
// 		// );
// 		console.log("working");
// 		// console.log(snapshot.key);
// 	});
// });
=======
const updateMsgs = (data) => {
	const { dataName, dataMsg, dataEmail } = data.val();
	const { email } = firebase.auth().currentUser;

	msgContainer.innerHTML += `<li class="singleMSG ${
		email === dataEmail ? "alignmentRight" : "alignmentLeft"
	}">
					<span>${dataName}</span>
					<p>${dataMsg}</p></li>`;
	// if (logInEmail.value === email) {
	// 	msgContainer.innerHTML += `<button>delete</button>`; //add the <li> message to the chat window
	// }
	displayContainer.scrollTop = displayContainer.scrollHeight;
};
// msgRef.on("child_added", updateMsgs);

// document.getQuerySelector(
// 	".displayContainer"
// ).scrollTop = document.getQuerySelector(".displayContainer").scrollHeight;

const displayContainer = document.querySelector(".displayContainer");
>>>>>>> parent of 83c0f41 (Project completed (code clean-up needed))
