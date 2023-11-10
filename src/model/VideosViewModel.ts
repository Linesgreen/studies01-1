import {AvailableResolutions} from "../routes/videos-router";
export type VideoViewModel = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: typeof  AvailableResolutions;
}