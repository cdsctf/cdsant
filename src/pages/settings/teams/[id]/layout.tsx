import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Breadcrumb, Divider, Flex, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router";
import { Context } from "./context";
import InfoCircleLinear from "~icons/solar/info-circle-linear";
import UsersGroupTwoRoundedLinear from "~icons/solar/users-group-two-rounded-linear";
import { Team } from "@/models/team";
import { getTeams } from "@/api/team";

const { Sider, Content } = Layout;

export default function () {
    const { token } = theme.useToken();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const sharedStore = useSharedStore();

    const [team, setTeam] = useState<Team>();

    function fetchTeam() {
        getTeams({
            id: Number(id),
        }).then((res) => {
            setTeam(res?.data?.[0]);
        });
    }

    useEffect(() => {
        fetchTeam();
    }, [sharedStore?.refresh]);

    return (
        <Context.Provider value={{ team }}>
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
                            key: "/settings/teams",
                            title: <Link to={"/settings/teams"}>团队</Link>,
                        },
                        {
                            key: location.pathname.split("/")[3],
                            title: team?.name,
                        },
                    ]}
                />
                <Layout
                    css={css`
                        padding: 24px 12px;
                        background: ${token.colorBgContainer};
                        border-radius: ${token.borderRadiusLG}px;
                        flex: 1;
                    `}
                >
                    <Sider
                        width={200}
                        css={css`
                            background: ${token.colorBgContainer};
                        `}
                    >
                        <Menu
                            mode={"inline"}
                            defaultSelectedKeys={[
                                location.pathname.split("/")[4] || "/",
                            ]}
                            items={[
                                {
                                    key: "/",
                                    icon: <InfoCircleLinear />,
                                    label: (
                                        <Link
                                            to={`/settings/teams/${team?.id}`}
                                        >
                                            基本
                                        </Link>
                                    ),
                                },
                                {
                                    key: "users",
                                    icon: <UsersGroupTwoRoundedLinear />,
                                    label: (
                                        <Link
                                            to={`/settings/teams/${team?.id}/users`}
                                        >
                                            成员
                                        </Link>
                                    ),
                                },
                            ]}
                            css={css`
                                height: 100%;
                            `}
                        />
                    </Sider>
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
                                    {team?.name}
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
