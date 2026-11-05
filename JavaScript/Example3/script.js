// Various DOM elements
const bookmarkName = document.getElementById("bookmark-name");
const bookmarkUrl = document.getElementById("bookmark-url");
const addBookmarkBtn = document.getElementById("add-bookmark");
const bookmarkList = document.getElementById("bookmark-list");

// Load saved bookmarks
document.addEventListener("DOMContentLoaded", loadBookmarks);
addBookmarkBtn.addEventListener("click", () => {
    const name = bookmarkName.value.trim();
    const url = bookmarkUrl.value.trim();

    console.log("hi");

    // Input validation
    if (!name || !url) {
        alert("Please enter both bookmark name and url");
        return;
    } else {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            alert("Please enter valid bookmark url");
            return;
        }
    }

    addBookmarkButton(name, url);
    saveBookmark(name, url);

    bookmarkName.value = "";
    bookmarkUrl.value = "";
});

function addBookmarkButton(name, url) {
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = url;
    link.textContent = name;
    link.target = "_blank";
}

function getBookmarksFromStorage() {
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
}

function saveBookmark(name, url) {
    const bookmarks = getBookmarksFromStorage();
    bookmarks.push(name, url);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    const listItem = document.createElement("li");
    listItem.innerHTML = name + " : " + url;

    bookmarkList.appendChild(listItem);
}

function loadBookmarks() {
    const bookmarks = getBookmarksFromStorage();
    bookmarks.forEach((bookmark) => {
        addBookmarkButton(bookmark.name, bookmark.url);
    });
}

function removeBookmarkFromStorage(name, url) {
    let bookmarks = getBookmarksFromStorage();
    bookmarks = bookmarks.filter(
        (bookmark) => bookmark.name !== name || bookmark.url !== url,
    );

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
