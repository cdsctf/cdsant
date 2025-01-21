import { useThemeStore } from "@/stores/theme";
import { Button, Layout, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

export default function () {
    const themeStore = useThemeStore();

    return (
        <Layout>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "transparent",
                }}
            >
                <Button
                    type="primary"
                    onClick={() => themeStore.setDarkMode(!themeStore.darkMode)}
                >
                    1
                </Button>
            </Header>
            <Content
                style={{
                    minHeight: "100vh",
                }}
            >
                11
            </Content>
        </Layout>
    );
}
