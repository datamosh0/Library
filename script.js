const storage = window.localStorage;

class Book {
  constructor(title, author, read) {
    this.title = title;
    this.author = author;
    this.read = read;
  }
}

class Library {
  constructor() {
    this.i = 0;
    this.books = [];
  }

  addBook(value) {
    this.books[this.i] = new Book(...value);
    let data = this.books[this.i];

    if (storage.getItem("booksInStorage") === null) {
      storage.setItem("booksInStorage", []);
    }

    let books = JSON.parse(storage.getItem("booksInStorage"));
    books.push(data);
    storage.setItem("booksInStorage", JSON.stringify(books));
    this.i++;
  }
}
let library = new Library();

let refreshButtons = () => {
  let readBtn = document.querySelectorAll(".read");
  let removeBtn = document.querySelectorAll(".remove__btn");
  let books = JSON.parse(storage.getItem("booksInStorage"));

  for (
    let i = 0;
    i < JSON.parse(storage.getItem("booksInStorage")).length;
    i++
  ) {
    readBtn[i].addEventListener("click", function (e) {
      let bookId = e.target.parentElement.id;
      if (bookId === books[i].title) {
        if (books[i].read === false) books[i].read = true;
        else if (books[i].read === true) books[i].read = false;
      }
      storage.setItem("booksInStorage", JSON.stringify(books));

      if (e.target.classList.contains("read__btn")) {
        e.target.classList.remove("read__btn");
        e.target.classList.add("not__read__btn");
        e.target.textContent = "Not Read";
      } else {
        e.target.classList.add("read__btn");
        e.target.classList.remove("not__read__btn");
        e.target.textContent = "Read";
      }
    });

    removeBtn[i].addEventListener("click", function (e) {
      if (!e.target.classList.contains("remove")) {
        e.target.textContent = "Really Remove?";
        e.target.classList.add("remove");
      } else {
        e.target.parentElement.remove();
        let bookId = e.target.parentElement.id;
        for (
          let i = 0;
          i < JSON.parse(storage.getItem("booksInStorage")).length;
          i++
        ) {
          if (bookId === books[i].title) {
            books.splice(i, 1);
            break;
          }
        }
        storage.setItem("booksInStorage", JSON.stringify(books));
      }
    });
  }
};

const content = document.querySelector(".content");
let render = () => {
  content.innerHTML = "";
  for (
    let i = 0;
    i < JSON.parse(storage.getItem("booksInStorage")).length;
    i++
  ) {
    let book = JSON.parse(storage.getItem("booksInStorage"))[i];
    let read = book.read;
    if (read === true) {
      content.insertAdjacentHTML(
        "beforeend",
        `<div class="book" id="${book.title}">
      <div class="title">"${book.title}"</div>
      <div class="author">${book.author}</div>
      <button class="read__btn read">Read</button>
      <button class="remove__btn">Remove</button>
    </div>`
      );
    } else if (read === false) {
      content.insertAdjacentHTML(
        "beforeend",
        `<div class="book" id="${book.title}">
      <div class="title">"${book.title}"</div>
      <div class="author">${book.author}</div>
      <button class="not__read__btn read">Not Read</button>
      <button class="remove__btn">Remove</button>
    </div>`
      );
    }
  }
  refreshButtons();
};

render();

//Modal Stuff

const add = document.querySelector(".add__book");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close__btn");
add.addEventListener("click", function () {
  modal.classList.remove("modal__hidden");
});
close.addEventListener("click", function (e) {
  e.target.parentElement.parentElement.classList.add("modal__hidden");
  title.value = "";
  author.value = "";
  checkbox.checked = false;
});

const form = document.querySelector(".modal__content");

let title = document.getElementById("title");
let author = document.getElementById("author");
let checkbox = document.getElementById("isRead");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let item = [title.value, author.value, checkbox.checked];
  library.addBook(item);
  modal.classList.add("modal__hidden");

  title.value = "";
  author.value = "";
  checkbox.checked = false;

  render();
});
