import express from "express" 
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"
import mediaRouter from "./services/media/media.js"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./errorHandlers.js"
// import filesRouter from "./services/files/index.js"
import reviewsRouter from "./services/media/reviews.js"

const server = express()

const port = process.env.PORT || 3001


const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]

const corsOptions = {
  origin: function (origin, next) {
    
    if (!origin || whiteList.indexOf(origin) !== -1) {
      
      next(null, true)
    } else {
      
      next(new Error("CORS ERROR!"))
    }
  },
}

server.use(cors(corsOptions)) 
server.use(express.json()) 

// ******************** ENDPOINTS ***********************

server.use("/media", mediaRouter)
server.use('/media/:mediaId/reviews', reviewsRouter)



// ******************** ERROR HANDLERS **********************
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)


console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})