import {Request} from "express";
import {AvailableResolutions} from "./routes/videos-router";


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
export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithBodyAndParams<P,B> = Request<P,{},B,{}>
export type ErrorType = {
    errorsMessages : ErrorMessagesType[]
}
export type ErrorMessagesType = {
    message: string
    field: string
}

export type PostReqBody = {
    title : string,
    author : string,
    availableResolutions: string[]
}

export type CreateVideoDto = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions;
}