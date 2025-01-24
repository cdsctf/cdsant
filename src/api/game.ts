import {
    Game,
    GameGetRequest,
    GameScoreboardGetRequest,
    ScoreRecord,
} from "@/models/game";
import { Response } from "@/types";
import { alova } from "@/utils/alova";

export async function getGames(request: GameGetRequest) {
    return alova.Get<Response<Array<Game>>>("/games", {
        params: request,
    });
}

export async function getScoreboard(
    id: number,
    request: GameScoreboardGetRequest
) {
    return alova.Get<Response<Array<ScoreRecord>>>(`/games/${id}/scoreboard`, {
        params: request,
    });
}
