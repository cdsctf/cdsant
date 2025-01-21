import { getGames } from "@/api/game";
import { MarkdownRender } from "@/components/utils/MarkdownRender";
import { GamePoster } from "@/components/widgets/GamePoster";
import { Game } from "@/models/game";
import { css } from "@emotion/react";
import { Flex, theme, Badge, Card, Button, Grid } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

export default function () {
    const { id } = useParams();
    const [game, setGame] = useState<Game>();
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();

    const status = useMemo(() => {
        if (!game) return "loading";

        const startedAt = new Date(Number(game.started_at) * 1000);
        const endedAt = new Date(Number(game.ended_at) * 1000);

        if (startedAt > new Date()) return "upcoming";
        if (endedAt < new Date()) return "ended";
        return "ongoing";
    }, [game]);

    function fetchGame() {
        getGames({
            id: Number(id),
        }).then((res) => {
            setGame(res.data?.[0]);
        });
    }

    useEffect(() => {
        fetchGame();
    }, []);

    return (
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
                    <div
                        css={css`
                            width: 100%;
                            aspect-ratio: 16 / 9;
                            border-radius: ${token.borderRadius}px;
                            overflow: hidden;
                            box-shadow: ${token.boxShadow};
                        `}
                    >
                        <GamePoster gameId={game?.id!} />
                    </div>
                    <h2
                        css={css`
                            line-height: 1em;
                            font-size: 2em;
                        `}
                    >
                        {game?.title}
                    </h2>
                </div>
                <div
                    css={css`
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
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
                    <Button
                        variant={"filled"}
                        size={"large"}
                        color={"primary"}
                        disabled={status !== "ongoing"}
                    >
                        进入赛场
                    </Button>
                </div>
            </div>
        </Flex>
    );
}
