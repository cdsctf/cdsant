import { createBrowserRouter } from "react-router";

export default createBrowserRouter([
    {
        path: "/",
        lazy: async () => {
            return { Component: (await import("@/pages/layout")).default };
        },
        children: [
            {
                path: "challenges",
                lazy: async () => {
                    return {
                        Component: (await import("@/pages/challenges")).default,
                    };
                },
            },
            {
                path: "games",
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            return {
                                Component: (await import("@/pages/games"))
                                    .default,
                            };
                        },
                    },
                ],
            },
            {
                path: "settings",
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            return {
                                Component: (await import("@/pages/settings"))
                                    .default,
                            };
                        },
                    },
                ],
            },
            {
                path: "login",
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            return {
                                Component: (await import("@/pages/login"))
                                    .default,
                            };
                        },
                    },
                ],
            },
        ],
    },
]);
