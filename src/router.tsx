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
                                Component: (
                                    await import("@/pages/games/[id]/layout")
                                ).default,
                            };
                        },
                        children: [
                            {
                                index: true,
                                lazy: async () => {
                                    return {
                                        Component: (
                                            await import("@/pages/games/[id]")
                                        ).default,
                                    };
                                },
                            },
                            {
                                path: "challenges",
                                lazy: async () => {
                                    return {
                                        Component: (
                                            await import(
                                                "@/pages/games/[id]/challenges"
                                            )
                                        ).default,
                                    };
                                },
                            },
                            {
                                path: "scoreboard",
                                lazy: async () => {
                                    return {
                                        Component: (
                                            await import(
                                                "@/pages/games/[id]/scoreboard"
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
                path: "teams",
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            return {
                                Component: (await import("@/pages/teams"))
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
                                                "@/pages/settings/challenges/[id]/layout"
                                            )
                                        ).default,
                                    };
                                },
                                children: [
                                    {
                                        index: true,
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
                                    {
                                        path: "checker",
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/challenges/[id]/checker"
                                                    )
                                                ).default,
                                            };
                                        },
                                    },
                                    {
                                        path: "env",
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/challenges/[id]/env"
                                                    )
                                                ).default,
                                            };
                                        },
                                    },
                                    {
                                        path: "attachments",
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/challenges/[id]/attachments"
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
                        path: "games",
                        children: [
                            {
                                index: true,
                                lazy: async () => {
                                    return {
                                        Component: (
                                            await import(
                                                "@/pages/settings/games"
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
                                                "@/pages/settings/games/[id]/layout"
                                            )
                                        ).default,
                                    };
                                },
                                children: [
                                    {
                                        index: true,
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/games/[id]"
                                                    )
                                                ).default,
                                            };
                                        },
                                    },
                                    {
                                        path: "challenges",
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/games/[id]/challenges"
                                                    )
                                                ).default,
                                            };
                                        },
                                    },
                                    {
                                        path: "teams",
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/games/[id]/teams"
                                                    )
                                                ).default,
                                            };
                                        },
                                    },
                                    {
                                        path: "notices",
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/games/[id]/notices"
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
                        path: "teams",
                        children: [
                            {
                                index: true,
                                lazy: async () => {
                                    return {
                                        Component: (
                                            await import(
                                                "@/pages/settings/teams"
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
                                                "@/pages/settings/teams/[id]/layout"
                                            )
                                        ).default,
                                    };
                                },
                                children: [
                                    {
                                        index: true,
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/teams/[id]"
                                                    )
                                                ).default,
                                            };
                                        },
                                    },
                                    {
                                        path: "users",
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/teams/[id]/users"
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
                        path: "users",
                        children: [
                            {
                                index: true,
                                lazy: async () => {
                                    return {
                                        Component: (
                                            await import(
                                                "@/pages/settings/users"
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
                                                "@/pages/settings/users/[id]/layout"
                                            )
                                        ).default,
                                    };
                                },
                                children: [
                                    {
                                        index: true,
                                        lazy: async () => {
                                            return {
                                                Component: (
                                                    await import(
                                                        "@/pages/settings/users/[id]"
                                                    )
                                                ).default,
                                            };
                                        },
                                    },
                                ],
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
