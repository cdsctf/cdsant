import { Env } from "./env";
import { Submission } from "./submission";

export interface Challenge {
    id?: string;
    title?: string;
    tags?: Array<string>;
    description?: string;
    category?: number;
    has_attachment?: boolean;
    is_public?: boolean;
    is_dynamic?: boolean;
    env?: Env;
    script?: string;
    updated_at?: number;
    created_at?: number;
}

export interface ChallengeGetRequest {
    id?: string;
    title?: string;
    description?: string;
    category?: number;
    is_public?: boolean;
    is_dynamic?: boolean;
    is_detailed?: boolean;
    page?: number;
    size?: number;
    sorts?: string;
}

export interface ChallengeUpdateRequest {
    id?: string;
    title?: string;
    tags?: Array<string>;
    description?: string;
    category?: number;
    has_attachment?: boolean;
    is_public?: boolean;
    is_dynamic?: boolean;
    env?: Env;
    script?: string;
}

export interface ChallengeCreateRequest {
    title?: string;
    description?: string;
    category?: number;
    is_public?: boolean;
    is_dynamic?: boolean;
    env?: Env;
}

export interface ChallengeDeleteRequest {
    id?: string;
}

export interface ChallengeStatus {
    is_solved?: boolean;
    solved_times?: number;
    pts?: number;
    bloods?: Array<Submission>;
}

export interface ChallengeStatusRequest {
    challenge_ids: Array<string>;
    user_id?: number;
    team_id?: number;
    game_id?: number;
}
