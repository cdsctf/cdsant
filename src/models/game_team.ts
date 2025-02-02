import { Game } from "./game";
import { Team } from "./team";

export interface GameTeam {
    team_id?: number;
    game_id?: number;
    is_allowed?: boolean;

    rank?: number;
    pts?: number;

    team?: Team;
    game?: Game;
}

export interface GameTeamGetRequest {
    game_id?: number;
    team_id?: number;
    user_id?: number;
}

export interface GameTeamCreateRequest {
    game_id?: number;
    team_id?: number;
}

export interface GameTeamUpdateRequest {
    game_id?: number;
    team_id?: number;
    is_allowed?: boolean;
}

export interface GameTeamDeleteRequest {
    game_id?: number;
    team_id?: number;
}
