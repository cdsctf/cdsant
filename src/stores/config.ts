import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ConfigState {
    meta?: {
        title: string;
        description: string;
    };

    setMeta: (meta: ConfigState["meta"]) => void;

    captcha?: {
        provider: string;
        siteKey: string;
    };

    setCaptcha: (captcha: ConfigState["captcha"]) => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set, _get) => ({
            setMeta: (meta) => set({ meta }),
            setCaptcha: (captcha) => set({ captcha }),
        }),
        {
            name: "config",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
