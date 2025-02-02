import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import {
    ActionType,
    nanoid,
    ProColumnType,
    ProTable,
} from "@ant-design/pro-components";
import { css } from "@emotion/react";
import { Button, Flex, Grid, Avatar, Popconfirm, Tooltip, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import PenNewSquareLinear from "~icons/solar/pen-new-square-linear";
import AddSquareLinear from "~icons/solar/add-square-linear";
import HandShakeLinear from "~icons/solar/hand-shake-linear";
import { getTeams } from "@/api/team";
import { Team } from "@/models/team";
import { User } from "@/models/user";
import { useAuthStore } from "@/stores/auth";
import TeamRegisterModal from "./_blocks/TeamRegisterModal";
import TeamJoinModal from "./_blocks/TeamJoinModal";

export default function () {
    const sharedStore = useSharedStore();
    const authStore = useAuthStore();
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [teamRegisterModalOpen, setTeamRegisterModalOpen] =
        useState<boolean>(false);

    const [teamJoinModalOpen, setTeamJoinModalOpen] = useState<boolean>(false);
    const [selectedTeam, setSelectedTeam] = useState<Team>();

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
            title: "成员",
            dataIndex: "users",
            key: "users",
            width: "20%",
            search: false,
            renderText: (users: Array<User>) => {
                return (
                    <Avatar.Group
                        max={{
                            count: 10,
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
            title: (
                <Button
                    type={"text"}
                    size={"small"}
                    icon={<AddSquareLinear />}
                    onClick={() => {
                        setTeamRegisterModalOpen(true);
                    }}
                >
                    注册团队
                </Button>
            ),
            align: "center",
            key: "action",
            width: "10%",
            search: false,
            hideInSetting: true,
            render: (_, data) => (
                <Flex gap={12} justify={"center"} align={"center"}>
                    {data?.users?.some(
                        (user) => user.id === authStore?.user?.id
                    ) ? (
                        <Button
                            size={"small"}
                            type={"text"}
                            icon={<PenNewSquareLinear />}
                            disabled
                        />
                    ) : (
                        <Tooltip title={"申请加入"}>
                            <Button
                                size={"small"}
                                type={"text"}
                                icon={<HandShakeLinear />}
                                onClick={() => {
                                    setSelectedTeam(data);
                                    setTeamJoinModalOpen(true);
                                }}
                            />
                        </Tooltip>
                    )}
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
                <Flex vertical justify={"center"} align={"center"}>
                    <h2
                        css={css`
                            font-size: 2rem;
                        `}
                    >
                        团队广场
                    </h2>
                </Flex>
                <ProTable<Team>
                    columns={columns}
                    sticky={{
                        offsetHeader: 64,
                    }}
                    ghost
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
            <Modal
                centered
                footer={null}
                closable={false}
                width={screens.lg ? "40vw" : "90vw"}
                destroyOnClose
                open={teamRegisterModalOpen}
                onCancel={() => setTeamRegisterModalOpen(false)}
                onClose={() => setTeamRegisterModalOpen(false)}
                title={"注册团队"}
            >
                <TeamRegisterModal
                    onClose={() => setTeamRegisterModalOpen(false)}
                />
            </Modal>
            <Modal
                centered
                footer={null}
                closable={false}
                width={screens.lg ? "40vw" : "90vw"}
                destroyOnClose
                open={teamJoinModalOpen}
                onCancel={() => setTeamJoinModalOpen(false)}
                onClose={() => setTeamJoinModalOpen(false)}
                title={`加入团队 ${selectedTeam?.name}`}
            >
                <TeamJoinModal
                    team={selectedTeam}
                    onClose={() => setTeamJoinModalOpen(false)}
                />
            </Modal>
        </>
    );
}
