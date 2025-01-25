import { ConfigProvider, notification, theme } from "antd";
import { RouterProvider } from "react-router";
import router from "./router";
import { useThemeStore } from "./stores/theme";
import { useEffect } from "react";
import { useNotificationStore } from "./stores/notification";
import { getMetaConfig } from "./api/config";
import { useConfigStore } from "./stores/config";

function App() {
    const themeStore = useThemeStore();
    const configStore = useConfigStore();
    const notificationStore = useNotificationStore();
    const [notificationApi, notificationContextHolder] =
        notification.useNotification({
            placement: "bottomRight",
        });

    function fetchConfigs() {
        getMetaConfig().then((res) => {
            configStore.setMeta(res.data);
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
