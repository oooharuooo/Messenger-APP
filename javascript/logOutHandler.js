const logOutHandler = (displayName, registerName, newPostKey) => {
	document.querySelector(".logOutBtn").addEventListener("click", () => {
		const nameRegisterForm = document.querySelector(".nameRegisterForm");
		const msgContainer = document.querySelector(".msgContainer");
		const displayContainer = document.querySelector(".displayContainer");
		const logOutMsgContainer = document.createElement("div");
		logOutMsgContainer.classList.add("fadeInEffect-2", "logOutMsg");
		logOutMsgContainer.innerHTML = `<p>
						Bye,
						<span>${registerName.value || displayName}</span>
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
						db.ref("onlineUser/" + newPostKey).remove();
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
};

export default logOutHandler;
