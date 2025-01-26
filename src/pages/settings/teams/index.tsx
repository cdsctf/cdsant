import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import {
    ActionType,
    nanoid,
    ProColumnType,
    ProTable,
} from "@ant-design/pro-components";
import { css } from "@emotion/react";
import { Button, Flex, Grid, Avatar, Popconfirm, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import TrashBinTrashOutline from "~icons/solar/trash-bin-trash-outline";
import PenNewSquareLinear from "~icons/solar/pen-new-square-linear";
import AddSquareLinear from "~icons/solar/add-square-linear";
import TeamCreateModal from "./_blocks/TeamCreateModal";
import { deleteTeam, getTeams } from "@/api/team";
import { Team } from "@/models/team";
import { User } from "@/models/user";

export default function () {
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [teamCreateModalOpen, setTeamCreateModalOpen] =
        useState<boolean>(false);

    const ref = useRef<ActionType>(null);

    useEffect(() => {
        ref?.current?.reload();
    }, [sharedStore?.refresh]);

    const columns: Array<ProColumnType<Team>> = [
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
            search: false,
            render: (_, data) => {
                return <Avatar src={`/api/teams/${data.id}/avatar`} />;
            },
        },
        {
            title: "团队名",
            dataIndex: "name",
            key: "name",
            width: "10%",
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "标语",
            dataIndex: "slogan",
            key: "slogan",
            width: "10%",
            search: false,
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
            title: "成员",
            dataIndex: "users",
            key: "users",
            width: "10%",
            search: false,
            renderText: (users: Array<User>) => {
                return (
                    <Avatar.Group
                        max={{
                            count: 3,
                        }}
                    >
                        {users.map((user) => (
                            <Tooltip title={user?.username}>
                                <Avatar
                                    key={nanoid()}
                                    src={`/api/users/${user.id}/avatar`}
                                />
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                );
            },
        },
        {
            title: "创建于",
            dataIndex: "created_at",
            key: "created_at",
            width: "10%",
            search: false,
            sortDirections: ["descend", "ascend"],
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
                        setTeamCreateModalOpen(true);
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
                            navigate(`/settings/teams/${data.id}`);
                        }}
                    />
                    <Popconfirm
                        title={"删除团队"}
                        description={`你确定要删除团队 ${data.name} 吗？`}
                        onConfirm={() => {
                            deleteTeam({
                                id: Number(data.id),
                            }).then(() => {
                                notificationStore?.api?.success({
                                    message: "删除成功",
                                    description: `团队 ${data.name} 已删除`,
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
                <ProTable<Team>
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
                    request={async (params, sort, _filter) => {
                        const res = await getTeams({
                            id: params.id ? params.id : undefined,
                            name: params.name ? params.name : undefined,
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
            <TeamCreateModal
                open={teamCreateModalOpen}
                onClose={() => setTeamCreateModalOpen(false)}
            />
        </>
    );
}
