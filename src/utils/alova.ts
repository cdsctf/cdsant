import { createAlova } from "alova";
import adapterFetch from "alova/fetch";
import ReactHook from "alova/react";
import globalRouter from "./globalRouter";
import { useNotificationStore } from "@/stores/notification";

export const alovaInstance = createAlova({
    baseURL: "/api",
    requestAdapter: adapterFetch(),
    timeout: 5000,
    shareRequest: true,
    statesHook: ReactHook,
    cacheFor: {
        POST: 0,
        PUT: 0,
        DELETE: 0,
    },
    responded: {
        onSuccess: async (response, _method) => {
            if (response.status === 401) {
                globalRouter?.navigate?.("/login");
                useNotificationStore.getState().api?.warning({
                    message: "请先登录",
                    description: "登录后才能继续操作",
                });
                return Promise.reject(response);
            }

            if (response.status === 502) {
                useNotificationStore.getState().api?.error({
                    key: "502-backend-offline",
                    message: "服务器离线",
                    description: "服务器暂时无法处理请求",
                });
                return Promise.reject(response);
            }

            return response.json();
        },
    },
});
