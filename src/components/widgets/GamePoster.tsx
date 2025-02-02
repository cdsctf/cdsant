import { css } from "@emotion/react";
import { theme, Image } from "antd";
import { useState, useEffect, CSSProperties } from "react";
import FlagBold from "~icons/solar/flag-bold";

export interface GamePosterProps {
    gameId: number;
    className?: string;
    style?: CSSProperties;
}

export function GamePoster(props: GamePosterProps) {
    const { gameId, ...rest } = props;
    const { token } = theme.useToken();

    const [currentGameId, setCurrentGameId] = useState(gameId);
    const [err, setErr] = useState<boolean>(false);

    useEffect(() => {
        setCurrentGameId(gameId);
        setErr(false);
    }, [gameId]);

    if (err) {
        return (
            <div
                css={css`
                    width: 100%;
                    height: 100%;
                    aspect-ratio: 16/9;
                    background-color: ${token.colorBgContainerDisabled};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `}
                {...rest}
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
            src={`/api/games/${currentGameId}/poster`}
            onError={() => setErr(true)}
            height={"100%"}
            {...rest}
            css={css`
                aspect-ratio: 16/9;
            `}
        />
    );
}
