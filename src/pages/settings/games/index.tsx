import { deleteGame, getGames, updateGame } from "@/api/game";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import {
    ActionType,
    nanoid,
    ProColumnType,
    ProTable,
} from "@ant-design/pro-components";
import { css } from "@emotion/react";
import { Button, Flex, Grid, Popconfirm, Switch, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import TrashBinTrashOutline from "~icons/solar/trash-bin-trash-outline";
import PenNewSquareLinear from "~icons/solar/pen-new-square-linear";
import AddSquareLinear from "~icons/solar/add-square-linear";
import { Game } from "@/models/game";
import GameCreateModal from "./_blocks/GameCreateModal";
import { GamePoster } from "@/components/widgets/GamePoster";

export default function () {
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [gameCreateModalOpen, setGameCreateModalOpen] =
        useState<boolean>(false);

    const ref = useRef<ActionType>(null);

    useEffect(() => {
        ref?.current?.reload();
    }, [sharedStore?.refresh]);

    const columns: Array<ProColumnType<Game>> = [
        {
            title: "可见",
            dataIndex: "is_enabled",
            key: "is_enabled",
            width: "5%",
            align: "center",
            ellipsis: {
                showTitle: false,
            },
            search: false,
            filtered: true,
            filterMultiple: false,
            filters: [
                {
                    text: "可见",
                    value: true,
                },
                {
                    text: "隐藏",
                    value: false,
                },
            ],
            renderText: (isPublic, record) => {
                return (
                    <Switch
                        value={Boolean(isPublic)}
                        size={"small"}
                        onChange={(checked) => {
                            updateGame({
                                id: Number(record.id),
                                is_enabled: checked,
                            })
                                .then((_) => {
                                    notificationStore?.api?.success({
                                        message: "更新成功",
                                        description: `比赛 ${record.title} 已设置为 ${checked ? "可见" : "隐藏"}`,
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
            dataIndex: "id",
            key: "id",
            width: "5%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "海报",
            key: "poster",
            width: "15%",
            search: false,
            render: (_, data) => {
                return (
                    <div
                        css={css`
                            height: 100%;
                            aspect-ratio: 16/9;
                        `}
                    >
                        <GamePoster gameId={data.id!} />
                    </div>
                );
            },
        },
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            width: "15%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "创建于",
            dataIndex: "created_at",
            key: "created_at",
            width: "15%",
            search: false,
            sortDirections: ["descend", "ascend"],
            defaultSortOrder: "descend",
            sorter: true,
            renderText: (created_at: number) => {
                return new Date(created_at * 1000).toLocaleString();
            },
        },
        {
            title: "状态",
            key: "status",
            width: "10%",
            align: "center",
            search: false,
            sortDirections: ["descend", "ascend"],
            defaultSortOrder: "descend",
            render: (_, data) => {
                const started_at = new Date(Number(data?.started_at) * 1000);
                const ended_at = new Date(Number(data?.ended_at) * 1000);
                const now = new Date();

                if (started_at > now) {
                    return <Tag color={"blue"}>未开始</Tag>;
                }

                if (ended_at < now) {
                    return <Tag color={"red"}>已结束</Tag>;
                }

                return <Tag color={"green"}>进行中</Tag>;
            },
        },
        {
            title: (
                <Button
                    type={"text"}
                    size={"small"}
                    icon={<AddSquareLinear />}
                    onClick={() => {
                        setGameCreateModalOpen(true);
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
                    <Button
                        size={"small"}
                        type={"text"}
                        icon={<PenNewSquareLinear />}
                        onClick={() => {
                            navigate(`/settings/games/${data.id}`);
                        }}
                    />
                    <Popconfirm
                        title={"删除比赛"}
                        description={`你确定要删除比赛 ${data.title} 吗？`}
                        onConfirm={() => {
                            deleteGame({
                                id: Number(data.id),
                            }).then(() => {
                                notificationStore?.api?.success({
                                    message: "删除成功",
                                    description: `比赛 ${data.title} 已删除`,
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
                            icon={<TrashBinTrashOutline />}
                        />
                    </Popconfirm>
                </Flex>
            ),
        },
    ];

    return (
        <>
            <div
                css={css`
                    padding: 3rem ${screens.lg ? "8rem" : "1rem"};
                `}
            >
                <ProTable<Game>
                    columns={columns}
                    sticky={{
                        offsetHeader: 64,
                    }}
                    toolBarRender={false}
                    bordered
                    pagination={{
                        pageSizeOptions: [12, 24, 48, 100],
                        defaultPageSize: 12,
                        showSizeChanger: true,
                    }}
                    actionRef={ref}
                    rowKey={(item) => item.id || nanoid()}
                    tableStyle={{
                        padding: "1rem",
                    }}
                    request={async (params, sort, filter) => {
                        const res = await getGames({
                            title: params.title ? params.title : undefined,
                            is_enabled: filter.is_enabled
                                ? Boolean(filter.is_enabled?.[0])
                                : undefined,
                            page: params.current,
                            size: params.pageSize,
                            sorts: Object.keys(sort)
                                .map((key) => {
                                    if (sort[key] === "ascend") {
                                        return `${key}`;
                                    } else if (sort[key] === "descend") {
                                        return `-${key}`;
                                    } else {
                                        return null;
                                    }
                                })
                                .join(","),
                        });

                        return {
                            data: res.data,
                            success: res.code === 200,
                            total: res.total,
                        };
                    }}
                />
            </div>
            <GameCreateModal
                open={gameCreateModalOpen}
                onClose={() => setGameCreateModalOpen(false)}
            />
        </>
    );
}
