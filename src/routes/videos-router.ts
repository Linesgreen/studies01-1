import express, {Request, Response, Router} from "express";
import {
    ErrorMessagesType, ErrorType, PostReqBody,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    VideoType
} from "../types";
import {VideoCreateModel} from "../model/VideosCreateModels";
import {VideoGetModel} from "../model/VideoGetModel";
import {VideoUpdateModelBody, VideoUpdateModelId} from "../model/VideoUpdateModel";
import {VideoDeleteModel} from "../model/VideoDeleteModel";
import {VideoViewModel} from "../model/VideosViewModel";
export const videoRouter = Router ({});

export const AvailableResolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ];
export const RouterPaths = {
    videos : '/videos',
    __test__ : '/testing/all-data'
}


export const videos: VideoType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-11-07T11:55:39.104Z",
        publicationDate: "2023-11-07T11:55:39.104Z",
        availableResolutions: [
            "P144"
        ]
    }
]


function validationReqBody (reqParams : string, maxLength : number) : boolean {
    return typeof reqParams  != 'undefined' && typeof reqParams  === 'string' && reqParams.trim().length < maxLength &&  reqParams.trim().length >= 1
}
function generateError(message : string, field : string) : ErrorMessagesType {
    return  {
        message : message,
        field : field
    }
}


videoRouter.get('/', (req : Request, res : Response<VideoViewModel[]>) => {
    res.status(200).send(videos);

})
videoRouter.get(`/:id`,(req:RequestWithParams<VideoGetModel>, res: Response<VideoViewModel>) =>{
    const  id: number = +req.params.id
    const video = videos.find(v => v.id === id)
    if (!video) {
        res.sendStatus(404)
        return
    }

    res.send(video);
})
videoRouter.post('/', (req : RequestWithBody<VideoCreateModel>, res : Response<VideoViewModel> & Response<ErrorType>) => {
    let error : ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions} : PostReqBody = req.body

    if(!validationReqBody(title, 40)) {
        error.errorsMessages.push(generateError("Invalid title", 'title'))

    }
    if(!validationReqBody(author, 20)) {
        error.errorsMessages.push(generateError("Invalid author", 'author'))
    }

    if(Array.isArray(availableResolutions)) {
        availableResolutions.map(r => {
            !AvailableResolutions.includes(r) &&
            error.errorsMessages
                .push(generateError("Invalid availableResolutions", 'availableResolutions'))
        })
    } else {
        availableResolutions = [];
    }

    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return
    }

    const createdAT = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAT.getDate() + 1)

    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAT.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).send(newVideo)
})
videoRouter.put(`/:id`,(req: RequestWithBodyAndParams<VideoUpdateModelId, VideoUpdateModelBody>, res : Response<VideoViewModel> & Response<ErrorType>) => {

    const  id: number = +req.params.id
    let error : ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} : VideoUpdateModelBody = req.body
    if(!validationReqBody(title, 40)) {
        error.errorsMessages.push({
            message : "Invalid title",
            field : 'title'
        })
    }
    if(!validationReqBody(author, 20)) {
        error.errorsMessages.push({

            message : "Invalid author",
            field : 'author'
        })
    }

    if(Array.isArray(availableResolutions)) {
        availableResolutions.map(r => {
            !AvailableResolutions.includes(r) && error.errorsMessages.push({
                message : "Invalid availableResolutions",
                field : 'availableResolutions'
            })
        })
    } else {
        availableResolutions = [];
    }


    ///////////////
    if (typeof canBeDownloaded === 'undefined' ) {
        canBeDownloaded = false;
    }
    if(typeof canBeDownloaded != "boolean") {
        error.errorsMessages.push({
            message : "Invalid canBeDownloaded",
            field : 'canBeDownloaded'
        })
    }

    if (typeof publicationDate != "string" && typeof publicationDate != "undefined") {
        error.errorsMessages.push({
            message : "Invalid publicationDate",
            field : 'publicationDate'
        })
    }


    if (typeof minAgeRestriction !== 'undefined' && typeof minAgeRestriction === "number" ) {
        minAgeRestriction < 1 || minAgeRestriction > 18  &&  error.errorsMessages.push({
            message : "Invalid minAgeRestriction",
            field : 'minAgeRestriction'
        })
    } else {
        minAgeRestriction = null;
    }

    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return
    }


    const videoIndex = videos.findIndex(v => v.id == id);
    const video = videos.find(v =>  v.id === id );

    if (!video) {

        res.sendStatus(404)
        return;
    }

    const updateItems = {
        ...video,
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        publicationDate : publicationDate ? publicationDate : video.publicationDate,
        availableResolutions
    }

    videos.splice(videoIndex, 1, updateItems)
    res.sendStatus(204)

})
videoRouter.delete(`/:id`, (req:RequestWithParams<VideoDeleteModel>, res : Response ) =>{
    const  id: number = +req.params.id


    const  videoIndex = videos.findIndex(v => v.id === id);
    if (videoIndex === -1) {
        res.sendStatus(404)
        return
    }


    videos.splice(videoIndex, 1);

    res.sendStatus(204)

})
