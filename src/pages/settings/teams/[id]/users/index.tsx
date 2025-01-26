import { useContext, useState } from "react";
import { Context } from "../context";
import { Alert, Avatar, Button, Flex, Popconfirm } from "antd";
import { nanoid, ProColumnType, ProTable } from "@ant-design/pro-components";
import { User } from "@/models/user";
import AddSquareLinear from "~icons/solar/add-square-linear";
import LinkBrokenMinimalisticLinear from "~icons/solar/link-broken-minimalistic-linear";
import { deleteUserTeam } from "@/api/team";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import UserTeamCreateModal from "./_blocks/UserTeamCreateModal";

export default function () {
    const { team } = useContext(Context);
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();

    const [userTeamCreateModalOpen, setUserTeamCreateModalOpen] =
        useState<boolean>(false);

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
            search: false,
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
            title: (
                <Button
                    type={"text"}
                    size={"small"}
                    icon={<AddSquareLinear />}
                    onClick={() => {
                        setUserTeamCreateModalOpen(true);
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
                    <Popconfirm
                        title={"踢出用户"}
                        description={`你确定要踢出用户 ${data.username} 吗？`}
                        onConfirm={() => {
                            deleteUserTeam({
                                team_id: Number(team?.id),
                                user_id: Number(data.id),
                            }).then(() => {
                                notificationStore?.api?.success({
                                    message: "踢出成功",
                                    description: `用户 ${data.username} 已踢出`,
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
                message={"若需批量添加成员，建议阅读 API 文档，使用脚本实现。"}
            />
            <ProTable<User>
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
                rowKey={(item) => item.id || nanoid()}
                tableStyle={{
                    padding: "1rem",
                }}
                dataSource={team?.users}
            />
            <UserTeamCreateModal
                open={userTeamCreateModalOpen}
                onClose={() => setUserTeamCreateModalOpen(false)}
            />
        </div>
    );
}
