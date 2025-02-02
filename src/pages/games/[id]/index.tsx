import { MarkdownRender } from "@/components/utils/MarkdownRender";
import { GamePoster } from "@/components/widgets/GamePoster";
import { css } from "@emotion/react";
import { Flex, theme, Badge, Card, Button, Grid, Modal } from "antd";
import { useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import TeamSelectModal from "./_blocks/TeamSelectModal";
import { Context } from "./context";

export default function () {
    const { id } = useParams();
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();
    const { game, selfGameTeam } = useContext(Context);
    const [teamSelectModalOpen, setTeamSelectModalOpen] =
        useState<boolean>(false);

    const status = useMemo(() => {
        if (!game) return "loading";

        const startedAt = new Date(Number(game.started_at) * 1000);
        const endedAt = new Date(Number(game.ended_at) * 1000);

        if (startedAt > new Date()) return "upcoming";
        if (endedAt < new Date()) return "ended";
        return "ongoing";
    }, [game]);

    return (
        <>
            <Flex
                justify={"center"}
                align={"flex-start"}
                gap={64}
                css={css`
                    padding: 0 15%;
                    flex-direction: row-reverse;
                `}
            >
                {screens.lg && (
                    <div
                        css={css`
                            min-height: calc(100vh - 64px);
                            flex: 1;
                            background-color: ${token.colorBgElevated};
                            box-shadow: ${token.boxShadow};
                            padding: 3rem;
                        `}
                    >
                        <MarkdownRender src={game?.description} />
                    </div>
                )}
                <div
                    css={css`
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;

                        position: sticky;
                        padding: 2rem 0;
                        top: calc(64px + 2rem);
                        left: 0;
                        width: ${screens.lg ? "35%" : "100%"};
                        height: calc(100vh - 64px - 2rem);
                    `}
                >
                    <div
                        css={css`
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            width: 100%;
                        `}
                    >
                        <Flex
                            vertical
                            css={css`
                                width: 100%;
                                aspect-ratio: 16 / 9;
                                border-radius: ${token.borderRadius}px;
                                overflow: hidden;
                                box-shadow: ${token.boxShadow};
                            `}
                        >
                            <GamePoster gameId={game?.id!} />
                        </Flex>
                        <h2
                            css={css`
                                line-height: 1em;
                                font-size: 2em;
                            `}
                        >
                            {game?.title}
                        </h2>
                    </div>
                    <Flex
                        vertical
                        gap={12}
                        css={css`
                            width: 100%;
                        `}
                    >
                        <Badge.Ribbon
                            text={
                                status === "ongoing"
                                    ? "进行中"
                                    : status === "upcoming"
                                      ? "未开始"
                                      : "已结束"
                            }
                            color={
                                status === "ongoing"
                                    ? "green"
                                    : status === "upcoming"
                                      ? "blue"
                                      : "red"
                            }
                        >
                            <Card
                                title={`${new Date(Number(game?.started_at) * 1000).toLocaleString()} → ${new Date(Number(game?.ended_at) * 1000).toLocaleString()}`}
                                size="small"
                                css={css`
                                    width: 100%;
                                `}
                            >
                                {game?.sketch}
                            </Card>
                        </Badge.Ribbon>
                        {!!selfGameTeam ? (
                            <Button
                                variant={"filled"}
                                size={"large"}
                                color={"primary"}
                                disabled={
                                    status !== "ongoing" ||
                                    !selfGameTeam.is_allowed
                                }
                                onClick={() =>
                                    navigate(`/games/${id}/challenges`)
                                }
                            >
                                <span>
                                    作为 {selfGameTeam?.team?.name} 参赛
                                </span>
                                {!selfGameTeam.is_allowed && (
                                    <span>（审核未通过）</span>
                                )}
                            </Button>
                        ) : (
                            <Button
                                variant={"filled"}
                                size={"large"}
                                color={"primary"}
                                onClick={() => setTeamSelectModalOpen(true)}
                            >
                                申请参赛
                            </Button>
                        )}
                    </Flex>
                </div>
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
                title={"选择团队以参与比赛"}
            >
                <TeamSelectModal
                    onClose={() => setTeamSelectModalOpen(false)}
                />
            </Modal>
        </>
    );
}
