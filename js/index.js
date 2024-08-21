document.addEventListener("DOMContentLoaded", () => {
	const list = document.getElementById("list");
	const showPanel = document.getElementById("show-panel");
	let currentUserId = 1; // Simulate the logged-in user

	// Fetch books from the API
	function fetchBooks() {
		fetch("http://localhost:3000/books")
			.then((response) => response.json())
			.then((books) => {
				displayBooks(books);
			})
			.catch((error) => console.error("Error fetching books:", error));
	}

	// Display books in the list
	function displayBooks(books) {
		list.innerHTML = "";
		books.forEach((book) => {
			const li = document.createElement("li");
			li.textContent = book.title;
			li.dataset.id = book.id;
			li.addEventListener("click", () => displayBookDetails(book));
			list.appendChild(li);
		});
	}

	// Display book details in the show panel
	function displayBookDetails(book) {
		const usersWhoLiked = book.users
			.map((user) => user.username)
			.join(", ");
		showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.img_url}" alt="${book.title}">
            <p>${book.description}</p>
            <p><strong>Liked by:</strong> ${usersWhoLiked}</p>
            <button id="like-button">${
				isUserLiked(book) ? "Unlike" : "Like"
			}</button>
        `;
		document
			.getElementById("like-button")
			.addEventListener("click", () => toggleLike(book));
	}

	// Check if the current user has liked the book
	function isUserLiked(book) {
		return book.users.some((user) => user.id === currentUserId);
	}

	// Toggle the like status of a book
	function toggleLike(book) {
		const url = `http://localhost:3000/books/${book.id}`;
		let updatedUsers;

		if (isUserLiked(book)) {
			updatedUsers = book.users.filter(
				(user) => user.id !== currentUserId
			);
		} else {
			updatedUsers = [
				...book.users,
				{ id: currentUserId, username: "pouros" },
			]; // Use current user's username
		}

		fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ users: updatedUsers }),
		})
			.then((response) => response.json())
			.then((updatedBook) => {
				// Re-render the details of the updated book
				displayBookDetails(updatedBook);
			})
			.catch((error) => console.error("Error updating book:", error));
	}

	// Initialize the app
	fetchBooks();
});
