import { getGames } from "@/api/game";
import { Game } from "@/models/game";
import { css } from "@emotion/react";
import {
    Flex,
    Form,
    Input,
    InputNumber,
    Pagination,
    Space,
    theme,
    Grid,
    Button,
} from "antd";
import { useEffect, useState } from "react";
import HashtagBold from "~icons/solar/hashtag-bold";
import GameCard from "./_blocks/GameCard";

export default function () {
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();
    const [games, setGames] = useState<Array<Game>>();
    const [total, setTotal] = useState<number>();

    const [id, setId] = useState<number>();
    const [size, setSize] = useState(4);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState<string>();

    function fetchGames() {
        getGames({
            id: Number.isNaN(id) ? undefined : id,
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
                gap: 36px;
                background-color: ${token.colorBgElevated};
                box-shadow: ${token.boxShadow};
            `}
        >
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
            <Flex
                vertical
                gap={16}
                css={css`
                    flex: 1;
                `}
            >
                {games?.map((game) => <GameCard key={game?.id} game={game} />)}
            </Flex>
            <Flex justify={"center"}>
                <Pagination
                    showSizeChanger
                    pageSize={size}
                    pageSizeOptions={[4, 8, 12]}
                    defaultPageSize={4}
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
