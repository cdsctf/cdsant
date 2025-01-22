import {
    Pod,
    PodCreateRequest,
    PodGetRequest,
    PodRemoveRequest,
    PodRenewRequest,
} from "@/models/pod";
import { alovaInstance } from "@/utils/alova";
import { Response } from "@/types";

export async function getPods(request: PodGetRequest) {
    return alovaInstance.Get<Response<Array<Pod>>>("/pods", {
        params: request,
    });
}

export async function createPod(request: PodCreateRequest) {
    return alovaInstance.Post<Response<Pod>>("/pods", request, {
        timeout: 0,
    });
}

export async function stopPod(request: PodRemoveRequest) {
    return alovaInstance.Post<Response<unknown>>(
        `/pods/${request.id}/stop`,
        request
    );
}

export async function renewPod(request: PodRenewRequest) {
    return alovaInstance.Post<Response<Pod>>(
        `/pods/${request.id}/renew`,
        request
    );
}
