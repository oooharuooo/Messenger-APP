import { registeredMsg } from "./javascript/showRegisterMsg.js";
import logOutHandler from "./javascript/logOutHandler.js";

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

const onlineUserContainer = document.querySelector(".onlineUserContainer");
const onlineUserBtn = document.querySelector(".onlineUserBtn");
const onlineUserDetails = document.querySelector(".onlineUserDetails");
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
				let { displayName, email: displayEmail } = userCredential.user;
				const newPostKey = firebase.database().ref().child("onlineUser").push()
					.key;

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
						showOnlineUser();
						msgRef.on("child_added", updateMsgs);
					}, 3000);
				};
				// Signed in
				// Remove Welcome Page and display Msg Page
				formPage.remove();

				// display name register form only if there is no displayName in Database
				if (displayName === null) {
					const currentUser = firebase.auth().currentUser;
					nameRegisterForm.classList.remove("displayNone");
					nameRegisterForm.addEventListener("submit", (e) => {
						e.preventDefault();
						// Append name to database
						displayName = registerName.value;
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

				// Show Online User
				const showOnlineUser = () => {
					db.ref("onlineUser/" + newPostKey).set({ onlineUser: displayName });

					const addOnlineUser = (snapshot) => {
						const { onlineUser: currentOnlineName } = snapshot.val();
						const currentOnlineID = snapshot.key;
						onlineUserDetails.innerHTML += `<p id="${currentOnlineID}">${currentOnlineName}</p>`;

						db.ref("/onlineUser").on("child_removed", (snapshot) => {
							const deleteID = snapshot.key;
							const deletedUser = document.querySelector(`#${deleteID}`);
							deletedUser && deletedUser.remove();
						});
					};
					db.ref("/onlineUser").on("child_added", addOnlineUser);

					window.addEventListener("beforeunload", function (e) {
						e.preventDefault();
						db.ref("onlineUser/" + newPostKey).remove();
					});

					onlineUserBtn.addEventListener("click", (e) => {
						onlineUserContainer.classList.remove("displayNone");
					});
				};
				// END Show Online User

				/* ******************* */
				/* Msg Form Display */
				/* ******************* */

				// Send Msg Handler
				msgForm.addEventListener("submit", (e) => {
					e.preventDefault();

					const msgText = document.querySelector("#msg");
					//Using Google Realtime Database to store user information
					const userInfo = {
						dataName: displayName,
						dataMsg: msgText.value,
						dataEmail: displayEmail,
					};
					// Push user information to database
					msgRef.push(userInfo);
					// Erase text message
					msgText.value = "";
				});

				// Append and display values from database to the UI
				const updateMsgs = (snapshot) => {
					const { dataName, dataMsg, dataEmail } = snapshot.val();
					const msgID = snapshot.key;
					const emailCompare = displayEmail === dataEmail;

					msgContainer.innerHTML += `
			<li id="msg${msgID}" class="singleMSG ${
						emailCompare ? "alignmentRight" : "alignmentLeft"
					}">
				<span>${emailCompare ? "" : `${dataName} :`}</span>
				<span>
					${
						emailCompare && dataMsg !== "Message removed"
							? `<button data-id="${msgID}"class="removeMsgBtn msgBtn">
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
								dataName: displayName,
								dataEmail: displayEmail,
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

				logOutHandler(displayName, newPostKey);
				// Logout
				// document.querySelector(".logOutBtn").addEventListener("click", () => {
				// 	const logOutMsgContainer = document.createElement("div");
				// 	logOutMsgContainer.classList.add("fadeInEffect-2", "logOutMsg");
				// 	logOutMsgContainer.innerHTML = `<p>
				// 		Bye,
				// 		<span>${displayName}</span>
				// 	</p>`;
				// 	msgContainer.remove();
				// 	displayContainer.appendChild(logOutMsgContainer);

				// 	function signOut() {
				// 		// [START auth_sign_out]
				// 		firebase
				// 			.auth()
				// 			.signOut()
				// 			.then(() => {
				// 				setTimeout(() => {
				// 					db.ref("onlineUser/" + newPostKey).remove();
				// 					location.reload();
				// 				}, 2000);
				// 			})
				// 			.catch((error) => {
				// 				// An error happened.
				// 				console.log(error);
				// 			});
				// 		// [END auth_sign_out]
				// 	}
				// 	signOut();
				// });
			})
			.catch((error) => {
				// Display incorrect msg
				registeredMsg(errorMsg);
			});
		// [END auth_sign-in_password]
	};
	signInWithEmailPassword();
});
