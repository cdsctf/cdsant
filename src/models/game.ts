import { GameTeam } from "./game_team";
import { GameSubmission, Status } from "./submission";

export interface Game {
    id?: number;
    title?: string;
    sketch?: string;
    description?: string;
    is_enabled?: boolean;
    is_public?: boolean;
    is_need_write_up?: boolean;

    member_limit_min?: number;
    member_limit_max?: number;

    started_at?: number;
    frozen_at?: number;
    ended_at?: number;

    created_at?: number;
    updated_at?: number;
}

export interface ScoreRecord {
    game_team?: GameTeam;
    submissions?: Array<GameSubmission>;
}

export interface GameGetRequest {
    id?: number;
    title?: string;
    is_enabled?: boolean;
    sorts?: string;
    page?: number;
    size?: number;
}

export interface GameScoreboardGetRequest {
    size?: number;
    page?: number;
}

export interface GameSubmissionGetRequest {
    id?: number;
    status?: Status;
}

export interface GameCreateRequest {
    title?: string;
    sketch?: string;
    description?: string;
    is_enabled?: boolean;
    is_public?: boolean;
    is_need_write_up?: boolean;
    member_limit_min?: number;
    member_limit_max?: number;
    started_at?: number;
    ended_at?: number;
}

export interface GameUpdateRequest {
    id?: number;
    title?: string;
    sketch?: string;
    description?: string;
    is_enabled?: boolean;
    is_public?: boolean;
    is_need_write_up?: boolean;
    member_limit_min?: number;
    member_limit_max?: number;
    started_at?: number;
    frozen_at?: number;
    ended_at?: number;
}

export interface GameDeleteRequest {
    id?: number;
}

export interface GameTeamFindRequest {
    game_id?: number;
    team_id?: number;
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
