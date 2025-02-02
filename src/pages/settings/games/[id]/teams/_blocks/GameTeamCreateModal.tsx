import { createGameTeam } from "@/api/game";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { css } from "@emotion/react";
import { Avatar, Button, Flex, Grid, Modal, theme } from "antd";
import { useContext, useState } from "react";
import { Context } from "../../context";
import { useNotificationStore } from "@/stores/notification";
import TeamSelectModal from "./TeamSelectModal";
import { useSharedStore } from "@/stores/shared";
import { Team } from "@/models/team";

export interface GameTeamCreateModalProps {
    onClose: () => void;
}

export default function GameTeamCreateModal(props: GameTeamCreateModalProps) {
    const { onClose } = props;
    const screens = Grid.useBreakpoint();
    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const { token } = theme.useToken();
    const { game } = useContext(Context);

    const [teamSelectModalOpen, setTeamSelectModalOpen] = useState(false);

    const [selectedTeam, setSelectedTeam] = useState<Team>();
    const [loading, setLoading] = useState(false);

    function handleCreateGameTeam() {
        setLoading(true);
        createGameTeam({
            game_id: game?.id!,
            team_id: selectedTeam?.id!,
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "添加成功",
                        description: `团队 ${selectedTeam?.name} 已成功添加到比赛中`,
                    });
                    onClose();
                    sharedStore.setRefresh();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <Flex
                vertical
                gap={16}
                css={css`
                    padding: 1rem 0;
                `}
            >
                <Button
                    onClick={() => setTeamSelectModalOpen(true)}
                    size={"large"}
                    css={css`
                        height: 4rem;
                    `}
                >
                    {selectedTeam ? (
                        <Flex gap={8} align={"center"}>
                            <Avatar
                                src={`/api/teams/${selectedTeam?.id}/avatar`}
                            />
                            <span>{selectedTeam?.name}</span>
                            <span
                                css={css`
                                    color: ${token.colorTextSecondary};
                                `}
                            >{`<${selectedTeam?.id}>`}</span>
                        </Flex>
                    ) : (
                        <span>选择团队</span>
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
                        onClick={handleCreateGameTeam}
                    >
                        确定
                    </Button>
                </Flex>
            </Flex>
            <Modal
                centered
                footer={null}
                closable={false}
                width={screens.md ? "30vw" : "80vw"}
                destroyOnClose
                open={teamSelectModalOpen}
                onCancel={() => setTeamSelectModalOpen(false)}
                onClose={() => setTeamSelectModalOpen(false)}
                title={"选择团队"}
            >
                <TeamSelectModal
                    onClose={() => setTeamSelectModalOpen(false)}
                    onConfirm={(team) => setSelectedTeam(team)}
                />
            </Modal>
        </>
    );
}
