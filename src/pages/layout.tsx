import { Layout } from "antd";
import Navbar from "./_blocks/Navbar";
import { css } from "@emotion/react";
import { Outlet } from "react-router";

const { Content } = Layout;

export default function () {
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
