// console.log('Booklist app using oops');

//Book class
class Books {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class
class UI {
  static bookList() {
    const books = Store.getBook(); 
    books.forEach((book) => { UI.addBookList(book) })
  }

  // Add book in UI
  static addBookList(book) {
    let tableRow = document.createElement('tr');
    tableRow.className = 'text-capitalize';
    tableRow.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>
        <a href="#FIXME" title="Delete" class="btn btn-danger btn-sm delete">&times;</a>
      </td>
    `;
    let tableBody = document.querySelector('#table-body');
    tableBody.appendChild(tableRow);
  }

  // Ui validates
  static vaidate(msg, alertClass) {
    let div = document.createElement('div');
    div.className = `alert alert-${alertClass}`;
    div.appendChild(document.createTextNode(`${msg}`));
    let container = document.querySelector('.container');
    let form = document.querySelector('#bookListForm');
    container.insertBefore(div, form);

    // clear the message after 3 sec.
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  // Clear input fields
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  // remove book
  static deleteBook(element) {
    if (element.classList.contains('delete')) {
      element.parentElement.parentElement.remove();
    }
  }
}

//Store class in localstorage
class Store {

  // stroed in localstorage
  static getBook() {
    let bookObj;
    let bookList = localStorage.getItem('booklist');
    if (bookList == null) {
      bookObj = [];
    } else {
      bookObj = JSON.parse(bookList);
    }
    return bookObj;
  }

  // Add book in localstorage
  static addBook(book) {
    const bookObj = Store.getBook();
    bookObj.push(book);
    localStorage.setItem('booklist', JSON.stringify(bookObj));
  }

  // Delete book from localstorage
  static removeBook(isbn) {
    const bookObj = Store.getBook();
    bookObj.forEach((book, index) => {
      if (book.isbn === isbn) {
        bookObj.splice(index, 1);
      }
    });
    localStorage.setItem('booklist', JSON.stringify(bookObj));
  }
}

//Event: Display book
document.addEventListener('DOMContentLoaded', UI.bookList);

//Evnet: Add book
document.querySelector('#bookListForm').addEventListener('submit', (e) => {

  // Prevent Default to submit
  e.preventDefault();

  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  const book = new Books(title, author, isbn);

  // Validate 
  if (title == '' || author == '' || isbn == '') {

    // Add error class in validate
    UI.vaidate('Please fill all fields', 'danger');
  } else {
    // Add book to UI
    UI.addBookList(book);

    // Clear input fields
    UI.clearFields();

    // Add book in localstorage
    Store.addBook(book);

    //show success msg to add book
    UI.vaidate('Book Added', 'success');
  }
})

// Event: Delete book
document.querySelector('#table-body').addEventListener('click', (e) => {

  // Delete from UI
  UI.deleteBook(e.target);
  UI.vaidate('Book Deleted', 'success');

  // Delete book form localstorage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})
