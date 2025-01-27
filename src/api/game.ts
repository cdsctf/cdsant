import {
    Game,
    GameCreateRequest,
    GameDeleteRequest,
    GameGetRequest,
    GameScoreboardGetRequest,
    GameUpdateRequest,
    ScoreRecord,
} from "@/models/game";
import {
    GameChallenge,
    GameChallengeGetRequest,
    GameChallengeCreateRequest,
    GameChallengeDeleteRequest,
    GameChallengeUpdateRequest,
} from "@/models/game_challenge";
import {
    GameTeam,
    GameTeamCreateRequest,
    GameTeamDeleteRequest,
    GameTeamGetRequest,
    GameTeamUpdateRequest,
} from "@/models/game_team";
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

export async function getGameChallenges(request: GameChallengeGetRequest) {
    return alova.Get<Response<Array<GameChallenge>>>(
        `/games/${request.game_id}/challenges`,
        {
            params: request,
        }
    );
}

export async function createGameChallenge(request: GameChallengeCreateRequest) {
    return alova.Post<Response<GameChallenge>>(
        `/games/${request.game_id}/challenges`,
        request
    );
}

export async function updateGameChallenge(request: GameChallengeUpdateRequest) {
    return alova.Put<Response<GameChallenge>>(
        `/games/${request.game_id}/challenges/${request.challenge_id}`,
        request
    );
}

export async function deleteGameChallenge(request: GameChallengeDeleteRequest) {
    return alova.Delete<Response<never>>(
        `/games/${request.game_id}/challenges/${request.challenge_id}`,
        request
    );
}

export async function getGameTeams(request: GameTeamGetRequest) {
    return alova.Get<Response<Array<GameTeam>>>(
        `/games/${request.game_id}/teams`,
        {
            params: request,
        }
    );
}

export async function createGameTeam(request: GameTeamCreateRequest) {
    return alova.Post<Response<GameTeam>>(
        `/games/${request.game_id}/teams`,
        request
    );
}

export async function updateGameTeam(request: GameTeamUpdateRequest) {
    return alova.Put<Response<GameTeam>>(
        `/games/${request.game_id}/teams/${request.team_id}`,
        request
    );
}

export async function deleteGameTeam(request: GameTeamDeleteRequest) {
    return alova.Delete<Response<never>>(
        `/games/${request.game_id}/challenges/${request.team_id}`,
        request
    );
}
