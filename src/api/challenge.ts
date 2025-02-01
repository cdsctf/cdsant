import {
    Challenge,
    ChallengeCreateRequest,
    ChallengeGetRequest,
    ChallengeStatus,
    ChallengeStatusRequest,
    ChallengeUpdateRequest,
    ChallengeDeleteRequest,
} from "@/models/challenge";
import { Metadata } from "@/models/media";
import { Response } from "@/types";
import { alova } from "@/utils/alova";

export async function getChallenges(request: ChallengeGetRequest) {
    return alova.Get<Response<Array<Challenge>>>("/challenges", {
        params: request,
    });
}

export async function getChallengeStatus(request: ChallengeStatusRequest) {
    return alova.Post<Response<Record<string, ChallengeStatus>>>(
        "/challenges/status",
        request,
        {
            cacheFor: 0,
        }
    );
}

export async function updateChallenge(request: ChallengeUpdateRequest) {
    return alova.Put<Response<Challenge>>(
        `/challenges/${request?.id}`,
        request,
        {
            cacheFor: 0,
        }
    );
}

export async function createChallenge(request: ChallengeCreateRequest) {
    return alova.Post<Response<Challenge>>("/challenges", request, {
        cacheFor: 0,
    });
}

export async function deleteChallenge(request: ChallengeDeleteRequest) {
    return alova.Delete<Response<never>>(`/challenges/${request.id}`);
}

export async function lintChallengeScript(id: string) {
    return alova.Get<Response<never>>(`/challenges/${id}/lint`);
}

export async function getChallengeAttachmentMetadata(id: string) {
    return alova.Get<Response<Metadata>>(
        `/challenges/${id}/attachment/metadata`
    );
}

export async function deleteChallengeAttachment(id: string) {
    return alova.Delete<Response<never>>(`/challenges/${id}/attachment`);
}
