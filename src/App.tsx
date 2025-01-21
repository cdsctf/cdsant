import { ConfigProvider, notification, theme } from "antd";
import { RouterProvider } from "react-router";
import router from "./router";
import { useThemeStore } from "./stores/theme";
import { useEffect } from "react";
import { useNotificationStore } from "./stores/notification";
import { useSharedStore } from "./stores/shared";
import { getConfigs } from "./api/config";

function App() {
    const themeStore = useThemeStore();
    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const [notificationApi, notificationContextHolder] =
        notification.useNotification();

    function fetchConfigs() {
        getConfigs().then((res) => {
            sharedStore.setConfig(res.data);
        });
    }

    useEffect(() => {
        notificationStore.setApi(notificationApi);
    }, [notificationApi]);

    useEffect(() => {
        fetchConfigs();
    }, []);

    return (
        <ConfigProvider
            theme={{
                cssVar: true,
                algorithm: themeStore.darkMode
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
                token: {
                    borderRadius: 8,
                    wireframe: false,
                },
            }}
        >
            {notificationContextHolder}
            <RouterProvider router={router} />
        </ConfigProvider>
    );
}

export default App;
