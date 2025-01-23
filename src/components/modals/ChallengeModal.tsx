import { Challenge, ChallengeStatus } from "@/models/challenge";
import { useCategoryStore } from "@/stores/category";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Flex, Modal, Grid, Divider, Space, Input, Button, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import { MarkdownRender } from "../utils/MarkdownRender";
import DownloadMinimalisticOutline from "~icons/solar/download-minimalistic-outline";
import FlagLinear from "~icons/solar/flag-linear";
import { getSubmissionById, postSubmission } from "@/api/submission";
import useMode from "@/hooks/useMode";
import { useParams } from "react-router";
import { useNotificationStore } from "@/stores/notification";
import { createPod, getPods, renewPod, stopPod } from "@/api/pods";
import { useAuthStore } from "@/stores/auth";
import { Pod } from "@/models/pod";
import { nanoid } from "@ant-design/pro-components";

export interface ChallengeModalProps {
    open: boolean;
    onClose: () => void;
    challenge?: Challenge;
    status?: ChallengeStatus;
}

export default function ChallengeModal(props: ChallengeModalProps) {
    const { open, onClose, challenge } = props;
    const screens = Grid.useBreakpoint();
    const { token } = theme.useToken();

    const sharedStore = useSharedStore();
    const categoryStore = useCategoryStore();
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    const mode = useMode();
    const { id } = useParams();

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
            game_id: mode === "game" ? Number(id) : undefined,
        }).then((res) => {
            const p = res.data?.[0];
            if (Number(p?.removed_at) * 1000 > Number(new Date())) {
                setPod(p);
            }
        });
    }

    function handlePodRenew() {
        renewPod({
            id: pod?.id!,
        }).then((res) => {
            setPod(res.data);
            notificationStore?.api?.success({
                message: "续期成功",
            });
        });
    }

    function handlePodStop() {
        setPodStopLoading(true);
        stopPod({
            id: pod?.id!,
        })
            .then((_) => {
                notificationStore?.api?.info({
                    message: "已停止",
                });
                setPod(undefined);
            })
            .finally(() => {
                setPodStopLoading(false);
            });
    }

    function handlePodCreate() {
        const key = nanoid();
        setPodCreateLoading(true);
        notificationStore?.api?.info({
            key: key,
            message: "正在创建容器",
            description: "这可能需要一些时间",
            duration: null,
        });
        createPod({
            challenge_id: challenge?.id,
            game_id: mode === "game" ? Number(id) : undefined,
        })
            .then((res) => {
                switch (res.code) {
                    case 200: {
                        setPod(res.data);
                        notificationStore?.api?.success({
                            key: key,
                            message: "创建成功",
                        });
                        break;
                    }
                    default: {
                        notificationStore?.api?.error({
                            key: key,
                            message: "发生错误",
                            description: res.msg,
                        });
                    }
                }
            })
            .finally(() => {
                setPodCreateLoading(false);
            });
    }

    function handleFlagSubmit() {
        setSubmitLoading(true);
        postSubmission({
            challenge_id: challenge?.id,
            flag: flag,
            game_id: mode === "game" ? Number(id) : undefined,
        }).then((res) => {
            setSubmissionId(res?.data?.id);
            setFlag("");
            notificationStore?.api?.info({
                key: `submission-${res?.data?.id}`,
                message: "已提交",
                description: "请等待审核，这不会太久",
                duration: null,
            });
        });
    }

    useEffect(() => {
        if (challenge?.is_dynamic) {
            fetchPods();
        }
    }, [challenge, open]);

    useEffect(() => {
        let intervalId: number;
        function fetchSubmission() {
            getSubmissionById(submissionId!).then((res) => {
                const submission = res.data;
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
                                key: `submission-${res?.data?.id}`,
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
        <Modal
            centered
            open={open}
            onOk={() => onClose()}
            onCancel={() => onClose()}
            footer={null}
            closable={false}
            width={screens.md ? "40vw" : "90vw"}
            destroyOnClose
        >
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
                                        Number(pod.removed_at) * 1000
                                    ).toLocaleString()} 时自动销毁`}
                                </span>
                                <Flex justify={"space-between"} gap={24}>
                                    <Flex
                                        vertical
                                        css={css`
                                            flex: 1;
                                        `}
                                    >
                                        {pod?.nats?.map((nat) => (
                                            <Flex key={nat?.src}>
                                                <Input
                                                    addonBefore={nat?.src}
                                                    value={nat?.entry}
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
        </Modal>
    );
}
