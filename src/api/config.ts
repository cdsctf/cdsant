import { alova } from "@/utils/alova";
import { Response } from "@/types";
import { Config } from "@/models/config";

export async function getConfigs() {
    return alova.Get<Response<Config>>("/configs");
}
