import { User, UserLoginRequest } from "@/models/user";
import { Response } from "@/types";
import { alova } from "@/utils/alova";

export async function login(request: UserLoginRequest) {
    return alova.Post<Response<User>>("/users/login", request);
}
