import express from 'express'
import multer from 'multer'
import createHttpError from 'http-errors'
import { getMedia, writeMedia, saveMediaPoster } from "../../lib/fs-tools.js"
// import path from "path"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"




const posterRouter = express.Router({ mergeParams: true })

const uploader = multer({
    fileFilter: (req, file, multerNext) => {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/gif" && file.mimetype !== "image/png") {
            multerNext(createHttpError(400, "File type not supported: please try with a jpeg, gif or png."))
        } else if (file.size > 3000000) {
            multerNext(createHttpError(400, "The image is too large."))
        } else {
            multerNext(null, true)
        }
    }
}).single("mediaPoster")

// const cloudinaryStorage = new CloudinaryStorage({
//     cloudinary,
//     params:{
//     folder:"medias"
//     }
// })

// const uploadOnCloudinary = multer({ storage: cloudinaryStorage}).single("mediaCover")


posterRouter.post("/uploadSingle", uploader, async (req, res, next) => {
   
    try {

    //   const mediaList = await getMedia()
    //   const mediaIndex = mediaList.findIndex(media => media.id === req.params.mediaId)
    //   const fileName = `${ req.params.mediaId }.${ req.file.mimetype.slice(6) }`
    //   await saveMediaPoster (req.file.originalname, req.file.buffer)
    //   mediaList[mediaIndex].poster = `http://localhost:3001/poster/media ${ fileName }`
    //     await writeMedia(mediaList)
    //     res.send("uploaded")     
    const newMedia = {mediaCover: req.file.path}
    const url = newMedia.mediaCover
    const medias = await getMedia()
    const media = medias.find(media => media._imdbID === req.params.id)
    if(media){
        media.Poster = url
        await writeMedia(medias)
    }
    res.send(url)

 } catch (error) {
      next(error)
    }
  })

  export default posterRouter