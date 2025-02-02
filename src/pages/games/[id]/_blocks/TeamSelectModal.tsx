import { createGameTeam } from "@/api/game";
import { getTeams } from "@/api/team";
import { Team } from "@/models/team";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Avatar, Button, Flex, Input, Space, theme } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export interface TeamSelectModalProps {
    onClose: () => void;
}

export default function TeamSelectModal(props: TeamSelectModalProps) {
    const { onClose } = props;
    const { id: game_id } = useParams();
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const { token } = theme.useToken();

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [options, setOptions] = useState<Array<Team>>();

    function handleCreateGameTeam(team_id: number) {
        createGameTeam({
            game_id: Number(game_id),
            team_id: team_id,
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "成功",
                });
                sharedStore?.setRefresh();
                onClose();
            }

            if (res.code === 400) {
                notificationStore?.api?.success({
                    message: "发生了错误",
                    description: res.msg,
                });
            }
        });
    }

    function fetchTeams() {
        getTeams({
            id: Number(id) || undefined,
            name: name,
            user_id: authStore?.user?.id,
            page: 1,
            size: 10,
        }).then((res) => {
            setOptions(res?.data);
        });
    }

    useEffect(() => {
        fetchTeams();
    }, [name, id]);

    return (
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
                            onClick={() =>
                                handleCreateGameTeam(Number(team?.id))
                            }
                        />
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}
