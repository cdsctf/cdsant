import { getGameScoreboard } from "@/api/game";
import { GameTeam } from "@/models/game_team";
import { Submission } from "@/models/submission";
import { ProColumnType, ProTable } from "@ant-design/pro-components";
import { css } from "@emotion/react";
import { Avatar, Flex } from "antd";
import { nanoid } from "nanoid";
import { useParams } from "react-router";

interface ScoreboardRecord {
    game_team?: GameTeam;
    submissions?: Array<Submission>;
}

export default function () {
    const { id } = useParams<{ id: string }>();
    const columns: Array<ProColumnType<ScoreboardRecord>> = [
        {
            title: "排名",
            dataIndex: ["game_team", "rank"],
            key: "game_team.rank",
            width: "10%",
            search: false,
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "团队",
            dataIndex: ["game_team", "team_id"],
            key: "game_team.team_id",
            width: "15%",
            ellipsis: {
                showTitle: false,
            },
            align: "center",
            renderText: (_, data) => {
                return (
                    <Flex align={"center"} gap={12}>
                        <Avatar
                            src={`/api/teams/${data.game_team?.team_id}/avatar`}
                        />
                        <span>{data?.game_team?.team?.name}</span>
                    </Flex>
                );
            },
        },
        {
            title: "分数",
            dataIndex: ["game_team", "pts"],
            key: "game_team.pts",
            width: "10%",
            search: false,
            ellipsis: {
                showTitle: false,
            },
        },
    ];

    return (
        <Flex
            vertical
            css={css`
                margin: 2rem 15%;
            `}
        >
            <Flex vertical justify={"center"} align={"center"}>
                <h2
                    css={css`
                        font-size: 2rem;
                    `}
                >
                    积分榜
                </h2>
            </Flex>
            <ProTable<ScoreboardRecord>
                ghost
                columns={columns}
                sticky={{
                    offsetHeader: 64,
                }}
                search={false}
                toolBarRender={false}
                bordered
                pagination={{
                    pageSizeOptions: [12, 24, 48, 100],
                    defaultPageSize: 12,
                    showSizeChanger: true,
                }}
                rowKey={(item) => item?.game_team?.team_id || nanoid()}
                request={async (params, _sort, filter) => {
                    const res = await getGameScoreboard({
                        id: Number(id),
                        page: params.current,
                        size: params.pageSize,
                    });

                    return {
                        data: res.data,
                        success: res.code === 200,
                        total: res.total,
                    };
                }}
            />
        </Flex>
    );
}
