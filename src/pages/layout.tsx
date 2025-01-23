import { Layout } from "antd";
import Navbar from "./_blocks/Navbar";
import { css } from "@emotion/react";
import { Outlet, useNavigate } from "react-router";
import globalRouter from "@/utils/globalRouter";

const { Content } = Layout;

export default function () {
    const navigate = useNavigate();
    globalRouter.navigate = navigate;

    return (
        <Layout>
            <Navbar />
            <Content
                css={css`
                    display: flex;
                    flex-direction: column;
                    min-height: calc(100vh - 64px);
                `}
            >
                <Outlet />
            </Content>
        </Layout>
    );
}
