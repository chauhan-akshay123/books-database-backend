let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Initialize sqlite database connection
(async () => {
  db = await open({
    filename: "./Backend/books_database.sqlite",
    driver: sqlite3.Database,
  });
  console.log("Database connected.");
})();

// Function to fetch all books
async function fetchAllBooks(){
  let query = "SELECT * FROM books";
  let response = await db.all(query, []);
  return { books: response };
}

// Route to get all books
app.get("/books", async (req, res)=> {
  let results = await fetchAllBooks();
  res.status(200).json(results);
});

// Function to fetch books by author
async function fetchBooksByAuthor(author) {
  let query = "SELECT * FROM books WHERE author = ?";
  let response = await db.all(query, [author]); 
  return { books: response };
}

// Route to fetch books by author
app.get("/books/author/:author", async (req, res) => {
  let author = req.params.author;
  let results = await fetchBooksByAuthor(author);

  res.status(200).json(results);
});

// function to fetch books by genre
async function fetchBooksByGenre(genre){
  let query = "SELECT * FROM books WHERE genre = ?";
  let response = await db.all(query, [genre]);
  return { books: response };
}

//Route to fetch books by genre
app.get("/books/genre/:genre", async (req, res)=>{
 let genre = req.params.genre;
 let results = await fetchBooksByGenre(genre);

 res.status(200).json(results);
});

// function to fetch books by publication year
async function fetchBooksByYear(year){
  let query = "SELECT * FROM books WHERE publication_year = ?";
  let response = await db.all(query, [year]);
  return { books: response };
}

// Route to fetch books by publication year
app.get("/books/publication_year/:year", async (req, res)=>{
 let year = req.params.year;
 let results = await fetchBooksByYear(year);

 res.status(200).json(results);
}); 

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
