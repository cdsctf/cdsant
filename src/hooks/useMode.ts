import { useMemo } from "react";

export default function useMode() {
    const mode: "default" | "game" | "setting" = useMemo(() => {
        const path = location.pathname;
        if (path.startsWith("/games") && path !== "/games") {
            return "game";
        }

        if (path.startsWith("/settings")) {
            return "setting";
        }

        return "default";
    }, [location.pathname]);

    return mode;
}
