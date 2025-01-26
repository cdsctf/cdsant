import { getUsers } from "@/api/user";
import { User } from "@/models/user";
import { css } from "@emotion/react";
import { Avatar, Button, Flex, Grid, Input, Modal, theme } from "antd";
import { useEffect, useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export interface UserSelectModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (user: User) => void;
}

export default function UserSelectModal(props: UserSelectModalProps) {
    const { open, onClose, onConfirm } = props;
    const screens = Grid.useBreakpoint();
    const { token } = theme.useToken();

    const [search, setSearch] = useState("");
    const [options, setOptions] = useState<Array<User>>();

    function fetchUsers() {
        getUsers({
            name: search,
            page: 1,
            size: 10,
        }).then((res) => {
            setOptions(res?.data);
        });
    }

    useEffect(() => {
        fetchUsers();
    }, [search]);

    useEffect(() => {
        if (open) {
            setSearch("");
        }
    }, [open]);

    return (
        <Modal
            centered
            footer={null}
            closable={false}
            width={screens.md ? "30vw" : "80vw"}
            destroyOnClose
            open={open}
            onCancel={onClose}
            onClose={onClose}
            title={"选择用户"}
        >
            <Flex vertical gap={16}>
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={"请输入用户名"}
                />
                <Flex vertical gap={16}>
                    {options?.map((user) => (
                        <Flex
                            key={user?.id}
                            justify={"space-between"}
                            align={"center"}
                        >
                            <Flex gap={8} align={"center"}>
                                <Avatar src={`/api/users/${user?.id}/avatar`} />
                                <span>{user?.username}</span>
                                <span
                                    css={css`
                                        color: ${token.colorTextSecondary};
                                    `}
                                >{`<${user?.email}>`}</span>
                            </Flex>
                            <Button
                                type={"text"}
                                icon={<CheckCircleLinear />}
                                onClick={() => {
                                    onConfirm(user);
                                    onClose();
                                }}
                            />
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Modal>
    );
}
