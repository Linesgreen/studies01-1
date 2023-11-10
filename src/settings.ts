import express, {Request, Response} from "express";
export const app = express();

app.use(express.json())

const AvailableResolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ];

export type VideoType = {
            id: number;
            title: string;
            author: string;
            canBeDownloaded: boolean;
            minAgeRestriction: number | null;
            createdAt: string;
            publicationDate: string;
            availableResolutions: typeof  AvailableResolutions;
        }

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestParams = {
    id:string;
}
type RequestWithBody<B> = Request<{}, {}, B, {}>
type CreateVideoDto = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions;

}
type ErrorType = {
    errorsMessages : ErrorMessagesType[]
}
type ErrorMessagesType = {
    message: string
    field: string
}
type RequestWithBodyAndParams<P,B> = Request<P,{},B,{}>
type UpdateVideoDto = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
    "canBeDownloaded": boolean
    "minAgeRestriction": number | null
    "publicationDate": string
}

const videos: VideoType[] = [
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
export const RouterPaths = {
    videos : '/videos',
    __test__ : '/testing/all-data'
}

app.get('/', (req : Request, res : Response) => {
    res.send('Заглушка')
})

app.get(RouterPaths.videos, (req : Request, res : Response) => {
    res.status(200).send(videos);

})

app.get(`${RouterPaths.videos}/:id`,(req:RequestWithParams<RequestParams>, res: Response) =>{
    const  id: number = +req.params.id
    const video = videos.find(v => v.id === id)
    if (!video) {
         res.sendStatus(404)
         return
    }

    res.send(video);
})
//////////////
type PostReqBody = {
    title : string,
    author : string,
    availableResolutions: string[]
}
const validationReqBody = (reqParams : string, maxLength : number)  => {
    return typeof reqParams  != 'undefined' && typeof reqParams  === 'string' && reqParams.trim().length < maxLength &&  reqParams.trim().length >= 1
}
const generateError = (message : string, field : string) : ErrorMessagesType => {
    return  {
        message : message,
        field : field
    }
}
/////////////////


app.post(RouterPaths.videos, (req : RequestWithBody<CreateVideoDto>, res : Response) => {
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

app.put(`${RouterPaths.videos}/:id`,(req: RequestWithBodyAndParams<RequestParams, UpdateVideoDto>, res : Response) => {
   try {
       const  id: number = +req.params.id
       let error : ErrorType = {
           errorsMessages: []
       }

       let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
       if(!title || title.trim().length < 1 || title.trim().length > 40) {
           error.errorsMessages.push({
               message : "Invalid title",
               field : 'title'
           })
       }
       if(!author || author.trim().length < 1 || author.trim().length > 20) {
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
   } catch (error) {}
})



app.delete(`${RouterPaths.videos}/:id`, (req:RequestWithParams<RequestParams>, res : Response) =>{
    const  id: number = +req.params.id


    const  videoIndex = videos.findIndex(v => v.id === id);
    if (videoIndex === -1) {
        res.sendStatus(404)
        return
    }


    videos.splice(videoIndex, 1);

    res.sendStatus(204)

})

app.delete(RouterPaths.__test__, (req : Request, res : Response) => {
    videos.length = 0;
    res.sendStatus(204);
})