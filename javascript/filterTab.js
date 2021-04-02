const filterTab = document.querySelector(".filterTab").children;
const filterForm = document.querySelector(".filterForm").children;

for (let i = 0; i < filterTab.length; i++) {
	filterTab[i].onclick = function () {
		for (let j = 0; j < filterTab.length; j++) {
			filterTab[j].classList.remove("activeFilter");
		}
		this.classList.add("activeFilter");
		const displayItems = this.getAttribute("data-filter");

		for (let z = 0; z < filterForm.length; z++) {
			filterForm[z].style.display = "none";

			if (filterForm[z].getAttribute("data-category") === displayItems) {
				filterForm[z].style.display = "block";
			}
		}
	};
}
