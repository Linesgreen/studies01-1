import {RouterPaths, videoRouter} from "./routes/videos-router";
import express, {Request, Response} from "express";
import {videos} from "./routes/videos-router";
export const app  = express()
const port = 3002;


app.use(express.json())
app.use(RouterPaths.videos, videoRouter)

app.get('/', (req : Request, res : Response) => {
    res.send('Заглушка')
})
app.delete(RouterPaths.__test__, (req : Request, res : Response) => {
    videos.length = 0;
    res.sendStatus(204);
})



app.listen(port, () => {
    console.log(`server started at port number ${port}`)
})