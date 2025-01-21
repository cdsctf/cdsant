import { ConfigProvider, theme } from "antd";
import { RouterProvider } from "react-router";
import router from "./router";
import { useThemeStore } from "./stores/theme";

function App() {
    const themeStore = useThemeStore();

    return (
        <ConfigProvider
            theme={{
                cssVar: true,
                algorithm: themeStore.darkMode
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#0d47a1",
                    colorInfo: "#0d47a1",
                    borderRadius: 8,
                    wireframe: false,
                },
            }}
        >
            <RouterProvider router={router} />
        </ConfigProvider>
    );
}

export default App;
