import {
    User,
    UserCreateRequest,
    UserDeleteRequest,
    UserGetRequest,
    UserLoginRequest,
    UserUpdateRequest,
} from "@/models/user";
import { Response } from "@/types";
import { alova } from "@/utils/alova";

export async function login(request: UserLoginRequest) {
    return alova.Post<Response<User>>("/users/login", request);
}

export async function createUser(request: UserCreateRequest) {
    return alova.Post<Response<User>>("/users", request);
}

export async function getUsers(request: UserGetRequest) {
    return alova.Get<Response<Array<User>>>("/users", {
        params: request,
    });
}

export async function deleteUser(request: UserDeleteRequest) {
    return alova.Delete<Response<never>>(`/users/${request.id}`, request);
}

export async function updateUser(request: UserUpdateRequest) {
    return alova.Put<Response<User>>(`/users/${request.id}`, request);
}
