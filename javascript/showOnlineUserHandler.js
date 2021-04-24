const showOnlineUserHandler = (displayName, newPostKey) => {
	const onlineUserContainer = document.querySelector(".onlineUserContainer");
	const onlineUserBtn = document.querySelector(".onlineUserBtn");
	const onlineUserDetails = document.querySelector(".onlineUserDetails");
	const onlineNumber = document.querySelector(".onlineNumber");
	const closeUserBtn = document.querySelector(".closeUserBtn");

	db.ref("onlineUser/" + newPostKey).set({ onlineUser: displayName });

	const addOnlineUser = (snapshot) => {
		const { onlineUser: currentOnlineName } = snapshot.val();
		const currentOnlineID = snapshot.key;
		const compareID = currentOnlineID === newPostKey;

		onlineNumber.textContent = `Current online: ${
			onlineUserDetails.childElementCount + 1
		}`;
		onlineUserDetails.innerHTML += `<p id="${currentOnlineID}" class="${compareID && "meOnline"}">
			${compareID ? "You" : currentOnlineName}
		</p>`;

		db.ref("/onlineUser").on("child_removed", (snapshot) => {
			const deleteID = snapshot.key;
			const deletedUser = document.querySelector(`#${deleteID}`);
			deletedUser && deletedUser.remove();
		});
	};
	db.ref("/onlineUser").on("child_added", addOnlineUser);

	// logout user if page refreshed or tab closed
	window.addEventListener("beforeunload", function (e) {
		e.preventDefault();
		db.ref("onlineUser/" + newPostKey).remove();
	});

	onlineUserBtn.addEventListener("click", (e) => {
		onlineUserContainer.classList.remove("displayNone");
	});
	closeUserBtn.addEventListener("click", (e) => {
		onlineUserContainer.classList.add("displayNone");
	});
};

export default showOnlineUserHandler;
