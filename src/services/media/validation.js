import { body } from "express-validator"

export const mediaValidation = [
  body("Title").exists().withMessage("Title is a mandatory field!"),
  body("Year").exists().withMessage("year is a mandatory field!"),
  body("Type").exists().withMessage("type of a movie is a mandatory field!"),
]


// {
//     "Title": "The Lord of the Rings: The Fellowship of the Ring",
//     "Year": "2001",
//     "imdbID": "tt0120737",  //UNIQUE
//     "Type": "movie",
//     "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
// }