import { Game } from "@/models/game";
import { css } from "@emotion/react";
import { theme, Image } from "antd";
import { useState } from "react";
import FlagBold from "~icons/solar/flag-bold";

export interface GamePosterProps {
    gameId: number;
}

export function GamePoster(props: GamePosterProps) {
    const { gameId } = props;
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
            src={`/api/games/${gameId}/poster`}
            onError={() => setErr(true)}
            height={"100%"}
        />
    );
}
