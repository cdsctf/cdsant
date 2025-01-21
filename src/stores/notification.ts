import { create } from "zustand";
import { NotificationInstance } from "antd/es/notification/interface";

interface NotificationState {
    api?: NotificationInstance;
    setApi: (api: NotificationInstance) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
    setApi: (api) => set({ api }),
}));
