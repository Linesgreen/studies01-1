import request from 'supertest'
import {app} from "../../src/settings";
import {VideoType} from "../../src/settings";


describe('/videos', () => {
    // Очищаем БД
    beforeAll(async ()=>{
        await request(app)
            .delete('/testing/all-data')
    })

    // Проверяем что БД пустая
    it('should return 200 and empty []',async () =>{
       await request(app)
            .get('/videos')
            .expect(200, [])
    })

    // Проверка на несуществующее видео
    it('should return 404 for not existing videos',async () =>{
        await request(app)
            .get('/videos/-100')
            .expect(404)
    })

    // Пытаемся создать видео с неправильными данными
    it("should'nt create video with incorrect input data ",async () =>{
        await request(app)
            .post('/videos/')
            .send({
                title: "",
                author: "sssssssssssssssssssssssssssssssssssssssssssssssss",
                availableResolutions: [
                    "616"
                ]
            })
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
            .get('/videos')
            .expect(200, [])
    })

    //Содаем переменные для хранения данных созданных видео
    let createdVideo : VideoType;
    let secondCreatedVideo : VideoType;

    // Создаем видео
    it("should CREATE video with correct input data ",async () =>{
        const createResponse = await request(app)
            .post('/videos/')
            .send({
                title: "test",
                author: "Vlad",
                availableResolutions: [
                    "P1440"
                ]
            })
            .expect(201)

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
            .get('/videos')
            .expect(200, [createdVideo])
    })

    // Создаем второе видео
    it("should CREATE video2 with correct input data ",async () =>{
        const createResponse = await request(app)
            .post('/videos/')
            .send({
                title: "test2",
                author: "VladDalv",
                availableResolutions: [
                    "P1440"
                ]
            })
            .expect(201)

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
            .get('/videos')
            .expect(200, [createdVideo, secondCreatedVideo])
    })

    // Пытаемся обновить createdVideo c неправильными данными
    it("should'nt UPDATE video with incorrect input data ",async () =>{
         await request(app)
            .put('/videos/' + createdVideo.id)
            .send({
                title: "",
                author: ":):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):)",
                availableResolutions: [
                    "P616"
                ]
            })
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
            .get('/videos/' + createdVideo.id)
            .expect(200, createdVideo)

    })
    // Пытаемя обновить secondCreatedVideo с неправильными данными
    it("should'nt UPDATE video2 with incorrect input data ",async () =>{
        await request(app)
            .put('/videos/' + secondCreatedVideo.id)
            .send({
                title: "",
                author: ":):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):):)",
                availableResolutions: [
                    "P616"
                ]
            })
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
            .get('/videos/' + secondCreatedVideo.id)
            .expect(200, secondCreatedVideo)

    })

    // Обновляем данные createdVideo
    it("should UPDATE video with correct input data ",async () =>{
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({
                title: "update video",
                author: ":)",
                availableResolutions: [
                    "P1440"
                ]
            })
            .expect(204)
        // Проверяем что первый курс сreatedVideo изменился
        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(200, {
                ...createdVideo,
                title: "update video",
                author: ":)",
                availableResolutions: [
                    "P1440"
                ]
            })

        // Проверяем что второй курс secondCreatedVideo не изменился
        await request(app)
            .get('/videos/' + secondCreatedVideo.id)
            .expect(200, secondCreatedVideo)

        createdVideo = {
            ...createdVideo,
            title: "update video",
            author: ":)",
            availableResolutions: [
                "P1440"
            ]
        }
    })
    // Обновляем данные secondCreatedVideo
    it("should UPDATE video2 with correct input data ",async () =>{
        await request(app)
            .put('/videos/' + secondCreatedVideo.id)
            .send({
                title: "update video2",
                author: ":З",
                availableResolutions: [
                    "P144"
                ]
            })
            .expect(204)

        await request(app)
            .get('/videos/' + secondCreatedVideo.id)
            .expect(200, {
                ...secondCreatedVideo,
                title: "update video2",
                author: ":З",
                availableResolutions: [
                    "P144"
                ]
            })

        secondCreatedVideo  = {
            ...secondCreatedVideo,
            title: "update video2",
            author: ":З",
            availableResolutions: [
                "P144"
            ]
        }

    })

    // Удаляем createdVideo
    it("should UPDATE video with correct input data ",async () =>{
        await request(app)
            .delete('/videos/' + createdVideo.id)
            .expect(204)

        // Проверяем удалилось ли видео
        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(404)

    })
    // Удаляем secondCreatedVideo
    it("should UPDATE video2 with correct input data ",async () =>{
        await request(app)
            .delete('/videos/' + secondCreatedVideo.id)
            .expect(204)

        // Проверяем удалилось ли видео
        await request(app)
            .get('/videos/' + secondCreatedVideo.id)
            .expect(404)

    })

    // Проверяем что БД пустая
    it('should return 200 and empty []',async () =>{
        await request(app)
            .get('/videos')
            .expect(200, [])
    })
})

