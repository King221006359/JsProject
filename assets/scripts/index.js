const users = [];
const books = [];
const leasedBooks = [];

class User {
    constructor(fullName, gender, status = false) {
        this.id = randomId();
        this.fullName = fullName;
        this.gender = gender;
        this.status = status;
    }
    add() {
        //Add a new user
        users.push(this);
    }
}

class Book {
    constructor(author, name, dailyPrice, status = false) {
        this.id = randomId();
        this.author = author;
        this.name = name;
        this.dailyPrice = dailyPrice;
        this.status = status;
    }
    add() {
        //add a book
        console.log(books, this);
        books.push(this);
    }
    update() {
        // change status using id
        return (this.status = !this.status);
    }
}

class LeasedBooks {
    // Onur
    constructor(book, day, user) {
        this.id = randomId();
        this.book = book.name;
        this.day = day;
        this.user = user.fullName;
        this.totalPrice = book.dailyPrice * day;
    }
    add() {
        leasedBooks.push(this);
    }






    
}
const bookDropdown = document.getElementById("book");
const userDropdown = document.getElementById("user");

function createLeaseABookForm() {
    bookDropdownUpdate()
    // Populate the user dropdown
    userDropdownUpdate()
}

function bookDropdownUpdate() {
    bookDropdown.innerHTML = '<option value="" selected disabled>Select user</option>';
    books.forEach((book) => {
        const option = document.createElement("option");
        option.value = book.name;
        option.text = book.name;
        bookDropdown.appendChild(option);
    });
}

function userDropdownUpdate() {
    userDropdown.innerHTML = '<option value="" selected disabled>Select user</option>';
    users.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.fullName;
        option.text = user.fullName;
        userDropdown.appendChild(option);
    });
}

function addRentABook(event) {
    // create a leasedBook if it's status is false
    // User shouldn't already leased a book
    event.preventDefault();

    const book = books.find((book) => book.name === bookDropdown.value);
    if (!book) {
        toastify("please choose a book", type = "error")
        return console.log(`Book '${bookDropdown.value}' not found`);
    }

    if (book.status) {
        toastify(`'${bookDropdown.value}' on lease`, type = "error");
        return console.log(`Book '${bookDropdown.value}' is already leased`);
    }

    const user = users.find((user) => user.fullName === userDropdown.value);
    if (!user) {
        toastify("please select a user", type = "error");
        return console.log(`User '${userDropdown.value}' not found`);
    }

    if (user.status) {
        toastify(`'${userDropdown.value}' has already rented a book`, type = "error");
        return console.log(`User '${userDropdown.value}' is already leased a book`);
    }

    const day = document.getElementById("day").value;

    if (!day || day < 1) {

        return toastify("Please enter the day", type = "error");
    }

    const leasedBook1 = new LeasedBooks(book, day, user);
    leasedBook1.add();
    console.log(leasedBooks);
    book.status = !book.status;
    user.status = !book.status;
    toastify("Book successfully rented");
    leasedBooksTableWrite();
}

function addUser() {
    //Create a new user
    const userFullName = $("#userFullName").val();
    const useGender = $("input[name^='gender']:checked").val();
    if (!userFullName || !useGender) return toastify("Please do not leave any blank spaces.", "error");

    const user = new User(userFullName, useGender, false);
    user.add();
    toastify("The user has been successfully added.", "success");
    $("#userFullName").val("");
    $("input:radio[name='gender']:checked").each(function (i) {
        this.checked = false;
    });
    usersTableWrite()
    userDropdownUpdate()
}

function addBook() {
    var title = $("#bookTitle").val();
    var author = $("#authorName").val();
    var dailyPrice = $("#dailyPrice").val();

    if (!title || !author || !dailyPrice) return toastify("Please do not leave any blank spaces.", "error");
    const book = new Book(author, title, dailyPrice);

    book.add();
    booksTableWrite();
    bookDropdownUpdate();

    toastify("The book has been successfully added.", "success");
    $("#bookTitle").val("");
    $("#authorName").val("");
    $("#dailyPrice").val("");
}

function usersTableWrite() {
  // Write the data to the table.
    if (users.length == 0) {
        $("#users-table").append(`
        <tr>
            <th scope="row" colspan="4">User not found.</th>
        </tr>
        `);
        return;
    }

    $("#users-table").html("");
    users.map((user, index) => {
        $("#users-table").append(`
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${user.fullName}</td>
            <td>${user.gender[0].toUpperCase() + user.gender.substring(1)}</td>
            <td>${user.status ? "Evet" : "No"}</td>
        </tr>
        `);
    })
}

function booksTableWrite() {
    $("#book_table").html("");
    books.map((book, index) => {
        $("#book_table").append(`
        <tr>
        <th scope="row">${index + 1}</th>
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.dailyPrice}</td>
        <td>${book.rented ? "Evet" : "No"}</td>
        </tr>
        `);
    })
}

function leasedBooksTableWrite() {
    const tableBody = document.getElementById("leasedTable");
    tableBody.innerHTML = "";

    if (leasedBooks.length === 0) {
        const row = document.createElement("tr");
        const messageCell = document.createElement("th");
        messageCell.setAttribute("colspan", "4");
        messageCell.textContent = " No rented book found.";
        row.appendChild(messageCell);
        tableBody.appendChild(row);
    } else {
        leasedBooks.forEach((leasedBook) => {
            const row = document.createElement("tr");

            const bookCell = document.createElement("td");
            bookCell.textContent = leasedBook.book;

            const userCell = document.createElement("td");
            userCell.textContent = leasedBook.user;

            const dayCell = document.createElement("td");
            dayCell.textContent = leasedBook.day;

            const priceCell = document.createElement("td");
            priceCell.textContent = leasedBook.totalPrice;

            row.appendChild(bookCell);
            row.appendChild(userCell);
            row.appendChild(dayCell);
            row.appendChild(priceCell);

            tableBody.appendChild(row);
        });
    }
}

leasedBooksTableWrite();


function randomId() {
    let s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
    );
}

function toastify(message, type = "success") {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: type === "success" ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)",
            borderRadius: "5px",
            fontWeight: "bold",
        }
    }).showToast();
}

function loadPage() {
    const form = document.getElementById("leasedBookForm");
    form.addEventListener("submit", addRentABook);
    createLeaseABookForm();
    pageSection(window.location.href.split("#")[1]);
    $(window).on('hashchange', function (e) {
        pageSection(e.originalEvent.newURL.split("#")[1]);
    });
}

function pageSection(hash) {
    if (hash) {
        sectionToggle("#" + hash);
        const a = document.querySelectorAll("a");

        a.forEach(element => {
            $(element).removeClass("link-secondary")
            if (hash == element.href.split("#")[1]) {
                $(element).addClass("link-secondary")
            }

        });
    } else {
        sectionToggle("#users");
    }
}

function sectionToggle(section) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        $(section).fadeOut(0);
    });
    $(section).fadeIn(500);
}










clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("Rent-book", JSON.stringify(RentABook));
    showTodo()
});

taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.addUser("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");






