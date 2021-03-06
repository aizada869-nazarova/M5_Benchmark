import fs from "fs-extra" // 3rd party module
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data") 
const posterMediaPublicFolderPath = join(process.cwd(), "./public/poster/media")

const mediaJSONPath = join(dataFolderPath, "media.json")

export const getMedia = () => readJSON(mediaJSONPath)
export const writeMedia = content => writeJSON(mediaJSONPath, content)

export const saveMediaPoster= (fileName, fileContentAsBuffer) => writeFile(join(posterMediaPublicFolderPath, fileName), fileContentAsBuffer)