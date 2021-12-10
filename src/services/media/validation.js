import { body } from "express-validator"

export const mediaValidation = [
  body("Title").exists().withMessage("Title is a mandatory field!"),
  body("Year").exists().withMessage("year is a mandatory field!"),
  body("Type").exists().withMessage("type of a movie is a mandatory field!"),
]

export const reviewValidation = [
    body("comment").exists().withMessage("leave your comment to our movie!"),
    body("rate").isNumeric({min:1, max: 5}).withMessage("do not forget to rate!"),
  ]


// {
//     "Title": "The Lord of the Rings: The Fellowship of the Ring",
//     "Year": "2001",
//     "imdbID": "tt0120737",  //UNIQUE
//     "Type": "movie",
//     "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
// }