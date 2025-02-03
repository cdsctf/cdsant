import { getChallenges } from "@/api/challenge";
import { Challenge } from "@/models/challenge";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Breadcrumb, Divider, Flex, Layout, Menu, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router";
import { Context } from "./context";
import InfoCircleLinear from "~icons/solar/info-circle-linear";
import PaperclipLinear from "~icons/solar/paperclip-linear";
import BoxMinimalisticLinear from "~icons/solar/box-minimalistic-linear";
import FlagLinear from "~icons/solar/flag-linear";
import { useCategoryStore } from "@/stores/category";

const { Sider, Content } = Layout;

export default function () {
    const { token } = theme.useToken();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const sharedStore = useSharedStore();
    const categoryStore = useCategoryStore();

    const [challenge, setChallenge] = useState<Challenge>();
    const category = useMemo(() => {
        return categoryStore?.getCategory(challenge?.category);
    }, [challenge?.category]);

    function fetchChallenge() {
        getChallenges({
            id: id,
            is_desensitized: false,
        }).then((res) => {
            setChallenge(res?.data?.[0]);
        });
    }

    useEffect(() => {
        fetchChallenge();
    }, [sharedStore?.refresh]);

    return (
        <Context.Provider value={{ challenge }}>
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
                            key: "/settings/challenges",
                            title: (
                                <Link to={"/settings/challenges"}>题库</Link>
                            ),
                        },
                        {
                            key: location.pathname.split("/")[3],
                            title: challenge?.title,
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
                                            to={`/settings/challenges/${challenge?.id}`}
                                        >
                                            基本
                                        </Link>
                                    ),
                                },
                                {
                                    key: "checker",
                                    icon: <FlagLinear />,
                                    label: (
                                        <Link
                                            to={`/settings/challenges/${challenge?.id}/checker`}
                                        >
                                            脚本
                                        </Link>
                                    ),
                                },
                                {
                                    key: "env",
                                    icon: <BoxMinimalisticLinear />,
                                    label: (
                                        <Link
                                            to={`/settings/challenges/${challenge?.id}/env`}
                                        >
                                            容器
                                        </Link>
                                    ),
                                    disabled: !challenge?.is_dynamic,
                                },
                                {
                                    key: "attachments",
                                    icon: <PaperclipLinear />,
                                    label: (
                                        <Link
                                            to={`/settings/challenges/${challenge?.id}/attachments`}
                                        >
                                            附件
                                        </Link>
                                    ),
                                    disabled: !challenge?.has_attachment,
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
                            <Flex align={"center"} justify={"space-between"}>
                                <Flex
                                    align={"center"}
                                    gap={12}
                                    css={css`
                                        font-size: 1.5rem;
                                        color: ${category?.color};
                                        user-select: none;
                                    `}
                                >
                                    {category?.icon}
                                    <span>{category?.name?.toUpperCase()}</span>
                                </Flex>
                                <span
                                    css={css`
                                        font-size: 1.5rem;
                                    `}
                                >
                                    {challenge?.title}
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
