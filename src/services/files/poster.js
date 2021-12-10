import express from 'express'
import multer from 'multer'
import createHttpError from 'http-errors'
import { getMedia, writeMedia, saveMediaPoster } from "../../lib/fs-tools.js"



const posterRouter = express.Router({ mergeParams: true })

const uploader = multer({
    fileFilter: (req, file, multerNext) => {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/gif" && file.mimetype !== "image/png") {
            multerNext(createHttpError(400, "File type not supported: please try with a jpeg, gif or png."))
        } else if (file.size > 3000000) {
            multerNext(createHttpError(400, "The image is too large: please upload an image under 3MB."))
        } else {
            multerNext(null, true)
        }
    }
}).single("mediaPoster")

posterRouter.post("/uploadSingle", uploader, async (req, res, next) => {
   
    try {
      console.log("FILE: ", req.file)
      await saveMediaPoster (req.file.originalname, req.file.buffer)
     
      res.send("OK")
    } catch (error) {
      next(error)
    }
  })

  export default posterRouter