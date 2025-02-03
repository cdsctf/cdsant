import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context";
import { Button, Flex, Grid, Modal, Popconfirm } from "antd";
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
import { deleteGameNotice, getGameNotice } from "@/api/game";
import GameNoticeCreateModal from "./_blocks/GameNoticeCreateModal";
import { GameNotice } from "@/models/game_notice";

export default function () {
    const { game } = useContext(Context);
    const screens = Grid.useBreakpoint();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();

    const [gameNoticeCreateModalOpen, setGameNoticeCreateModalOpen] =
        useState<boolean>(false);

    const ref = useRef<ActionType>(null);

    useEffect(() => {
        ref?.current?.reload();
    }, [game, sharedStore?.refresh]);

    const columns: Array<ProColumnType<GameNotice>> = [
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            width: "20%",
            align: "center",
            search: false,
        },
        {
            title: "内容",
            dataIndex: "content",
            key: "content",
            width: "30%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "发布于",
            dataIndex: "created_at",
            key: "created_at",
            width: "20%",
            renderText: (created_at: number) => {
                return new Date(created_at * 1000).toLocaleString();
            },
        },
        {
            title: (
                <Button
                    type={"text"}
                    size={"small"}
                    icon={<AddSquareLinear />}
                    onClick={() => {
                        setGameNoticeCreateModalOpen(true);
                    }}
                />
            ),
            align: "center",
            key: "action",
            width: "20%",
            search: false,
            hideInSetting: true,
            render: (_, data) => (
                <Flex gap={12} justify={"center"} align={"center"}>
                    <Popconfirm
                        title={"删除比赛公告"}
                        description={`你确定要删除比赛公告 ${data?.title} 吗？`}
                        onConfirm={() => {
                            deleteGameNotice({
                                game_id: Number(game?.id),
                                id: Number(data?.id),
                            }).then(() => {
                                notificationStore?.api?.success({
                                    message: "删除成功",
                                    description: `公告 ${data?.title} 已删除`,
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
            <ProTable<GameNotice>
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
                rowKey={(item) => `${item.game_id}/${item.id}` || nanoid()}
                tableStyle={{
                    padding: "1rem",
                }}
                request={async (_params, _sort, _filter) => {
                    if (!game?.id) return {};

                    const res = await getGameNotice({
                        game_id: Number(game?.id),
                    });

                    return {
                        data: res.data,
                        success: res.code === 200,
                        total: res.total,
                    };
                }}
            />
            <Modal
                centered
                footer={null}
                closable={false}
                width={screens.md ? "40vw" : "90vw"}
                destroyOnClose
                open={gameNoticeCreateModalOpen}
                onCancel={() => setGameNoticeCreateModalOpen(false)}
                onClose={() => setGameNoticeCreateModalOpen(false)}
                title={"发布比赛公告"}
            >
                <GameNoticeCreateModal
                    onClose={() => setGameNoticeCreateModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
