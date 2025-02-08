import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Layout, Grid, theme, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router";
import InfoCircleLinear from "~icons/solar/info-circle-linear";
import LockPasswordLinear from "~icons/solar/lock-password-linear";

const { Sider, Content } = Layout;

export default function () {
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();
    const location = useLocation();
    const sharedStore = useSharedStore();

    return (
        <Layout>
            <Sider
                width={screens.md ? "20%" : 0}
                css={css`
                    background-color: ${token.colorBgContainer};
                    box-shadow: ${token.boxShadowTertiary};
                `}
            >
                <Menu
                    mode={"inline"}
                    defaultSelectedKeys={[
                        location.pathname.split("/")[2] || "/",
                    ]}
                    items={[
                        {
                            key: "/",
                            icon: <InfoCircleLinear />,
                            label: <Link to={"/profile"}>基本信息</Link>,
                        },
                        {
                            key: "password",
                            icon: <LockPasswordLinear />,
                            label: (
                                <Link to={"/profile/password"}>修改密码</Link>
                            ),
                        },
                    ]}
                    css={css`
                        height: 100%;
                        padding: ${token.paddingMD}px;
                    `}
                />
            </Sider>
            <Content>
                <Outlet />
            </Content>
        </Layout>
    );
}
