import { Challenge } from "./challenge";
import { Game } from "./game";

export interface GameChallenge {
    challenge_id?: string;
    challenge?: Challenge;
    game_id?: number;
    game?: Game;
    is_enabled?: boolean;
    difficulty?: number;
    max_pts?: number;
    min_pts?: number;
    first_blood_reward_ratio?: number;
    second_blood_reward_ratio?: number;
    third_blood_reward_ratio?: number;
    frozen_at?: number;
}

export interface GetGameChallengeRequest {
    game_id?: number;
    challenge_id?: string;
    category?: number;
    is_enabled?: boolean;
    page?: number;
    size?: number;
}

export interface UpdateGameChallengeRequest {
    game_id?: number;
    challenge_id?: string;
    is_enabled?: boolean;
    max_pts?: number;
    min_pts?: number;
    difficulty?: number;
    first_blood_reward_ratio?: number;
    second_blood_reward_ratio?: number;
    third_blood_reward_ratio?: number;
    frozen_at?: number;
}

export interface DeleteGameChallengeRequest {
    challenge_id?: string;
    game_id?: number;
}

export interface CreateGameChallengeRequest {
    game_id?: number;
    challenge_id?: string;
    is_enabled?: boolean;
    max_pts?: number;
    min_pts?: number;
    difficulty?: number;
    first_blood_reward_ratio?: number;
    second_blood_reward_ratio?: number;
    third_blood_reward_ratio?: number;
}
