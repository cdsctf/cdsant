import { Group, User } from "@/models/user";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import {
    ActionType,
    nanoid,
    ProColumnType,
    ProTable,
} from "@ant-design/pro-components";
import { css } from "@emotion/react";
import { Button, Flex, Grid, Avatar, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import TrashBinTrashOutline from "~icons/solar/trash-bin-trash-outline";
import PenNewSquareLinear from "~icons/solar/pen-new-square-linear";
import AddSquareLinear from "~icons/solar/add-square-linear";
import { deleteUser, getUsers } from "@/api/user";
import UserCreateModal from "./_blocks/UserCreateModal";

export default function () {
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [userCreateModalOpen, setUserCreateModalOpen] =
        useState<boolean>(false);

    const ref = useRef<ActionType>(null);

    useEffect(() => {
        ref?.current?.reload();
    }, [sharedStore?.refresh]);

    const columns: Array<ProColumnType<User>> = [
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
            title: "头像",
            key: "avatar",
            width: "5%",
            align: "center",
            ellipsis: {
                showTitle: false,
            },
            render: (_, data) => {
                return <Avatar src={`/api/users/${data.id}/avatar`} />;
            },
        },
        {
            title: "昵称",
            dataIndex: "nickname",
            key: "nickname",
            width: "10%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            width: "10%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "邮箱",
            dataIndex: "email",
            key: "email",
            width: "10%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "组",
            dataIndex: "group",
            key: "group",
            width: "10%",
            search: false,
            filtered: true,
            filterMultiple: false,
            filters: [
                {
                    text: "管理员",
                    value: Group.Admin,
                },
                {
                    text: "普通用户",
                    value: Group.User,
                },
                {
                    text: "封禁用户",
                    value: Group.Banned,
                },
            ],
            renderText: (group: number) => {
                switch (group) {
                    case Group.Admin:
                        return "管理员";
                    case Group.User:
                        return "普通用户";
                    case Group.Banned:
                        return "封禁用户";
                    default:
                        return "未知";
                }
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
                        setUserCreateModalOpen(true);
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
                        disabled={data.id === 1}
                        onClick={() => {
                            navigate(`/settings/users/${data.id}`);
                        }}
                    />
                    <Popconfirm
                        title={"删除用户"}
                        description={`你确定要删除用户 ${data.username} 吗？`}
                        onConfirm={() => {
                            deleteUser({
                                id: Number(data.id),
                            }).then(() => {
                                notificationStore?.api?.success({
                                    message: "删除成功",
                                    description: `题目 ${data.username} 已删除`,
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
                            disabled={data.id === 1}
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
                <ProTable<User>
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
                        const res = await getUsers({
                            id: params.id ? params.id : undefined,
                            username: params.username
                                ? params.username
                                : undefined,
                            nickname: params.nickname
                                ? params.nickname
                                : undefined,
                            group: filter.group
                                ? (filter.group as unknown as Group)
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
            <UserCreateModal
                open={userCreateModalOpen}
                onClose={() => setUserCreateModalOpen(false)}
            />
        </>
    );
}
