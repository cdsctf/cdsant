import { Game } from "@/models/game";
import { css } from "@emotion/react";
import { Card, Input, Space, Image, theme } from "antd";
import { useState } from "react";
import { Link } from "react-router";
import FlagBold from "~icons/solar/flag-bold";

export interface GamePosterProps {
    game?: Game;
}

export function GamePoster(props: GamePosterProps) {
    const { game } = props;
    const { token } = theme.useToken();

    const [err, setErr] = useState<boolean>(false);

    if (err) {
        return (
            <div
                css={css`
                    width: 100%;
                    height: 100%;
                    background-color: ${token.colorBgContainerDisabled};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `}
            >
                <FlagBold
                    css={css`
                        height: 49px;
                        width: 49px;
                        color: ${token.colorTextDisabled};
                    `}
                />
            </div>
        );
    }

    return (
        <Image
            preview={false}
            draggable={false}
            src={`/api/games/${game?.id}/poster`}
            onError={() => setErr(true)}
            height={"100%"}
        />
    );
}

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
                box-shadow: ${token.boxShadowTertiary};
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
                <GamePoster key={game?.id} game={game} />
            </div>
            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                    padding: 12px;
                `}
            >
                <h2
                    css={css`
                        font-size: 1.2rem;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    `}
                >
                    {game?.title}
                </h2>
                <p
                    css={css`
                        font-size: 0.9rem;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    `}
                >
                    {game?.sketch}
                </p>
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
