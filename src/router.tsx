import { createBrowserRouter } from "react-router";

export default createBrowserRouter([
    {
        path: "/",
        lazy: async () => {
            return { Component: (await import("@/pages/layout")).default };
        },
    },
]);
