import request from 'supertest'
import {RouterPaths} from "../../src/routes/videos-router";

import {app} from "../../src"
import {VideoType} from "../../src/types";
import {VideoCreateModel} from "../../src/model/VideosCreateModels";


describe('/videos', () => {
    // Очищаем БД
    beforeAll(async ()=>{
        await request(app)
            .delete('/testing/all-data')
    })

    // Проверяем что БД пустая
    it('should return 200 and empty []',async () =>{
       await request(app)
            .get(RouterPaths.videos)
            .expect(200, [])
    })

    // Проверка на несуществующее видео
    it('should return 404 for not existing videos',async () =>{
        await request(app)
            .get(`${RouterPaths.videos}/-100`)
            .expect(404)
    })

    // Пытаемся создать видео с неправильными данными
    it("should'nt create video with incorrect input data ",async () =>{
        const videoData : VideoCreateModel  = {
            title: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa41",
            author: "aaaaaaaaaaaaaaaaaaa21",
            availableResolutions: [
                "616"
            ],

        };
        await request(app)
            .post(RouterPaths.videos)
            .send(videoData)
            .expect(400, {
                "errorsMessages": [
                    {
                        message: "Invalid title",
                        field: "title"
                    },
                    {
                        message: "Invalid author",
                        field: "author"
                    },
                    {
                        message: "Invalid availableResolutions",
                        field: "availableResolutions"
                    }
                ]
            })
        await request(app)
            .get(RouterPaths.videos)
            .expect(200, [])
    })

    //Переменные для хранения данных созданных видео
    let createdVideo : VideoType;
    let secondCreatedVideo : VideoType;

    // Создаем видео
    it("should CREATE video with correct input data ",async () =>{
        const videoData : VideoCreateModel  = {
            title: "test",
            author: "Vlad",
            availableResolutions: [
                "P1440"
            ]
        };
        const createResponse = await request(app)
            .post(RouterPaths.videos)
            .send(videoData)
            .expect(201)
        //Проверяем что созданное видео соответствует видео
        createdVideo =  createResponse.body;
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: "test",
            author: "Vlad",
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
            publicationDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
            availableResolutions: [
                "P1440"
            ]
        })

        await request(app)
            .get(RouterPaths.videos)
            .expect(200, [createdVideo])
    })

    // Создаем второе видео
    it("should CREATE video2 with correct input data ",async () =>{
        const videoData : VideoCreateModel = {
            title: "test2",
            author: "VladDalv",
            availableResolutions: [
                "P1440"
            ]
        };
        const createResponse = await request(app)
            .post(RouterPaths.videos)
            .send(videoData)
            .expect(201)

        //Проверяем что созданное видео соответствует второму видео
        secondCreatedVideo =  createResponse.body;
        expect(secondCreatedVideo).toEqual({
            id: expect.any(Number),
            title: "test2",
            author: "VladDalv",
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
            publicationDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
            availableResolutions: [
                "P1440"
            ]
        })

        await request(app)
            .get(RouterPaths.videos)
            .expect(200, [createdVideo, secondCreatedVideo])
    })

    // Пытаемся обновить createdVideo c неправильными данными
    it("should'nt UPDATE video with incorrect input data ",async () =>{
         await request(app)
            .put(`${RouterPaths.videos}/${createdVideo.id}`)
            .send({
                title: "",
                author: ":):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):)",
                availableResolutions: [
                    "P616"
                ],
                canBeDownloaded: "",
                publicationDate:'lol'
            })
            .expect(400, {
                "errorsMessages": [
                    {
                        message: "Invalid title",
                        field: "title"
                    },
                    {
                        message: "Invalid author",
                        field: "author"
                    },
                    {
                        message: "Invalid availableResolutions",
                        field: "availableResolutions"
                    },
                    {
                        message: "Invalid canBeDownloaded",
                        field: "canBeDownloaded"
                    },
                    {
                        message: "Invalid publicationDate",
                        field: "publicationDate"
                    }
                ]
            })


        await request(app)
            .get(`${RouterPaths.videos}/${createdVideo.id}`)
            .expect(200, createdVideo)

    })
    // Пытаемя обновить secondCreatedVideo с неправильными данными
    it("should'nt UPDATE video2 with incorrect input data ",async () =>{
        const videoData : VideoCreateModel = {
            title: "",
            author: ":):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):)",
            availableResolutions: [
                "P616"
            ]
        };
        await request(app)
            .put(`${RouterPaths.videos}/${secondCreatedVideo.id}`)
            .send(videoData)
            .expect(400, {
                errorsMessages: [
                    { message: 'Invalid title', field: 'title' },
                    { message: 'Invalid author', field: 'author' },
                    {
                        message: 'Invalid availableResolutions',
                        field: 'availableResolutions'
                    }
                ]
            })

        await request(app)
            .get(`${RouterPaths.videos}/${secondCreatedVideo.id}`)
            .expect(200, secondCreatedVideo)

    })

    // Обновляем данные createdVideo
    it("should UPDATE video with correct input data ",async () =>{
        const videoData : VideoCreateModel  = {
            title: "update video",
            author: ":)",
            availableResolutions: [
                "P1440"
            ]
        };
        await request(app)
            .put(`${RouterPaths.videos}/${createdVideo.id}`)
            .send(videoData)
            .expect(204)
        // Проверяем что первый курс сreatedVideo изменился
        await request(app)
            .get(`${RouterPaths.videos}/${createdVideo.id}`)
            .expect(200, {
                ...createdVideo,
                ...videoData
            })

        // Проверяем что  secondCreatedVideo не изменилось
        await request(app)
            .get(`${RouterPaths.videos}/${secondCreatedVideo.id}`)
            .expect(200, secondCreatedVideo)

        // Обновляем запись с первым видео
        createdVideo = {
            ...createdVideo,
            ...videoData
        }
    })
    // Обновляем данные secondCreatedVideo
    it("should UPDATE video2 with correct input data ",async () =>{
        const videoData : VideoCreateModel = {
            title: "update video2",
            author: ":З",
            availableResolutions: [
                "P144"
            ]
        };
        await request(app)
            .put(`${RouterPaths.videos}/${secondCreatedVideo.id}`)
            .send(videoData)
            .expect(204)

        await request(app)
            .get(`${RouterPaths.videos}/${secondCreatedVideo.id}`)
            .expect(200, {
                ...secondCreatedVideo,
                ...videoData
            })
        // Обновляем запись с вторым видео
        secondCreatedVideo  = {
            ...secondCreatedVideo,
            ...videoData
        }

    })

    // Удаляем createdVideo
    it("should DELETE video with correct input data ",async () =>{
        await request(app)
            .delete(`${RouterPaths.videos}/${createdVideo.id}`)
            .expect(204)

        // Проверяем удалилось ли видео
        await request(app)
            .get(`${RouterPaths.videos}/${createdVideo.id}`)
            .expect(404)

    })
    // Удаляем secondCreatedVideo
    it("should DELETE video2 with correct input data ",async () =>{
        await request(app)
            .delete(`${RouterPaths.videos}/${secondCreatedVideo.id}`)
            .expect(204)

        // Проверяем удалилось ли видео
        await request(app)
            .get(`${RouterPaths.videos}/${secondCreatedVideo.id}`)
            .expect(404)

    })

    // Проверяем что БД пустая
    it('should return 200 and empty []',async () =>{
        await request(app)
            .get(RouterPaths.videos)
            .expect(200, [])
    })
})

