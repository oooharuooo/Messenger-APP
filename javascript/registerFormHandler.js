import { registeredMsg } from "./showRegisterMsg.js";

const registerFormHandler = () => {
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
};

export default registerFormHandler;
