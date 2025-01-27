import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import { Button, Flex, Popconfirm, Switch } from "antd";
import { nanoid, ProColumnType, ProTable } from "@ant-design/pro-components";
import AddSquareLinear from "~icons/solar/add-square-linear";
import LinkBrokenMinimalisticLinear from "~icons/solar/link-broken-minimalistic-linear";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { GameChallenge } from "@/models/game_challenge";
import { deleteGameChallenge, getGameChallenges } from "@/api/game";
import { css } from "@emotion/react";
import { useCategoryStore } from "@/stores/category";
import PenNewSquareLinear from "~icons/solar/pen-new-square-linear";
import GameChallengeCreateModal from "./_blocks/GameChallengeCreateModal";
import GameChallengeUpdateModal from "./_blocks/GameChallengeUpdateModal";

export default function () {
    const { game } = useContext(Context);
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const categoryStore = useCategoryStore();

    const [gameChallenges, setGameChallenges] =
        useState<Array<GameChallenge>>();

    const [gameChallengeCreateModalOpen, setGameChallengeCreateModalOpen] =
        useState<boolean>(false);

    const [selectedGameChallenge, setSelectedGameChallenge] =
        useState<GameChallenge>();
    const [gameChallengeUpdateModalOpen, setGameChallengeUpdateModalOpen] =
        useState<boolean>(false);

    function fetchGameChallenges() {
        getGameChallenges({
            game_id: game?.id,
        }).then((res) => {
            setGameChallenges(res.data);
        });
    }

    useEffect(() => {
        if (game) {
            fetchGameChallenges();
        }
    }, [game, sharedStore.refresh]);

    const columns: Array<ProColumnType<GameChallenge>> = [
        {
            title: "启用",
            dataIndex: "is_enabled",
            key: "is_enabled",
            align: "center",
            width: "2%",
            renderText: (is_enabled: boolean) => {
                return <Switch checked={is_enabled} size={"small"} />;
            },
        },
        {
            title: "ID",
            dataIndex: ["challenge", "id"],
            key: "id",
            width: "5%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "标题",
            dataIndex: ["challenge", "title"],
            key: "title",
            width: "5%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "分类",
            dataIndex: ["challenge", "category"],
            key: "category",
            width: "5%",
            renderText: (categoryId: number) => {
                const category = categoryStore?.getCategory(categoryId);
                return (
                    <Flex
                        align={"center"}
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
        },
        {
            title: "当前分值",
            dataIndex: "pts",
            key: "pts",
            width: "2%",
        },
        {
            title: (
                <Button
                    type={"text"}
                    size={"small"}
                    icon={<AddSquareLinear />}
                    onClick={() => {
                        setGameChallengeCreateModalOpen(true);
                    }}
                />
            ),
            align: "center",
            key: "action",
            width: "5%",
            search: false,
            hideInSetting: true,
            render: (_, data) => (
                <Flex gap={12} justify={"center"} align={"center"}>
                    <Button
                        size={"small"}
                        type={"text"}
                        icon={<PenNewSquareLinear />}
                        onClick={() => {
                            setSelectedGameChallenge(data);
                            setGameChallengeUpdateModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title={"删除题目"}
                        description={`你确定要删除题目 ${data?.challenge?.title} 吗？`}
                        onConfirm={() => {
                            deleteGameChallenge({
                                game_id: Number(game?.id),
                                challenge_id: data?.challenge_id,
                            }).then(() => {
                                notificationStore?.api?.success({
                                    message: "删除成功",
                                    description: `题目 ${data?.challenge?.title} 已从比赛中删除`,
                                });
                                sharedStore?.setRefresh();
                            });
                        }}
                        okText={"确定"}
                        showCancel={false}
                    >
                        <Button
                            size={"small"}
                            type={"text"}
                            danger
                            icon={<LinkBrokenMinimalisticLinear />}
                        />
                    </Popconfirm>
                </Flex>
            ),
        },
    ];

    return (
        <div>
            <ProTable<GameChallenge>
                columns={columns}
                sticky={{
                    offsetHeader: 64,
                }}
                toolBarRender={false}
                bordered
                search={false}
                pagination={{
                    pageSizeOptions: [10, 20],
                    defaultPageSize: 10,
                    showSizeChanger: true,
                }}
                rowKey={(item) =>
                    `${item.game_id}/${item.challenge_id}` || nanoid()
                }
                tableStyle={{
                    padding: "1rem",
                }}
                dataSource={gameChallenges}
            />
            <GameChallengeCreateModal
                open={gameChallengeCreateModalOpen}
                onClose={() => setGameChallengeCreateModalOpen(false)}
            />
            <GameChallengeUpdateModal
                gameChallenge={selectedGameChallenge}
                open={gameChallengeUpdateModalOpen}
                onClose={() => setGameChallengeUpdateModalOpen(false)}
            />
        </div>
    );
}
