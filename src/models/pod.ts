// import { Game } from "./game";
// import { User } from "./user";
// import { Team } from "./team";
// import { Challenge } from "./challenge";
import { Nat } from "./nat";

export interface Pod {
    id: string;
    game_id: number;
    // game: Game;
    user_id: number;
    // user: User;
    team_id: number;
    // team: Team;
    challenge_id: string;
    // challenge: Challenge;
    nats?: string;
    ports?: Array<number>;

    status?: string;
    reason?: string;

    renew?: number;
    duration?: number;
    started_at?: number;
}

export interface PodGetRequest {
    id?: string;
    game_id?: number;
    user_id?: number;
    team_id?: number;
    challenge_id?: string;
}

export interface PodCreateRequest {
    game_id?: number;
    team_id?: number;
    challenge_id?: string;
}

export interface PodRemoveRequest {
    id: string;
}

export interface PodRenewRequest {
    id: string;
    team_id?: number;
    game_id?: number;
}
