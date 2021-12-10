import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { reviewValidation } from "./validation.js"
import { getMedia, writeMedia} from "../../lib/fs-tools.js" 


const reviewsRouter = express.Router({ mergeParams: true })

//endpoints
reviewsRouter.post('/', reviewValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, "There some errors on your submission, namely: ", { errorList }))
        } else {
            const mediaList = await getMedia()
            const currentIndex = mediaList.findIndex(media => media.id === req.params.mediaId)
            const newComment = { ...req.body, createdAt: new Date(), id: uniqid(), mediaId: req.params.mediaId }
            if (mediaList[currentIndex].reviews) {
                mediaList[currentIndex].reviews.push(newComment)
            } else {
                mediaList[currentIndex].reviews = []
                mediaList[currentIndex].reviews.push(newComment)
            }
            await writeMedia(mediaList)
            res.status(201).send(`Comment added successfully`)

        }
    } catch (error) {
        next(error)
    }
})


reviewsRouter.get('/', async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const selectedMedia = mediaList.find(media => media.id === req.params.mediaId)
        res.send(selectedMedia.reviews)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.get('/:reviewId', async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const selectedMedia = mediaList.find(media => media.id === req.params.mediaId)
        const selectedReview = selectedMedia.reviews.find(review => review.id === req.params.reviewId)
        res.send(selectedReview)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.put('/:reviewId', async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const selectedMedia = mediaList.find(media => media.id === req.params.mediaId)
        const reviewToEditIndex = selectedMedia.reviews.findIndex(review => review.id === req.params.reviewId)
        const editedReview = { ...selectedMedia.reviews[reviewToEditIndex], ...req.body, updatedAt: new Date() }
        selectedMedia.reviews[reviewToEditIndex] = editedReview
        await writeMedia(mediaList)
        res.send(editedReview)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.delete('/:reviewId', async (req, res, next) => {
    try {
        const mediaList = await getMedia()
        const selectedMedia = mediaList.find(media => media.id === req.params.mediaId)
        const remainingReviewsArray = selectedMedia.reviews.filter(review => review.id !== req.params.reviewId)
        selectedMedia.reviews = remainingReviewsArray
        await writeMedia(mediaList)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})



export default reviewsRouter