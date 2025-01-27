import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context";
import { Alert, Avatar, Button, Flex, Popconfirm, Switch } from "antd";
import {
    ActionType,
    nanoid,
    ProColumnType,
    ProTable,
} from "@ant-design/pro-components";
import AddSquareLinear from "~icons/solar/add-square-linear";
import LinkBrokenMinimalisticLinear from "~icons/solar/link-broken-minimalistic-linear";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { GameChallenge } from "@/models/game_challenge";
import { deleteGameTeam, getGameTeams, updateGameTeam } from "@/api/game";
import { GameTeam } from "@/models/game_team";
import GameTeamCreateModal from "./_blocks/GameTeamCreateModal";

export default function () {
    const { game } = useContext(Context);
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();

    const [gameTeamCreateModalOpen, setGameTeamCreateModalOpen] =
        useState<boolean>(false);

    const ref = useRef<ActionType>(null);

    useEffect(() => {
        ref?.current?.reload();
    }, [game, sharedStore?.refresh]);

    const columns: Array<ProColumnType<GameTeam>> = [
        {
            title: "允许",
            dataIndex: "is_allowed",
            key: "is_allowed",
            align: "center",
            width: "5%",
            renderText: (is_allowed: boolean, data: GameTeam) => {
                return (
                    <Switch
                        checked={is_allowed}
                        size={"small"}
                        onChange={(checked) => {
                            updateGameTeam({
                                team_id: data.team_id,
                                game_id: game?.id,
                                is_allowed: checked,
                            })
                                .then((_) => {
                                    notificationStore?.api?.success({
                                        message: "更新成功",
                                        description: `比赛团队 ${data.team?.name} 已设置为 ${checked ? "允许参赛" : "禁止参赛"}`,
                                    });
                                })
                                .finally(() => {
                                    sharedStore?.setRefresh();
                                });
                        }}
                    />
                );
            },
        },
        {
            title: "ID",
            dataIndex: ["team", "id"],
            key: "id",
            width: "10%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "头像",
            key: "avatar",
            width: "10%",
            align: "center",
            search: false,
            render: (_, data) => {
                return <Avatar src={`/api/teams/${data?.team_id}/avatar`} />;
            },
        },
        {
            title: "团队名",
            dataIndex: ["team", "name"],
            key: "name",
            width: "30%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "当前分值",
            dataIndex: "pts",
            key: "pts",
            width: "10%",
        },
        {
            title: "排名",
            dataIndex: "rank",
            key: "rank",
            width: "10%",
        },
        {
            title: (
                <Button
                    type={"text"}
                    size={"small"}
                    icon={<AddSquareLinear />}
                    onClick={() => {
                        setGameTeamCreateModalOpen(true);
                    }}
                />
            ),
            align: "center",
            key: "action",
            width: "10%",
            search: false,
            hideInSetting: true,
            render: (_, data) => (
                <Flex gap={12} justify={"center"} align={"center"}>
                    <Popconfirm
                        title={"删除比赛团队"}
                        description={`你确定要删除比赛团队 ${data?.team?.name} 吗？`}
                        onConfirm={() => {
                            deleteGameTeam({
                                game_id: Number(game?.id),
                                team_id: Number(data?.team_id),
                            }).then(() => {
                                notificationStore?.api?.success({
                                    message: "删除成功",
                                    description: `团队 ${data?.team?.name} 已从比赛中删除`,
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
            <Alert
                showIcon
                message={
                    "若需批量添加比赛团队，建议阅读 API 文档，使用脚本实现。"
                }
            />
            <ProTable<GameChallenge>
                columns={columns}
                sticky={{
                    offsetHeader: 64,
                }}
                toolBarRender={false}
                bordered
                search={false}
                actionRef={ref}
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
                request={async (_params, _sort, _filter) => {
                    if (!game?.id) return {};

                    const res = await getGameTeams({
                        game_id: Number(game?.id),
                    });

                    return {
                        data: res.data,
                        success: res.code === 200,
                        total: res.total,
                    };
                }}
            />
            <GameTeamCreateModal
                open={gameTeamCreateModalOpen}
                onClose={() => setGameTeamCreateModalOpen(false)}
            />
        </div>
    );
}
