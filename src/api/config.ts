import { alova } from "@/utils/alova";
import { Response } from "@/types";

export async function getMetaConfig() {
    return alova.Get<
        Response<{
            title: string;
            description: string;
        }>
    >("/configs/meta");
}

export async function getCaptchaConfig() {
    return alova.Get<
        Response<{
            title: string;
            description: string;
        }>
    >("/configs/captcha");
}
