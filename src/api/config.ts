import { alova } from "@/utils/alova";
import { Response } from "@/types";
import { ConfigState } from "@/stores/config";

export async function getConfigs() {
    return alova.Get<Response<ConfigState["config"]>>("/configs");
}
