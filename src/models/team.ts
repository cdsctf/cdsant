import { User } from "./user";

export interface Team {
    id?: number;
    name?: string;
    slogan?: string;
    description?: string;
    email?: string;
    is_locked?: boolean;
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;
    users?: Array<User>;
}

export interface TeamGetRequest {
    id?: number;
    name?: string;
    page?: number;
    size?: number;
    sorts?: string;
}

export interface TeamUpdateRequest {
    id?: number;
    name?: string;
    slogan?: string;
    description?: string;
    email?: string;
}

export interface TeamCreateRequest {
    name?: string;
    slogan?: string;
    email?: string;
}

export interface TeamDeleteRequest {
    id: number;
}

export interface TeamJoinRequest {
    id: number;
    token: string;
}

export interface TeamQuitRequest {
    id: number;
}

export interface TeamGetInviteTokenRequest {
    id: number;
}

export interface TeamUpdateInviteTokenRequest {
    id: number;
}

export interface TeamDeleteUserRequest {
    team_id: number;
    user_id: number;
}

export interface TeamCreateUserRequest {
    team_id: number;
    user_id: number;
}
