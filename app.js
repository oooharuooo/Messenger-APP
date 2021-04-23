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

/* ******************* */
/* User Register Form */
/* ******************* */

const registerForm = document.querySelector(".userRegisterForm");
registerForm.addEventListener("submit", (e) => {
	const registerEmail = document.querySelector("#registerEmail");
	const registerPassword = document.querySelector("#registerPassword");
	const successMsg = document.querySelector(".successMsg");
	const errorMsg2 = document.querySelector(".errorMsg-2");

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
				registeredMsg(errorMsg2);
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

		// const currentUser = firebase.auth().currentUser;
		// console.log(currentUser.displayName);

		// [START auth_sign-in_password]
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				const newPostKey = firebase.database().ref().child("onlineUser").push()
					.key;
				const { displayName, email } = userCredential.user;
				// db.ref("onlineUser/" + newPostKey).set({ onlineUser: displayName });
				// window.addEventListener("beforeunload", function (e) {
				// 	e.preventDefault();
				// 	console.log("reload");
				// 	db.ref("onlineUser/" + newPostKey).remove();
				// });
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
								${registerName.value || name.user.displayName}
							</span>
						</p>
						<p>${registerName.value ? "Welcome" : "Welcome back"} !!!</p>
					</div>`;
					msgForm.classList.add("displayNone");

					msgContainer.appendChild(welcomeMsgContainer);
					// Remove welcome msg and display msg data
					setTimeout(() => {
						welcomeMsgContainer.remove();
						msgForm.classList.remove("displayNone");
						msgRef.on("child_added", updateMsgs);
					}, 3000);
				};
				// Signed in
				// Remove Welcome Page and display Msg Page
				formPage.remove();
				if (userCredential) {
					// display name register form only if there is no displayName in Database
					if (userCredential.user.displayName === null) {
						const currentUser = firebase.auth().currentUser;
						nameRegisterForm.classList.remove("displayNone");
						nameRegisterForm.addEventListener("submit", (e) => {
							e.preventDefault();
							// Append name to database
							userCredential.user.displayName = registerName.value;
							currentUser.updateProfile({
								displayName: registerName.value,
							});

							// Remove name register form
							nameRegisterForm.remove();
							welcomeBackMsg(registerName);
						});
					} else {
						welcomeBackMsg(userCredential);
					}
				}
				/* ******************* */
				/* Msg Form Display */
				/* ******************* */

				// Send Msg Handler
				msgForm.addEventListener("submit", (e) => {
					e.preventDefault();

					const msgText = document.querySelector("#msg");
					const postId = db.ref("/msgs").push().key;

					//Using Google Realtime Database to store user information
					userInfo = {
						dataName: userCredential.user.displayName,
						dataMsg: msgText.value,
						dataEmail: userCredential.user.email,
					};

					// Push user information to database
					db.ref("msgs/" + postId).set(userInfo);

					// Erase text message
					msgText.value = "";
				});

				// Append and display values from database to the UI
				const updateMsgs = (snapshot) => {
					const { dataName, dataMsg, dataEmail } = snapshot.val();
					const uniqueID = snapshot.key;
					const emailCompare = userCredential.user.email === dataEmail;

					msgContainer.innerHTML += `
			<li id="msg${uniqueID}" class="singleMSG ${
						emailCompare ? "alignmentRight" : "alignmentLeft"
					}">
				<span>${emailCompare ? "" : `${dataName} :`}</span>
				<span>
					${
						emailCompare && dataMsg !== "Message removed"
							? `<button data-id="${uniqueID}"class="removeMsgBtn msgBtn">
									<i class="fas fa-trash"></i>
								</button>`
							: ""
					}
				</span>
				<p>${dataMsg}</p>
			</li>`;
					// Remove msg Btn
					const removeBtn = document.querySelectorAll(".removeMsgBtn");
					removeBtn.forEach((btn) => {
						btn.addEventListener("click", () => {
							const btnID = btn.getAttribute("data-id");

							btn.remove();
							msgRef.child(btnID).set({
								dataName: userCredential.user.displayName,
								dataEmail: userCredential.user.email,
								dataMsg: "Message removed",
							});
						});
					});
					// Update the UI every time msg removed
					msgRef.on("child_changed", (snapshot) => {
						document.getElementById(`msg${snapshot.key}`).innerHTML =
							"Message removed";
					});
					// Auto scroll to bottom
					displayContainer.scrollTop = displayContainer.scrollHeight;
				};

				// Logout
				document.querySelector(".logOutBtn").addEventListener("click", () => {
					const logOutMsgContainer = document.createElement("div");
					logOutMsgContainer.classList.add("fadeInEffect-2", "logOutMsg");
					logOutMsgContainer.innerHTML = `<p>
						Bye,
						<span>${userCredential.user.displayName}</span>
					</p>`;
					msgContainer.remove();
					displayContainer.appendChild(logOutMsgContainer);

					function signOut() {
						// [START auth_sign_out]
						firebase
							.auth()
							.signOut()
							.then(() => {
								setTimeout(() => {
									location.reload();
								}, 2000);
							})
							.catch((error) => {
								// An error happened.
								console.log(error);
							});
						// [END auth_sign_out]
					}
					signOut();
				});
			})
			.catch((error) => {
				// Display incorrect msg
				registeredMsg(errorMsg);
			});
		// [END auth_sign-in_password]
	};
	signInWithEmailPassword();
});
