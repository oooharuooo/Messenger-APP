/* ********** */
// Main Script //
/* ********** */

const msgBtn = document.querySelector(".msgBtn");
const submitForm = document.querySelector(".form");
const userSubmitForm = document.querySelector(".userSubmitForm");
const usernameInput = document.querySelector(".userInput");
const msgContainer = document.querySelector(".msgContainer");
const msgPage = document.querySelector(".msgPage");
const welcomePage = document.querySelector(".welcomePage");

// Username submit form

/* userSubmitForm.addEventListener("submit", (e) => {
	e.preventDefault();
	console.log("fdfd");
	userRef.on("child_added", (data) => {
			userRef.push(usernameInput.value);
		// 	msgPage.classList.remove("displayNone");
		// 	welcomePage.remove();
		// if (usernameInput.value === data.val()) {
		// 	userRef.push(usernameInput.value);
		// 	msgPage.classList.remove("displayNone");
		// 	welcomePage.remove();
		// }
	});
	// if (usernameInput.value !== "") {
	// 	userRef.push(usernameInput.value)
	// 	msgPage.classList.remove("displayNone");
	// 	welcomePage.remove();
	// }
});
 */

userSubmitForm.addEventListener("submit", (e) => {
	e.preventDefault();
	userRef.push(usernameInput.value);
	msgPage.classList.remove("displayNone");
	welcomePage.remove();
});



// Msg Submit Form
submitForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const msgText = document.querySelector("input[type=text]");
	// Push msg text to database and insure message is not empty
	const userInfo = {
		username: usernameInput.value,
		msg: msgText.value,
	};
	msgRef.push(userInfo);

	// Erase text message
	msgText.value = "";
});

// Append and display values from database to the UI
const updateMsgs = (data) => {
	const { username, msg } = data.val();
	
	if (usernameInput.value === username) {
		console.log("matched");
	}
	msgContainer.innerHTML += `<li class="singleMSG">
	<p>
	${msg}
	</p>
	</li>`; //add the <li> message to the chat window
};

msgRef.on("child_added", updateMsgs);
