import { Metadata } from "@/models/media";
import {
    User,
    CreateUserRequest,
    DeleteUserRequest,
    GetUserRequest,
    UserLoginRequest,
    UpdateUserRequest,
} from "@/models/user";
import { Response } from "@/types";
import { alova } from "@/utils/alova";

export async function getUsers(request: GetUserRequest) {
    return alova.Get<Response<Array<User>>>("/users", {
        params: request,
    });
}

export async function createUser(request: CreateUserRequest) {
    return alova.Post<Response<User>>("/users", request);
}

export async function deleteUser(request: DeleteUserRequest) {
    return alova.Delete<Response<never>>(`/users/${request.id}`, request);
}

export async function updateUser(request: UpdateUserRequest) {
    return alova.Put<Response<User>>(`/users/${request.id}`, request);
}

export async function getUserAvatarMetadata(id: number) {
    return alova.Get<Response<Metadata>>(`/users/${id}/avatar/metadata`);
}

export async function deleteUserAvatar(id: number) {
    return alova.Delete<Response<never>>(`/users/${id}/avatar`);
}

export async function login(request: UserLoginRequest) {
    return alova.Post<Response<User>>("/users/login", request);
}
