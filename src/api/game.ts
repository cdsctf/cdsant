import {
    Game,
    GameCreateRequest,
    GameDeleteRequest,
    GameGetRequest,
    GameScoreboardGetRequest,
    GameUpdateRequest,
    ScoreRecord,
} from "@/models/game";
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
