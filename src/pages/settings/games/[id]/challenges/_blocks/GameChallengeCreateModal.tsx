import { createGameChallenge } from "@/api/game";
import { Challenge } from "@/models/challenge";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { useCategoryStore } from "@/stores/category";
import { css } from "@emotion/react";
import { Button, Flex, Grid, Modal, theme } from "antd";
import { useContext, useState } from "react";
import { Context } from "../../context";
import { useNotificationStore } from "@/stores/notification";
import ChallengeSelectModal from "./ChallengeSelectModal";
import { useSharedStore } from "@/stores/shared";

export interface GameChallengeCreateModalProps {
    onClose: () => void;
}

export default function GameChallengeCreateModal(
    props: GameChallengeCreateModalProps
) {
    const { onClose } = props;
    const categoryStore = useCategoryStore();
    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();
    const { game } = useContext(Context);

    const [challengeSelectModalOpen, setChallengeSelectModalOpen] =
        useState(false);

    const [selectedChallenge, setSelectedChallenge] = useState<Challenge>();
    const [loading, setLoading] = useState(false);

    function handleCreateGameChallenge() {
        setLoading(true);
        createGameChallenge({
            game_id: game?.id!,
            challenge_id: selectedChallenge?.id!,
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "添加成功",
                        description: `题目 ${selectedChallenge?.title} 已成功添加到比赛中`,
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
                    onClick={() => setChallengeSelectModalOpen(true)}
                    size={"large"}
                    css={css`
                        height: 4rem;
                    `}
                >
                    {selectedChallenge ? (
                        <Flex gap={8} align={"center"}>
                            <Flex
                                align={"center"}
                                css={css`
                                    color: ${categoryStore?.getCategory(
                                        selectedChallenge?.category
                                    )?.color};
                                `}
                            >
                                {
                                    categoryStore?.getCategory(
                                        selectedChallenge?.category
                                    )?.icon
                                }
                            </Flex>
                            <span>{selectedChallenge?.title}</span>
                            <span
                                css={css`
                                    color: ${token.colorTextSecondary};
                                `}
                            >{`<${selectedChallenge?.id}>`}</span>
                        </Flex>
                    ) : (
                        <span>选择题目</span>
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
                        onClick={handleCreateGameChallenge}
                    >
                        确定
                    </Button>
                </Flex>
            </Flex>
            <Modal
                centered
                footer={null}
                closable={false}
                width={screens.md ? "50vw" : "80vw"}
                destroyOnClose
                open={challengeSelectModalOpen}
                onCancel={() => setChallengeSelectModalOpen(false)}
                onClose={() => setChallengeSelectModalOpen(false)}
                title={"选择题目"}
            >
                <ChallengeSelectModal
                    onClose={() => setChallengeSelectModalOpen(false)}
                    onConfirm={(challenge) => setSelectedChallenge(challenge)}
                />
            </Modal>
        </>
    );
}
