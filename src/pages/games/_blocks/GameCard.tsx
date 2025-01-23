import { GamePoster } from "@/components/widgets/GamePoster";
import { Game } from "@/models/game";
import { css } from "@emotion/react";
import { theme } from "antd";
import { Link } from "react-router";

export interface GameCardProps {
    game?: Game;
}

export default function GameCard(props: GameCardProps) {
    const { game } = props;
    const { token } = theme.useToken();

    return (
        <div
            css={css`
                display: flex;
                background-color: ${token.colorBgContainer};
                border-radius: ${token.borderRadius}px;
                box-shadow: ${token.boxShadowSecondary};
                overflow: hidden;
                border: 1px solid ${token.colorBorderSecondary};
                user-select: none;
                gap: 16px;
                height: 150px;
            `}
        >
            <div
                css={css`
                    height: 150px;
                    aspect-ratio: 16/9;
                `}
            >
                <GamePoster key={game?.id} gameId={game?.id!} />
            </div>
            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    flex: 1;
                    margin: 12px;
                    overflow: hidden;
                `}
            >
                <h3
                    css={css`
                        font-size: 1rem;
                    `}
                >
                    {game?.title}
                </h3>
                <span
                    css={css`
                        font-size: 0.9rem;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    `}
                >
                    {game?.sketch}
                </span>
            </div>
            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: end;
                    padding: 16px;
                `}
            >
                <Link to={`/games/${game?.id}`} draggable={false}>
                    查看详情
                </Link>
            </div>
        </div>
    );
}
