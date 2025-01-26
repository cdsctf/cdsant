import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Breadcrumb, Divider, Flex, Layout, theme } from "antd";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router";
import { Context } from "./context";
import { getUsers } from "@/api/user";
import { User } from "@/models/user";

const { Content } = Layout;

export default function () {
    const { token } = theme.useToken();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const sharedStore = useSharedStore();

    const [user, setUser] = useState<User>();

    function fetchUser() {
        getUsers({
            id: Number(id),
        }).then((res) => {
            setUser(res?.data?.[0]);
        });
    }

    useEffect(() => {
        fetchUser();
    }, [sharedStore?.refresh]);

    return (
        <Context.Provider value={{ user }}>
            <div
                css={css`
                    margin: 12px 10%;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                `}
            >
                <Breadcrumb
                    css={css`
                        margin: 16px 0;
                    `}
                    items={[
                        {
                            key: "/settings",
                            title: <Link to={"/settings"}>管理</Link>,
                        },
                        {
                            key: "/settings/users",
                            title: <Link to={"/settings/users"}>用户</Link>,
                        },
                        {
                            key: location.pathname.split("/")[3],
                            title: user?.username,
                        },
                    ]}
                />
                <Layout
                    css={css`
                        padding: 24px 12px;
                        margin: 0 10%;
                        background: ${token.colorBgContainer};
                        border-radius: ${token.borderRadiusLG}px;
                        flex: 1;
                    `}
                >
                    <Content
                        css={css`
                            padding: 12px 24px;
                            min-height: 280px;
                            display: flex;
                            flex-direction: column;
                        `}
                    >
                        <div
                            css={css`
                                display: flex;
                                flex-direction: column;
                            `}
                        >
                            <Flex align={"center"} justify={"flex-end"}>
                                <span
                                    css={css`
                                        font-size: 1.5rem;
                                    `}
                                >
                                    {user?.username}
                                </span>
                            </Flex>
                            <Divider />
                        </div>
                        <Outlet
                            css={css`
                                flex: 1;
                            `}
                        />
                    </Content>
                </Layout>
            </div>
        </Context.Provider>
    );
}
