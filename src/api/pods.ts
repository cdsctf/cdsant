import {
    Pod,
    PodCreateRequest,
    PodGetRequest,
    PodRemoveRequest,
    PodRenewRequest,
} from "@/models/pod";
import { alova } from "@/utils/alova";
import { Response } from "@/types";

export async function getPods(request: PodGetRequest) {
    return alova.Get<Response<Array<Pod>>>("/pods", {
        params: request,
    });
}

export async function createPod(request: PodCreateRequest) {
    return alova.Post<Response<Pod>>("/pods", request, {
        timeout: 0,
    });
}

export async function stopPod(request: PodRemoveRequest) {
    return alova.Post<Response<unknown>>(`/pods/${request.id}/stop`, request);
}

export async function renewPod(request: PodRenewRequest) {
    return alova.Post<Response<Pod>>(`/pods/${request.id}/renew`, request);
}
