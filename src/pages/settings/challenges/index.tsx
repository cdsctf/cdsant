import {
    deleteChallenge,
    getChallenges,
    updateChallenge,
} from "@/api/challenge";
import { Challenge } from "@/models/challenge";
import { useCategoryStore } from "@/stores/category";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import {
    ActionType,
    nanoid,
    ProColumnType,
    ProTable,
} from "@ant-design/pro-components";
import { css } from "@emotion/react";
import { Button, Flex, Grid, Modal, Popconfirm, Switch } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import TrashBinTrashOutline from "~icons/solar/trash-bin-trash-outline";
import PenNewSquareLinear from "~icons/solar/pen-new-square-linear";
import AddSquareLinear from "~icons/solar/add-square-linear";
import ChallengeCreateModal from "./_blocks/ChallengeCreateModal";

export default function () {
    const categoryStore = useCategoryStore();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [challengeCreateModalOpen, setChallengeCreateModalOpen] =
        useState<boolean>(false);

    const ref = useRef<ActionType>(null);

    useEffect(() => {
        ref?.current?.reload();
    }, [sharedStore?.refresh]);

    const columns: Array<ProColumnType<Challenge>> = [
        {
            title: "公开",
            dataIndex: "is_public",
            key: "is_public",
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
                    text: "公开",
                    value: true,
                },
                {
                    text: "私密",
                    value: false,
                },
            ],
            renderText: (isPublic, record) => {
                return (
                    <Switch
                        value={Boolean(isPublic)}
                        size={"small"}
                        onChange={(checked) => {
                            updateChallenge({
                                id: record.id,
                                is_public: checked,
                            })
                                .then((_) => {
                                    notificationStore?.api?.success({
                                        message: "更新成功",
                                        description: `题目 ${record.title} 已设置为 ${checked ? "公开" : "私密"}`,
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
            width: "10%",
            ellipsis: {
                showTitle: false,
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
            title: "分类",
            dataIndex: "category",
            key: "category",
            width: "10%",
            search: false,
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
            title: (
                <Button
                    type={"text"}
                    size={"small"}
                    icon={<AddSquareLinear />}
                    onClick={() => {
                        setChallengeCreateModalOpen(true);
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
                            navigate(`/settings/challenges/${data.id}`);
                        }}
                    />
                    <Popconfirm
                        title={"删除题目"}
                        description={`你确定要删除题目 ${data.title} 吗？`}
                        onConfirm={() => {
                            deleteChallenge({
                                id: data.id,
                            }).then(() => {
                                notificationStore?.api?.success({
                                    message: "删除成功",
                                    description: `题目 ${data.title} 已删除`,
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
                <ProTable<Challenge>
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
                        const res = await getChallenges({
                            title: params.title ? params.title : undefined,
                            is_public: filter.is_public
                                ? Boolean(filter.is_public?.[0])
                                : undefined,
                            category: filter.category
                                ? Number(filter.category[0])
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
                            is_desensitized: false,
                        });

                        return {
                            data: res.data,
                            success: res.code === 200,
                            total: res.total,
                        };
                    }}
                />
            </div>
            <Modal
                centered
                footer={null}
                closable={false}
                width={screens.md ? "40vw" : "90vw"}
                destroyOnClose
                open={challengeCreateModalOpen}
                onCancel={() => setChallengeCreateModalOpen(false)}
                onClose={() => setChallengeCreateModalOpen(false)}
                title={"创建题目"}
            >
                <ChallengeCreateModal
                    onClose={() => setChallengeCreateModalOpen(false)}
                />
            </Modal>
        </>
    );
}
