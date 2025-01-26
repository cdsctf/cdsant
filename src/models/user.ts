import { Team } from "./team";

export interface User {
    id?: number;
    username?: string;
    nickname?: string;
    email?: string;
    group?: Group;
    description?: string;
    teams?: Array<Team>;
    created_at?: string;
    updated_at?: string;
}

export enum Group {
    Guest = 0,
    Banned = 1,
    User = 2,
    Admin = 3,
}

export interface UserGetRequest {
    id?: number;
    name?: string;
    username?: string;
    nickname?: string;
    email?: string;
    group?: Group;
    page?: number;
    size?: number;
    sorts?: string;
}

export interface UserUpdateRequest {
    id: number;
    username?: string;
    nickname?: string;
    email?: string;
    group?: Group;
    password?: string;
    description?: string;
}

export interface UserCreateRequest {
    username?: string;
    nickname?: string;
    email?: string;
    group?: Group;
    password?: string;
}

export interface UserDeleteRequest {
    id: number;
}

export interface UserLoginRequest {
    account: string;
    password: string;
}

export interface UserRegisterRequest {
    username: string;
    nickname: string;
    email: string;
    password: string;
    token?: string;
}
