const sendMsgHandler = (displayName, displayEmail) => {
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
};

export default sendMsgHandler;
