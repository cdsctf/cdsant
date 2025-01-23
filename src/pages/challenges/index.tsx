import { getChallenges, getChallengeStatus } from "@/api/challenge";
import ChallengeModal from "@/components/modals/ChallengeModal";
import { Challenge, ChallengeStatus } from "@/models/challenge";
import { useAuthStore } from "@/stores/auth";
import { useCategoryStore } from "@/stores/category";
import { useSharedStore } from "@/stores/shared";
import {
    ActionType,
    nanoid,
    ProColumnType,
    ProTable,
} from "@ant-design/pro-components";
import { css } from "@emotion/react";
import { Button, Flex, Grid } from "antd";
import { useEffect, useRef, useState } from "react";
import PlayCircleLinear from "~icons/solar/play-circle-linear";

interface ChallengeWithStatus extends Challenge, ChallengeStatus {}

export default function () {
    const categoryStore = useCategoryStore();
    const authStore = useAuthStore();
    const sharedStore = useSharedStore();

    const screens = Grid.useBreakpoint();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] =
        useState<ChallengeWithStatus>();
    const ref = useRef<ActionType>(null);

    useEffect(() => {
        ref?.current?.reload();
    }, [sharedStore?.refresh]);

    const columns: Array<ProColumnType<ChallengeWithStatus>> = [
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            width: "15%",
            ellipsis: {
                showTitle: false,
            },
            copyable: true,
        },
        {
            title: "分类",
            dataIndex: "category",
            key: "category",
            width: "10%",
            search: false,
            renderText: (categoryId: number) => {
                const category = categoryStore?.getCategory(categoryId);
                return (
                    <Flex
                        align={"center"}
                        gap={12}
                        css={css`
                            color: ${category?.color};
                        `}
                    >
                        {category?.icon}
                        {category?.name?.toUpperCase()}
                    </Flex>
                );
            },
            filtered: true,
            filterMultiple: false,
            filters: categoryStore?.categories?.map((category) => ({
                text: category?.name?.toUpperCase(),
                value: Number(category?.id),
            })),
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description",
            width: "30%",
            search: false,
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: "创建于",
            dataIndex: "created_at",
            key: "created_at",
            width: "10%",
            search: false,
            sortDirections: ["descend", "ascend"],
            sorter: true,
            renderText: (created_at: number) => {
                return new Date(created_at * 1000).toLocaleString();
            },
        },
        // {
        //     title: "前三血",
        //     dataIndex: "bloods",
        //     key: "bloods",
        //     width: "5%",
        //     search: false,
        //     renderText: (bloods: Array<Submission>) => {
        //         return (
        //             <Flex gap={12}>
        //                 {bloods.map((blood, index) => (
        //                     <Tag
        //                         color={
        //                             index === 0
        //                                 ? "#FFC107"
        //                                 : index === 1
        //                                   ? "#9E9E9E"
        //                                   : "#FF9800"
        //                         }
        //                     >
        //                         {blood?.user?.username}
        //                     </Tag>
        //                 ))}
        //             </Flex>
        //         );
        //     },
        // },
        {
            title: "",
            key: "action",
            width: "10%",
            search: false,
            hideInSetting: true,
            render: (_, data) => (
                <Flex gap={12} justify={"center"}>
                    <Button
                        variant={"text"}
                        color={data.is_solved ? "primary" : "default"}
                        css={css`
                            display: flex;
                            gap: 12px;
                        `}
                        onClick={() => {
                            setSelectedChallenge(data);
                            setModalOpen(true);
                        }}
                    >
                        <PlayCircleLinear />
                        {data.is_solved ? "已完成" : "挑战"}
                    </Button>
                </Flex>
            ),
        },
    ];

    return (
        <div
            css={css`
                padding: 3rem ${screens.lg ? "12rem" : "1rem"};
            `}
        >
            <Flex vertical justify={"center"} align={"center"}>
                <h2
                    css={css`
                        font-size: 2rem;
                    `}
                >
                    公开题库
                </h2>
            </Flex>
            <ProTable<ChallengeWithStatus>
                ghost
                columns={columns}
                sticky={{
                    offsetHeader: 64,
                }}
                toolBarRender={false}
                actionRef={ref}
                bordered
                pagination={{
                    pageSizeOptions: [12, 24, 48, 100],
                    defaultPageSize: 12,
                    showSizeChanger: true,
                }}
                rowKey={nanoid}
                request={async (params, sort, filter) => {
                    const getChallengesResponse = await getChallenges({
                        title: params.title ? params.title : undefined,
                        category: filter.category
                            ? Number(filter.category[0])
                            : undefined,
                        page: params.current,
                        size: params.pageSize,
                        sorts: Object.keys(sort)
                            .map((key) => {
                                if (sort[key] === "ascend") {
                                    return `${key}`;
                                } else if (sort[key] === "descend") {
                                    return `-${key}`;
                                } else {
                                    return null;
                                }
                            })
                            .join(","),
                    });

                    const getChallengeStatusResponse = await getChallengeStatus(
                        {
                            challenge_ids: getChallengesResponse?.data?.map(
                                (challenge) => challenge.id!
                            )!,
                            user_id: authStore?.user?.id,
                        }
                    );

                    const data = getChallengesResponse?.data?.map(
                        (challenge) => {
                            const challengeStatus =
                                getChallengeStatusResponse?.data?.[
                                    challenge.id!
                                ];
                            return {
                                ...challenge,
                                is_solved: challengeStatus?.is_solved,
                                solved_times: challengeStatus?.solved_times,
                                bloods: challengeStatus?.bloods,
                            };
                        }
                    );

                    return {
                        data: data,
                        success: getChallengesResponse.code === 200,
                        total: getChallengesResponse.total,
                    };
                }}
            />
            <ChallengeModal
                onClose={() => setModalOpen(false)}
                open={modalOpen}
                challenge={selectedChallenge}
                status={selectedChallenge}
            />
        </div>
    );
}
