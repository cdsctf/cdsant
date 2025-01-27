import { getTeams } from "@/api/team";
import { Team } from "@/models/team";
import { css } from "@emotion/react";
import { Avatar, Button, Flex, Grid, Input, Modal, Space, theme } from "antd";
import { useEffect, useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export interface TeamSelectModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (team: Team) => void;
}

export default function TeamSelectModal(props: TeamSelectModalProps) {
    const { open, onClose, onConfirm } = props;
    const screens = Grid.useBreakpoint();
    const { token } = theme.useToken();

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [options, setOptions] = useState<Array<Team>>();

    function fetchTeams() {
        getTeams({
            id: Number(id) || undefined,
            name: name,
            page: 1,
            size: 10,
        }).then((res) => {
            setOptions(res?.data);
        });
    }

    useEffect(() => {
        fetchTeams();
    }, [name, id]);

    useEffect(() => {
        if (open) {
            setId("");
            setName("");
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
            title={"选择团队"}
        >
            <Flex vertical gap={16}>
                <Space.Compact>
                    <Input
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder={"ID"}
                        css={css`
                            width: 30%;
                        `}
                    />
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={"团队名"}
                    />
                </Space.Compact>
                <Flex vertical gap={16}>
                    {options?.map((team) => (
                        <Flex
                            key={team?.id}
                            justify={"space-between"}
                            align={"center"}
                        >
                            <Flex gap={8} align={"center"}>
                                <Avatar src={`/api/teams/${team?.id}/avatar`} />
                                <span>{team?.name}</span>
                                <span
                                    css={css`
                                        color: ${token.colorTextSecondary};
                                    `}
                                >{`<${team?.id}>`}</span>
                            </Flex>
                            <Button
                                type={"text"}
                                icon={<CheckCircleLinear />}
                                onClick={() => {
                                    onConfirm(team);
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
