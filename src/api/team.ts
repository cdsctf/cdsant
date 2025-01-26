import {
    Team,
    TeamCreateRequest,
    TeamCreateUserRequest,
    TeamDeleteRequest,
    TeamDeleteUserRequest,
    TeamGetRequest,
    TeamUpdateRequest,
} from "@/models/team";
import { alova } from "@/utils/alova";
import { Response } from "@/types";
import { Metadata } from "@/models/media";

export async function getTeams(request: TeamGetRequest) {
    return alova.Get<Response<Array<Team>>>("/teams", {
        params: request,
    });
}

export async function createTeam(request: TeamCreateRequest) {
    return alova.Post<Response<Team>>("/teams", request);
}

export async function deleteTeam(request: TeamDeleteRequest) {
    return alova.Delete<Response<never>>(`/teams/${request.id}`, request);
}

export async function updateTeam(request: TeamUpdateRequest) {
    return alova.Put<Response<Team>>(`/teams/${request.id}`, request);
}

export async function getTeamAvatarMetadata(id: number) {
    return alova.Get<Response<Metadata>>(`/teams/${id}/avatar/metadata`);
}

export async function deleteTeamAvatar(id: number) {
    return alova.Delete<Response<never>>(`/teams/${id}/avatar`);
}

export async function createUserTeam(request: TeamCreateUserRequest) {
    return alova.Post<Response<never>>(
        `/teams/${request.team_id}/users`,
        request
    );
}

export async function deleteUserTeam(request: TeamDeleteUserRequest) {
    return alova.Delete<Response<never>>(
        `/teams/${request.team_id}/users/${request.user_id}`,
        request
    );
}

export async function joinTeam() {}

export async function quitTeam() {}
