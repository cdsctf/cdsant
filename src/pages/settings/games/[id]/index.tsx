import {
    Button,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    Image,
    Space,
    Switch,
    Upload,
    theme,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { Context } from "./context";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { css } from "@emotion/react";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { useKeyPress } from "ahooks";
import {
    deleteGameIcon,
    deleteGamePoster,
    getGameIconMetadata,
    getGamePosterMetadata,
    updateGame,
} from "@/api/game";
import dayjs, { Dayjs } from "dayjs";
import { Metadata } from "@/models/media";
import TrashBinTrashLinear from "~icons/solar/trash-bin-trash-linear";

const { Dragger } = Upload;

export default function () {
    const { token } = theme.useToken();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const { game } = useContext(Context);

    const [posterMetadata, setPosterMetadata] = useState<Metadata>();
    const [iconMetadata, setIconMetadata] = useState<Metadata>();

    const [form] = Form.useForm<{
        title: string;
        sketch: string;
        description: string;
        started_at: Dayjs;
        frozen_at: Dayjs;
        ended_at: Dayjs;
        is_public: boolean;
        is_need_write_up: boolean;
        member_limit_min: number;
        member_limit_max: number;
        parallel_container_limit: number;
    }>();

    useEffect(() => {
        form.setFieldsValue({
            title: game?.title,
            sketch: game?.sketch,
            description: game?.description,
            started_at: dayjs(Number(game?.started_at) * 1000),
            frozen_at: dayjs(Number(game?.frozen_at) * 1000),
            ended_at: dayjs(Number(game?.ended_at) * 1000),
            is_public: game?.is_public,
            is_need_write_up: game?.is_need_write_up,
            member_limit_min: game?.member_limit_min,
            member_limit_max: game?.member_limit_max,
        });
    }, [game]);

    function handleGameUpdate() {
        updateGame({
            id: game?.id,
            title: form.getFieldValue("title"),
            sketch: form.getFieldValue("sketch"),
            description: form.getFieldValue("description"),
            started_at: Math.ceil(
                form.getFieldValue("started_at").toDate().getTime() / 1000
            ),
            frozen_at: Math.ceil(
                form.getFieldValue("frozen_at").toDate().getTime() / 1000
            ),
            ended_at: Math.ceil(
                form.getFieldValue("ended_at").toDate().getTime() / 1000
            ),
            is_public: form.getFieldValue("is_public"),
            is_need_write_up: form.getFieldValue("is_need_write_up"),
            member_limit_min: form.getFieldValue("member_limit_min"),
            member_limit_max: form.getFieldValue("member_limit_max"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: `比赛 ${res?.data?.title} 信息已更新`,
                });
                sharedStore.setRefresh();
            }
        });
    }

    function fetchPosterMetadata() {
        getGamePosterMetadata(game?.id!).then((res) => {
            setPosterMetadata(res?.data);
        });
    }

    function handleDeletePoster() {
        deleteGamePoster(game?.id!)
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "删除成功",
                        description: `比赛海报已删除`,
                    });
                }
            })
            .finally(() => {
                sharedStore.setRefresh();
            });
    }

    function fetchIconMetadata() {
        getGameIconMetadata(game?.id!).then((res) => {
            setIconMetadata(res?.data);
        });
    }

    function handleDeleteIcon() {
        deleteGameIcon(game?.id!)
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "删除成功",
                        description: `比赛图标已删除`,
                    });
                }
            })
            .finally(() => {
                sharedStore.setRefresh();
            });
    }

    useEffect(() => {
        if (game?.id) {
            fetchPosterMetadata();
            fetchIconMetadata();
        }
    }, [sharedStore?.refresh, game?.id]);

    useKeyPress(["ctrl.s"], (e) => {
        e.preventDefault();
        handleGameUpdate();
    });

    return (
        <Form
            layout={"vertical"}
            form={form}
            onFinish={() => handleGameUpdate()}
            autoComplete="off"
            css={css`
                display: flex;
                flex-direction: column;
                gap: 12px;
            `}
        >
            <Flex
                css={css`
                    gap: 16px;
                `}
            >
                <Flex
                    vertical
                    css={css`
                        flex: 1;
                    `}
                >
                    <Form.Item
                        name={"title"}
                        label={"标题"}
                        rules={[
                            {
                                required: true,
                                message: "请输入比赛标题",
                            },
                        ]}
                    >
                        <Input size={"large"} placeholder={"请输入比赛标题"} />
                    </Form.Item>
                    <Form.Item
                        name={"sketch"}
                        label={"简述"}
                        rules={[
                            {
                                required: true,
                                message: "请输入比赛简述",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            autoSize={{ minRows: 4, maxRows: 4 }}
                        />
                    </Form.Item>
                </Flex>
                <Flex
                    vertical
                    gap={8}
                    css={css`
                        height: fit-content;
                    `}
                >
                    <Flex align={"center"}>
                        <span
                            css={css`
                                margin: 2px 0;
                            `}
                        >
                            图标（建议比例 1:1）
                        </span>
                        {iconMetadata && (
                            <Button
                                type={"link"}
                                size={"small"}
                                danger
                                icon={<TrashBinTrashLinear />}
                                onClick={handleDeleteIcon}
                            />
                        )}
                    </Flex>
                    <Dragger
                        name={"file"}
                        action={`/api/games/${game?.id}/icon`}
                        method={"POST"}
                        multiple={false}
                        showUploadList={false}
                        onChange={(info) => {
                            const { status, percent } = info.file;

                            if (status === "uploading") {
                                notificationStore?.api?.info({
                                    key: "game-icon-upload",
                                    message: "上传中",
                                    description: `比赛图标 ${info.file.name} 上传中 ${percent}%`,
                                    duration: null,
                                });
                            }

                            if (status === "done") {
                                notificationStore?.api?.success({
                                    key: "game-icon-upload",
                                    message: "上传成功",
                                    description: `比赛图标 ${info.file.name} 上传成功`,
                                });
                            }

                            if (status === "error") {
                                notificationStore?.api?.error({
                                    key: "game-icon-upload",
                                    message: "上传失败",
                                    description: `比赛图标 ${info.file.name} 上传失败`,
                                });
                            }

                            if (status !== "uploading") {
                                sharedStore.setRefresh();
                            }
                        }}
                        css={css`
                            height: 185px;
                            aspect-ratio: 1/1;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        `}
                    >
                        {iconMetadata && (
                            <Image
                                src={`/api/games/${game?.id}/icon?${sharedStore?.refresh}`}
                                preview={false}
                                css={css`
                                    width: 100%;
                                    aspect-ratio: 1/1;
                                `}
                            />
                        )}
                    </Dragger>
                </Flex>
                <Flex
                    vertical
                    gap={8}
                    css={css`
                        height: fit-content;
                    `}
                >
                    <Flex align={"center"}>
                        <span
                            css={css`
                                margin: 2px 0;
                            `}
                        >
                            海报（建议比例 16:9）
                        </span>
                        {posterMetadata && (
                            <Button
                                type={"link"}
                                size={"small"}
                                danger
                                icon={<TrashBinTrashLinear />}
                                onClick={handleDeletePoster}
                            />
                        )}
                    </Flex>
                    <Dragger
                        name={"file"}
                        action={`/api/games/${game?.id}/poster`}
                        method={"POST"}
                        multiple={false}
                        showUploadList={false}
                        onChange={(info) => {
                            const { status, percent } = info.file;

                            if (status === "uploading") {
                                notificationStore?.api?.info({
                                    key: "game-poster-upload",
                                    message: "上传中",
                                    description: `比赛海报 ${info.file.name} 上传中 ${percent}%`,
                                    duration: null,
                                });
                            }

                            if (status === "done") {
                                notificationStore?.api?.success({
                                    key: "game-poster-upload",
                                    message: "上传成功",
                                    description: `比赛海报 ${info.file.name} 上传成功`,
                                });
                            }

                            if (status === "error") {
                                notificationStore?.api?.error({
                                    key: "game-poster-upload",
                                    message: "上传失败",
                                    description: `比赛海报 ${info.file.name} 上传失败`,
                                });
                            }

                            if (status !== "uploading") {
                                sharedStore.setRefresh();
                            }
                        }}
                        css={css`
                            height: 185px;
                            aspect-ratio: 16/10;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        `}
                    >
                        {posterMetadata && (
                            <Image
                                src={`/api/games/${game?.id}/poster?${sharedStore?.refresh}`}
                                preview={false}
                                css={css`
                                    width: 100%;
                                    aspect-ratio: 16/9;
                                `}
                            />
                        )}
                    </Dragger>
                </Flex>
            </Flex>
            <Form.Item name={"description"} label={"描述（支持 Markdown）"}>
                <Input.TextArea rows={12} />
            </Form.Item>
            <Space.Compact
                css={css`
                    width: 100%;
                `}
            >
                <Form.Item
                    name={"member_limit_min"}
                    label={"团队最小人数"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    css={css`
                        width: 100%;
                    `}
                >
                    <InputNumber
                        min={1}
                        css={css`
                            width: 100%;
                        `}
                    />
                </Form.Item>
                <Form.Item
                    name={"member_limit_max"}
                    label={"团队最大人数"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    css={css`
                        width: 100%;
                    `}
                >
                    <InputNumber
                        min={1}
                        css={css`
                            width: 100%;
                        `}
                    />
                </Form.Item>
            </Space.Compact>
            <Flex
                justify={"space-between"}
                css={css`
                    gap: 16px;
                `}
            >
                <Form.Item
                    name={"is_public"}
                    label={
                        "是否为公开赛（若为公开赛，则任何团队免审核即可参赛）"
                    }
                    layout={"horizontal"}
                >
                    <Switch />
                </Form.Item>
                <Form.Item
                    name={"is_need_write_up"}
                    label={"是否需要提交题解"}
                    layout={"horizontal"}
                >
                    <Switch />
                </Form.Item>
            </Flex>
            <Space.Compact
                css={css`
                    width: 100%;
                `}
            >
                <Form.Item
                    name={"started_at"}
                    label={"开始于"}
                    help={"可进入比赛题目页面"}
                    rules={[
                        {
                            required: true,
                            message: "请输入开始时间",
                        },
                    ]}
                    css={css`
                        width: 100%;
                    `}
                >
                    <DatePicker
                        showTime
                        css={css`
                            width: 100%;
                        `}
                    />
                </Form.Item>
                <Form.Item
                    name={"frozen_at"}
                    label={"冻结于"}
                    help={"无法提交答案，但可提交题解"}
                    rules={[
                        {
                            required: true,
                            message: "请输入冻结时间",
                        },
                    ]}
                    css={css`
                        width: 100%;
                    `}
                >
                    <DatePicker
                        showTime
                        css={css`
                            width: 100%;
                        `}
                    />
                </Form.Item>
                <Form.Item
                    name={"ended_at"}
                    label={"结束于"}
                    help={"不可进入比赛题目页面"}
                    rules={[
                        {
                            required: true,
                            message: "请输入结束时间",
                        },
                    ]}
                    css={css`
                        width: 100%;
                    `}
                >
                    <DatePicker
                        showTime
                        css={css`
                            width: 100%;
                        `}
                    />
                </Form.Item>
            </Space.Compact>

            <Form.Item>
                <Flex justify={"flex-end"}>
                    <Button
                        type={"primary"}
                        htmlType={"submit"}
                        icon={<CheckCircleLinear />}
                    >
                        保存
                    </Button>
                </Flex>
            </Form.Item>
        </Form>
    );
}
