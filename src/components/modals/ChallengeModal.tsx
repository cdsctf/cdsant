import { Challenge, ChallengeStatus } from "@/models/challenge";
import { useCategoryStore } from "@/stores/category";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Flex, Divider, Space, Input, Button, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import { MarkdownRender } from "../utils/MarkdownRender";
import DownloadMinimalisticOutline from "~icons/solar/download-minimalistic-outline";
import FlagLinear from "~icons/solar/flag-linear";
import { getSubmission, postSubmission } from "@/api/submission";
import { useNotificationStore } from "@/stores/notification";
import { createPod, getPods, renewPod, stopPod } from "@/api/pods";
import { useAuthStore } from "@/stores/auth";
import { Pod } from "@/models/pod";
import { useInterval } from "ahooks";
import { GameTeam } from "@/models/game_team";

export interface ChallengeModalProps {
    challenge?: Challenge;
    status?: ChallengeStatus;
    gameTeam?: GameTeam;
}

export default function ChallengeModal(props: ChallengeModalProps) {
    const { challenge, gameTeam } = props;
    const { token } = theme.useToken();

    const sharedStore = useSharedStore();
    const categoryStore = useCategoryStore();
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    const mode = useMemo(() => {
        if (!!gameTeam) {
            return "game";
        }

        return "default";
    }, [gameTeam]);

    const category = useMemo(
        () => categoryStore.getCategory(challenge?.category),
        [challenge?.category]
    );

    const [flag, setFlag] = useState<string>("");
    const [submissionId, setSubmissionId] = useState<number>();
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const [pod, setPod] = useState<Pod>();
    const [podStopLoading, setPodStopLoading] = useState<boolean>(false);
    const [podCreateLoading, setPodCreateLoading] = useState<boolean>(false);

    function fetchPods() {
        getPods({
            challenge_id: challenge?.id,
            user_id: mode !== "game" ? authStore?.user?.id : undefined,
            game_id: mode === "game" ? Number(gameTeam?.game_id) : undefined,
            team_id: mode === "game" ? Number(gameTeam?.team_id) : undefined,
        }).then((res) => {
            if (res.code === 200) {
                const p = res.data?.[0];
                setPod(p);

                if (p?.status !== "waiting") {
                    setPodCreateLoading(false);
                }

                if (p?.status === "running") {
                    notificationStore?.api?.destroy("pod");
                }

                if (
                    p?.status === "waiting" &&
                    p?.reason !== "ContainerCreating"
                ) {
                    notificationStore?.api?.info({
                        key: "pod",
                        message: "容器创建时发生错误，即将触发销毁",
                        description: p?.reason,
                    });
                    setPodStopLoading(true);
                }
            }
        });
    }

    function handlePodRenew() {
        renewPod({
            id: pod?.id!,
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "续期成功",
                });
            }

            if (res.code === 400) {
                notificationStore?.api?.error({
                    message: "续期失败",
                    description: res.msg,
                });
            }
        });
    }

    function handlePodStop() {
        stopPod({
            id: pod?.id!,
        })
            .then((_) => {
                notificationStore?.api?.info({
                    key: "pod-stop",
                    message: "已下发容器停止命令",
                });
                setPod(undefined);
            })
            .finally(() => {
                setPodStopLoading(false);
            });
    }

    useEffect(() => {
        if (podStopLoading) {
            handlePodStop();
        }
    }, [podStopLoading]);

    function handlePodCreate() {
        setPodCreateLoading(true);
        notificationStore?.api?.info({
            key: "pod",
            message: "正在发送容器创建请求",
            duration: null,
        });
        createPod({
            challenge_id: challenge?.id,
            game_id: mode === "game" ? Number(gameTeam?.game_id) : undefined,
            team_id: mode === "game" ? Number(gameTeam?.team_id) : undefined,
        }).then((res) => {
            switch (res.code) {
                case 200: {
                    setPod(res.data);
                    notificationStore?.api?.success({
                        key: "pod",
                        message: "已下发容器启动命令",
                        description: "这可能需要一些时间",
                        duration: null,
                    });
                    fetchPods();
                    break;
                }
                default: {
                    notificationStore?.api?.error({
                        key: "pod",
                        message: "发生错误",
                        description: res.msg,
                    });
                }
            }
        });
    }

    useInterval(fetchPods, 1000);

    function handleFlagSubmit() {
        setSubmitLoading(true);
        postSubmission({
            challenge_id: challenge?.id,
            content: flag,
            game_id: mode === "game" ? Number(gameTeam?.game_id) : undefined,
            team_id: mode === "game" ? Number(gameTeam?.team_id) : undefined,
        }).then((res) => {
            if (res.code === 200) {
                setSubmissionId(res?.data?.id);
                setFlag("");
                notificationStore?.api?.info({
                    key: `submission-${res?.data?.id}`,
                    message: "已提交",
                    description: "请等待审核，这不会太久",
                    duration: null,
                });
            }

            if (res.code === 500) {
                notificationStore?.api?.error({
                    message: "发生了错误",
                    description: res.msg,
                });
                setSubmitLoading(false);
            }
        });
    }

    useEffect(() => {
        if (challenge?.is_dynamic) {
            fetchPods();
        } else {
            setPod(undefined);
        }
    }, [challenge, open]);

    useEffect(() => {
        let intervalId: number;
        function fetchSubmission() {
            getSubmission({
                id: submissionId,
                is_desensitized: true,
            }).then((res) => {
                const submission = res.data?.[0];
                if (submission?.status !== 0) {
                    switch (submission?.status) {
                        case 1:
                            notificationStore?.api?.success({
                                key: `submission-${submissionId}`,
                                message: "正确",
                                description: "恭喜你，提交成功！",
                            });
                            sharedStore?.setRefresh();
                            break;
                        case 2:
                            notificationStore?.api?.error({
                                key: `submission-${submissionId}`,
                                message: "错误",
                                description: "再检查一下？",
                            });
                            break;
                        case 3:
                            notificationStore?.api?.error({
                                key: `submission-${submissionId}`,
                                message: "作弊",
                                description: "你存在作弊的可能，已记录。",
                            });
                            break;
                        case 4:
                            notificationStore?.api?.info({
                                key: `submission-${res?.data?.[0]?.id}`,
                                message: "无效",
                                description: "提交无效。",
                            });
                            sharedStore?.setRefresh();
                            break;
                    }
                    clearInterval(intervalId);
                    setSubmitLoading(false);
                }
            });
        }
        if (submissionId) {
            intervalId = setInterval(() => {
                fetchSubmission();
            }, 1000) as unknown as number;
        }
        return () => clearInterval(intervalId);
    }, [submissionId]);

    return (
        <Flex
            vertical
            justify={"space-between"}
            gap={20}
            css={css`
                width: 100%;
                min-height: 40vh;
                max-height: 80vh;
                position: relative;
            `}
        >
            <Flex vertical gap={15}>
                <Flex
                    justify={"start"}
                    align={"center"}
                    gap={15}
                    css={css`
                        font-size: 1.125rem;
                        color: ${category?.color};
                    `}
                >
                    {category?.icon}
                    <span>{challenge?.title}</span>
                </Flex>
                <Divider
                    variant={"dashed"}
                    css={css`
                        margin: 0;
                    `}
                />
            </Flex>
            {challenge?.has_attachment && (
                <div
                    css={css`
                        position: absolute;
                        top: 0;
                        right: 0;
                    `}
                >
                    <Button
                        type={"text"}
                        icon={<DownloadMinimalisticOutline />}
                        shape={"round"}
                        target={"_blank"}
                        href={`/api/challenges/${challenge?.id}/attachment`}
                    >
                        下载附件
                    </Button>
                </div>
            )}
            <MarkdownRender
                src={challenge?.description}
                css={css`
                    flex: 1;
                    overflow: scroll;
                `}
            />
            {challenge?.is_dynamic && (
                <>
                    {pod?.id ? (
                        <Flex vertical align={"center"} gap={15}>
                            <span
                                css={css`
                                    color: ${token.colorTextDescription};
                                    user-select: none;
                                `}
                            >
                                {`容器将于 ${new Date(
                                    (Number(pod.started_at) +
                                        (Number(pod.renew) + 1) *
                                            Number(pod.duration)) *
                                        1000
                                ).toLocaleString()} 时自动销毁`}
                            </span>
                            <Flex
                                justify={"space-between"}
                                gap={24}
                                css={css`
                                    width: 100%;
                                `}
                            >
                                <Flex
                                    vertical
                                    gap={8}
                                    css={css`
                                        flex: 1;
                                    `}
                                >
                                    {pod?.nats
                                        ?.split(",")
                                        .map((pair) => pair.split("="))
                                        .map(([src, dst]: Array<string>) => (
                                            <Flex key={src}>
                                                <Input
                                                    addonBefore={src}
                                                    value={`${pod?.public_entry}:${dst}`}
                                                    css={css`
                                                        caret-color: transparent;
                                                    `}
                                                />
                                            </Flex>
                                        ))}
                                </Flex>
                                <Flex
                                    align={"center"}
                                    justify={"center"}
                                    gap={12}
                                >
                                    <Button
                                        color={"primary"}
                                        variant={"solid"}
                                        onClick={() => handlePodRenew()}
                                    >
                                        续期
                                    </Button>
                                    <Button
                                        variant={"solid"}
                                        color={"red"}
                                        onClick={() => handlePodStop()}
                                        loading={podStopLoading}
                                    >
                                        停止
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    ) : (
                        <Flex justify={"space-between"} align={"center"}>
                            <Flex
                                vertical
                                css={css`
                                    color: ${token.colorTextDescription};
                                    user-select: none;
                                `}
                            >
                                <span>本题需要使用动态容器，</span>
                                <span>点击“启动”进行容器下发。</span>
                            </Flex>
                            <Button
                                variant={"solid"}
                                color={"green"}
                                onClick={() => handlePodCreate()}
                                loading={podCreateLoading}
                            >
                                启动
                            </Button>
                        </Flex>
                    )}
                </>
            )}
            <Flex vertical gap={20}>
                <Divider
                    variant={"dashed"}
                    css={css`
                        margin: 0;
                    `}
                />
                <Space.Compact size={"large"}>
                    <Input
                        allowClear
                        addonBefore={<FlagLinear />}
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                    />
                    <Button
                        type={"primary"}
                        loading={submitLoading}
                        onClick={() => handleFlagSubmit()}
                    >
                        提交
                    </Button>
                </Space.Compact>
            </Flex>
        </Flex>
    );
}
