import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Modal, Grid, Flex, Button, Avatar, theme } from "antd";
import { useContext, useEffect, useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { createTeamUser } from "@/api/team";
import { Context } from "../../context";
import UserSelectModal from "./UserSelectModal";
import { User } from "@/models/user";

export interface UserTeamCreateModalProps {
    open: boolean;
    onClose: () => void;
}

export default function UserTeamCreateModal(props: UserTeamCreateModalProps) {
    const { open, onClose } = props;

    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const screens = Grid.useBreakpoint();
    const { token } = theme.useToken();

    const { team } = useContext(Context);

    const [loading, setLoading] = useState<boolean>(false);
    const [userSelectModalOpen, setUserSelectModalOpen] =
        useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User>();

    function handleUserTeamCreate() {
        setLoading(true);
        createTeamUser({
            team_id: Number(team?.id),
            user_id: selectedUser?.id!,
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "添加成功",
                        description: `团队成员添加成功`,
                    });
                    sharedStore.setRefresh();
                    onClose();
                }

                if (res.code !== 200) {
                    notificationStore?.api?.error({
                        message: "添加失败",
                        description: res.msg,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (open) {
            setSelectedUser(undefined);
        }
    }, [open]);

    return (
        <Modal
            centered
            footer={null}
            closable={false}
            width={screens.md ? "40vw" : "90vw"}
            destroyOnClose
            open={open}
            onCancel={onClose}
            onClose={onClose}
            title={"添加团队成员"}
        >
            <Flex
                vertical
                gap={16}
                css={css`
                    padding: 1rem 0;
                `}
            >
                <Button
                    onClick={() => setUserSelectModalOpen(true)}
                    size={"large"}
                    css={css`
                        height: 4rem;
                    `}
                >
                    {selectedUser ? (
                        <Flex gap={8} align={"center"}>
                            <Avatar
                                src={`/api/users/${selectedUser?.id}/avatar`}
                            />
                            <span>{selectedUser?.username}</span>
                            <span
                                css={css`
                                    color: ${token.colorTextSecondary};
                                `}
                            >{`<${selectedUser?.email}>`}</span>
                        </Flex>
                    ) : (
                        <span>选择用户</span>
                    )}
                </Button>
                <Flex
                    css={css`
                        display: flex;
                        justify-content: flex-end;
                    `}
                >
                    <Button
                        size={"large"}
                        type={"primary"}
                        loading={loading}
                        icon={<CheckCircleLinear />}
                        onClick={handleUserTeamCreate}
                    >
                        确定
                    </Button>
                </Flex>
            </Flex>
            <UserSelectModal
                open={userSelectModalOpen}
                onClose={() => setUserSelectModalOpen(false)}
                onConfirm={(user) => setSelectedUser(user)}
            />
        </Modal>
    );
}
