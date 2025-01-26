import {
    Game,
    GameCreateRequest,
    GameDeleteRequest,
    GameGetRequest,
    GameScoreboardGetRequest,
    GameUpdateRequest,
    ScoreRecord,
} from "@/models/game";
import { Metadata } from "@/models/media";
import { Response } from "@/types";
import { alova } from "@/utils/alova";

export async function getGames(request: GameGetRequest) {
    return alova.Get<Response<Array<Game>>>("/games", {
        params: request,
    });
}

export async function createGame(request: GameCreateRequest) {
    return alova.Post<Response<Game>>("/games", request);
}

export async function updateGame(request: GameUpdateRequest) {
    return alova.Put<Response<Game>>(`/games/${request.id}`, request);
}

export async function getScoreboard(
    id: number,
    request: GameScoreboardGetRequest
) {
    return alova.Get<Response<Array<ScoreRecord>>>(`/games/${id}/scoreboard`, {
        params: request,
    });
}

export async function deleteGame(request: GameDeleteRequest) {
    return alova.Delete<Response<never>>(`/games/${request.id}`);
}

export async function getGamePosterMetadata(id: number) {
    return alova.Get<Response<Metadata>>(`/games/${id}/poster/metadata`);
}

export async function deleteGamePoster(id: number) {
    return alova.Delete<Response<never>>(`/games/${id}/poster`);
}

export async function getGameIconMetadata(id: number) {
    return alova.Get<Response<Metadata>>(`/games/${id}/icon/metadata`);
}

export async function deleteGameIcon(id: number) {
    return alova.Delete<Response<never>>(`/games/${id}/icon`);
}
