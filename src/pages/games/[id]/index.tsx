import { getGames } from "@/api/game";
import { MarkdownRender } from "@/components/utils/MarkdownRender";
import { GamePoster } from "@/components/widgets/GamePoster";
import { Game } from "@/models/game";
import { css } from "@emotion/react";
import { Flex, theme } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function () {
    const { id } = useParams();
    const [game, setGame] = useState<Game>();
    const { token } = theme.useToken();

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
            gap={32}
            css={css`
                padding: 0 15%;
                flex-direction: row-reverse;
            `}
        >
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
            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    position: sticky;
                    top: calc(64px + 2rem);
                    left: 0;
                    width: 35%;
                `}
            >
                <div
                    css={css`
                        width: 100%;
                        height: 100%;
                        aspect-ratio: 16 / 9;
                        border-radius: ${token.borderRadius}px;
                        overflow: hidden;
                        border: 1px solid ${token.colorBorderSecondary};
                        box-shadow: ${token.boxShadowTertiary};
                    `}
                >
                    <GamePoster gameId={game?.id!} />
                </div>
                <h1>{game?.title}</h1>
            </div>
        </Flex>
    );
}
