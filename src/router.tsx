import { createBrowserRouter } from "react-router";

export default createBrowserRouter([
    {
        path: "/",
        lazy: async () => {
            return { Component: (await import("@/pages/layout")).default };
        },
        children: [
            {
                index: true,
                lazy: async () => {
                    return {
                        Component: (await import("@/pages")).default,
                    };
                },
            },
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
                    {
                        path: ":id",
                        lazy: async () => {
                            return {
                                Component: (await import("@/pages/games/[id]"))
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
                    {
                        path: "challenges",
                        children: [
                            {
                                index: true,
                                lazy: async () => {
                                    return {
                                        Component: (
                                            await import(
                                                "@/pages/settings/challenges"
                                            )
                                        ).default,
                                    };
                                },
                            },
                            {
                                path: ":id",
                                lazy: async () => {
                                    return {
                                        Component: (
                                            await import(
                                                "@/pages/settings/challenges/[id]"
                                            )
                                        ).default,
                                    };
                                },
                            },
                        ],
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
