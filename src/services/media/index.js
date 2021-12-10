import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { mediaValidation } from "./validation.js"
import { getMedia, writeMedia} from "../../lib/fs-tools.js"


const mediaRouter = express.Router()

// 1 Post method
// req.body 
// {
//     "Title": "The Lord of the Rings: The Fellowship of the Ring",
//     "Year": "2001",
//     "imdbID": "tt0120737",  //UNIQUE
//     "Type": "movie",
//     "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
// }
mediaRouter.post("/", mediaValidation, async (req, res, next) => {
    try {
      const errorsList = validationResult(req)
      if (!errorsList.isEmpty()) {
       
        next(createHttpError(400, "Some Errors occured in the request body", { errorsList }))
      } else {
        
        const newMedia = { ...req.body, createdAt: new Date(), id: uniqid() }
        const mediaList = await getMedia()
  
        mediaList.push(newMedia)
        await writeMedia(mediaList)
        res.status(201).send({ id: newMedia.id })
      }
    } catch (error) {
      next(error)
    }
  })
  
  
  
  // 2. Get method Lists of media
  
  
  
  mediaRouter.get("/",  async (req, res, next) => {
    try {
       const mediaList = await getMedia()
        res.send(mediaList)
      
    } catch (error) {
      next(error)
    }
  })
  
  // 3. Get method
  
  mediaRouter.get("/:mediaId", async (req, res, next) => {
    try {
      const mediaList = await getMedia()
  
      const media = mediaList.find(media => media.id === req.params.mediaId)
      if (media) {
        res.send(media)
      } else {
        next(createHttpError(404, `Media with ID ${req.params.mediaId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  // 4.
  
  mediaRouter.put("/:mediaId", async (req, res, next) => {
    try {
      const mediaList = await getMedia()
  
      const index = mediaList.findIndex(m => m.id === req.params.mediaId)
  
      const mediaToModify = mediaList[index]
      const updatedFields = req.body
  
      const updatedMedia = { ...mediaToModify, ...updatedFields, updatedAt: new Date() }
  
      mediaList[index] = updatedMedia
  
      await writeMedia(mediaList)
  
      res.send(updatedMedia)
    } catch (error) {
      next(error)
    }
  })
  
  // 5. Delete method
  
  mediaRouter.delete("/:mediaId", async (req, res, next) => {
    try {
      const mediaList = await getMedia()
      const remainingMediaList = mediaList.filter(book => book.id !== req.params.mediaId)
      await writeMedia(remainingMediaList)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  })
  
  export default mediaRouter
  


