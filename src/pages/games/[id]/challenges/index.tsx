import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context";
import { useNavigate, useParams } from "react-router";
import { Avatar, Button, Flex, Grid, Layout, Modal, theme } from "antd";
import StarsMinimalisticLinear from "~icons/solar/stars-minimalistic-linear";
import CupStarLinear from "~icons/solar/cup-star-linear";
import { css } from "@emotion/react";
import {
    ActionType,
    ProColumnType,
    ProTable,
} from "@ant-design/pro-components";
import { Challenge, ChallengeStatus } from "@/models/challenge";
import { useCategoryStore } from "@/stores/category";
import PlayCircleLinear from "~icons/solar/play-circle-linear";
import { nanoid } from "nanoid";
import { getGameChallenges } from "@/api/game";
import { getChallengeStatus } from "@/api/challenge";
import ChallengeModal from "@/components/modals/ChallengeModal";
import { useSharedStore } from "@/stores/shared";

const { Content, Sider } = Layout;

interface ChallengeWithStatus extends Challenge, ChallengeStatus {}

export default function () {
    const { id } = useParams<{ id: string }>();
    const { selfGameTeam, gtLoaded } = useContext(Context);
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();
    const categoryStore = useCategoryStore();
    const sharedStore = useSharedStore();

    const ref = useRef<ActionType>(null);

    useEffect(() => {
        ref?.current?.reload();
    }, [sharedStore?.refresh, gtLoaded]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] =
        useState<ChallengeWithStatus>();

    useEffect(() => {
        if (gtLoaded) {
            if (!selfGameTeam || !selfGameTeam?.is_allowed) {
                navigate(`/games/${id}`);
            }
        }
    }, [selfGameTeam, gtLoaded]);

    const columns: Array<ProColumnType<ChallengeWithStatus>> = [
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            width: "15%",
            ellipsis: {
                showTitle: false,
            },
            align: "center",
        },
        {
            title: "分类",
            dataIndex: "category",
            key: "category",
            width: "10%",
            search: false,
            align: "center",
            renderText: (categoryId: number) => {
                const category = categoryStore?.getCategory(categoryId);
                return (
                    <Flex
                        align={"center"}
                        justify={"center"}
                        gap={12}
                        css={css`
                            color: ${category?.color};
                        `}
                    >
                        {category?.icon}
                        {category?.name?.toUpperCase()}
                    </Flex>
                );
            },
            filtered: true,
            filterMultiple: false,
            filters: categoryStore?.categories?.map((category) => ({
                text: category?.name?.toUpperCase(),
                value: Number(category?.id),
            })),
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description",
            width: "30%",
            search: false,
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "",
            key: "action",
            width: "10%",
            search: false,
            hideInSetting: true,
            render: (_, data) => (
                <Flex gap={12} justify={"center"}>
                    <Button
                        variant={"text"}
                        color={data.is_solved ? "primary" : "default"}
                        css={css`
                            display: flex;
                            gap: 12px;
                        `}
                        onClick={() => {
                            setSelectedChallenge(data);
                            setModalOpen(true);
                        }}
                    >
                        <PlayCircleLinear />
                        {data.is_solved ? "已完成" : "挑战"}
                    </Button>
                </Flex>
            ),
        },
    ];

    return (
        <>
            <Layout>
                <Content
                    css={css`
                        padding: 2rem;
                    `}
                >
                    <ProTable<ChallengeWithStatus>
                        ghost
                        columns={columns}
                        sticky={{
                            offsetHeader: 64,
                        }}
                        search={false}
                        toolBarRender={false}
                        actionRef={ref}
                        bordered
                        pagination={{
                            pageSizeOptions: [12, 24, 48, 100],
                            defaultPageSize: 12,
                            showSizeChanger: true,
                        }}
                        rowKey={(item) => item.id || nanoid()}
                        request={async (params, _sort, filter) => {
                            if (!gtLoaded) return {};

                            const getGameChallengesResponse =
                                await getGameChallenges({
                                    game_id: Number(id),
                                    category: filter.category
                                        ? Number(filter.category[0])
                                        : undefined,
                                    is_enabled: true,
                                    page: params.current,
                                    size: params.pageSize,
                                });

                            const getChallengeStatusResponse =
                                await getChallengeStatus({
                                    challenge_ids:
                                        getGameChallengesResponse?.data?.map(
                                            (challenge) =>
                                                challenge.challenge_id!
                                        )!,
                                    team_id: selfGameTeam?.team_id!,
                                    game_id: selfGameTeam?.game_id!,
                                });

                            const data = getGameChallengesResponse?.data?.map(
                                (gameChallenge) => {
                                    const challengeStatus =
                                        getChallengeStatusResponse?.data?.[
                                            gameChallenge.challenge_id!
                                        ];
                                    return {
                                        ...gameChallenge.challenge,
                                        is_solved: challengeStatus?.is_solved,
                                        solved_times:
                                            challengeStatus?.solved_times,
                                        bloods: challengeStatus?.bloods,
                                    };
                                }
                            );

                            return {
                                data: data,
                                success: getGameChallengesResponse.code === 200,
                                total: getGameChallengesResponse.total,
                            };
                        }}
                    />
                </Content>
                <Sider
                    width={"25%"}
                    css={css`
                        background-color: ${token.colorBgLayout};
                        box-shadow: ${token.boxShadowTertiary};
                    `}
                >
                    <Flex
                        gap={20}
                        css={css`
                            margin: 2rem 2rem;
                            padding: 2rem;
                            background-color: ${token.colorBgContainer};
                            border-radius: ${token.borderRadiusLG}px;
                            box-shadow: ${token.boxShadowTertiary};
                        `}
                        align={"center"}
                    >
                        <Flex gap={15} align={"center"}>
                            <Avatar
                                size={49}
                                src={`/api/teams/${selfGameTeam?.team_id}/avatar`}
                            />
                            <Flex vertical gap={5}>
                                <span
                                    css={css`
                                        text-overflow: ellipsis;
                                        flex-wrap: nowrap;
                                        overflow: hidden;
                                        font-size: 1rem;
                                        font-weight: 600;
                                    `}
                                >
                                    {selfGameTeam?.team?.name}
                                </span>
                                <span
                                    css={css`
                                        font-size: 0.75rem;
                                        color: ${token.colorTextDescription};
                                    `}
                                >
                                    {`# ${selfGameTeam?.team?.id
                                        ?.toString(16)
                                        .padStart(6, "0")}`}
                                </span>
                            </Flex>
                        </Flex>
                        <Flex
                            vertical
                            gap={5}
                            align={"end"}
                            css={css`
                                flex: 1;
                            `}
                        >
                            <Flex gap={5} align={"center"} wrap={"nowrap"}>
                                <StarsMinimalisticLinear />
                                <span>分数</span>
                                <span>{selfGameTeam?.pts}</span>
                            </Flex>
                            <Flex gap={5} align={"center"} wrap={"nowrap"}>
                                <CupStarLinear />
                                <span>排名</span>
                                <span>{selfGameTeam?.rank}</span>
                            </Flex>
                        </Flex>
                    </Flex>
                </Sider>
            </Layout>
            <Modal
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
                footer={null}
                closable={false}
                width={screens.md ? "40vw" : "90vw"}
                destroyOnClose
            >
                <ChallengeModal
                    challenge={selectedChallenge}
                    status={selectedChallenge}
                    gameTeam={selfGameTeam}
                />
            </Modal>
        </>
    );
}
