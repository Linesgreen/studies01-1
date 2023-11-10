import {AvailableResolutions} from "../routes/videos-router";

export type VideoCreateModel = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions;
}

