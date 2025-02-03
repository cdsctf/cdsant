import { Submission, CreateSubmissionRequest } from "@/models/submission";
import { Response } from "@/types";
import { alova } from "@/utils/alova";

export async function postSubmission(request: CreateSubmissionRequest) {
    return alova.Post<Response<Submission>>("/submissions", request);
}

export async function getSubmissionById(id: number) {
    return alova.Get<Response<Submission>>(`/submissions/${id}`, {
        cacheFor: 0,
    });
}
