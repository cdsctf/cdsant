import { getGames } from "@/api/game";
import { Game } from "@/models/game";
import { css } from "@emotion/react";
import { Carousel, Image, theme } from "antd";
import { useEffect, useState } from "react";

export default function () {
    const { token } = theme.useToken();

    const [games, setGame] = useState<Array<Game>>();

    function fetchGames() {
        getGames({
            sorts: "-id",
        }).then((res) => {
            setGame(res.data);
        });
    }

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <div
            css={css`
                position: relative;
                min-height: 100%;
                max-height: 100%;
                scroll-snap-align: center;
                flex: 1;
            `}
        >
            {games?.length && (
                <>
                    <div
                        css={css`
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 50vw;
                            transform: translate(-50%, -50%);
                        `}
                    >
                        <Carousel
                            autoplay
                            arrows
                            adaptiveHeight
                            css={css`
                                width: 100%;
                                aspect-ratio: 16/9;
                                border-radius: ${token.borderRadiusLG}px;
                                box-shadow: ${token.boxShadow};
                                /* overflow: hidden; */
                                position: relative;
                            `}
                        >
                            {games?.slice(0, 5).map((game) => (
                                <>
                                    <div
                                        css={css`
                                            background-color: ${token.colorBgElevated};
                                            width: 100%;
                                            aspect-ratio: 16/9;
                                        `}
                                    >
                                        <Image
                                            src={`/api/games/${game?.id}/poster`}
                                            preview={false}
                                        />
                                    </div>
                                    <div
                                        css={css`
                                            position: absolute;
                                            background-color: ${token.colorBgElevated};
                                            top: -100px;
                                            left: -10px;
                                            width: 100px;
                                            height: 100px;
                                        `}
                                    >
                                        12
                                    </div>
                                </>
                            ))}
                        </Carousel>
                    </div>
                </>
            )}
        </div>
    );
}
