import { getGames } from "@/api/game";
import { Game } from "@/models/game";
import { css } from "@emotion/react";
import {
    Flex,
    Input,
    InputNumber,
    Pagination,
    Space,
    Grid,
    Button,
} from "antd";
import { useEffect, useState } from "react";
import HashtagBold from "~icons/solar/hashtag-bold";
import GameCard from "./_blocks/GameCard";

export default function () {
    const screens = Grid.useBreakpoint();
    const [games, setGames] = useState<Array<Game>>();
    const [total, setTotal] = useState<number>();

    const [id, setId] = useState<number>();
    const [size, setSize] = useState(3);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState<string>();

    function fetchGames() {
        getGames({
            id: Number.isNaN(id) ? undefined : id,
            is_enabled: true,
            title: title,
            size: size,
            page: page,
            sorts: "-id",
        }).then((res) => {
            setGames(res.data);
            setTotal(res.total);
        });
    }

    useEffect(() => {
        fetchGames();
    }, [id, size, page, title]);

    const [titleInput, setTitleInput] = useState("");
    const [idInput, setIdInput] = useState<number>();

    return (
        <div
            css={css`
                flex: 1;
                display: flex;
                flex-direction: column;
                margin: 0 ${screens.lg ? "15%" : 0};
                padding: 2.5rem 10%;
                justify-content: space-between;
                gap: 2.5rem;
            `}
        >
            <Flex justify={"center"}>
                <h2
                    css={css`
                        font-size: 2rem;
                        line-height: 1em;
                    `}
                >
                    比赛
                </h2>
            </Flex>
            <Space.Compact
                size={"large"}
                css={css`
                    width: 100%;
                    padding: 0 10%;
                `}
            >
                <InputNumber
                    addonBefore={<HashtagBold />}
                    placeholder="ID"
                    name="id"
                    min={0}
                    css={css`
                        width: 35%;
                    `}
                    onChange={(value) =>
                        setIdInput(Number(value?.toString()) ?? undefined)
                    }
                />
                <Input
                    name="title"
                    placeholder="标题"
                    onChange={(e) => setTitleInput(e.target.value)}
                />
                <Button
                    type={"primary"}
                    htmlType={"submit"}
                    onClick={() => {
                        setTitle(titleInput);
                        setId(idInput);
                    }}
                >
                    搜索
                </Button>
            </Space.Compact>
            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    flex: 1;
                `}
            >
                {games?.map((game) => <GameCard key={game?.id} game={game} />)}
            </div>
            <Flex justify={"center"}>
                <Pagination
                    showSizeChanger
                    pageSize={size}
                    pageSizeOptions={[3, 6, 9]}
                    defaultPageSize={3}
                    onShowSizeChange={(_, size) => setSize(size)}
                    locale={{
                        items_per_page: "/ 页",
                    }}
                    current={page}
                    onChange={setPage}
                    defaultCurrent={1}
                    total={total}
                />
            </Flex>
        </div>
    );
}
