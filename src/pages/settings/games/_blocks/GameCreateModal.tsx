import { createGame } from "@/api/game";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Grid, Form, Input, Button, Space, DatePicker } from "antd";
import { useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export interface GameCreateModalProps {
    onClose: () => void;
}

export default function GameCreateModal(props: GameCreateModalProps) {
    const { onClose } = props;

    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const screens = Grid.useBreakpoint();
    const [form] = Form.useForm<{
        title: string;
        sketch: string;
        started_at: string;
        ended_at: string;
    }>();

    const [loading, setLoading] = useState<boolean>(false);

    function handleChallengeCreate() {
        setLoading(true);
        createGame({
            title: form.getFieldValue("title"),
            sketch: form.getFieldValue("sketch"),
            description: "",
            is_enabled: false,
            is_public: false,
            member_limit_min: 1,
            member_limit_max: 3,
            is_need_write_up: true,
            started_at: Math.ceil(
                new Date(form.getFieldValue("started_at")).getTime() / 1000
            ),
            ended_at: Math.ceil(
                new Date(form.getFieldValue("ended_at")).getTime() / 1000
            ),
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "创建成功",
                        description: `比赛 ${res?.data?.title} 创建成功`,
                    });
                    sharedStore.setRefresh();
                    onClose();
                }

                if (res.code === 400) {
                    notificationStore?.api?.error({
                        message: "创建失败",
                        description: res?.msg,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Form
            form={form}
            layout={"vertical"}
            onFinish={() => handleChallengeCreate()}
        >
            <Form.Item
                name={"title"}
                label={"标题"}
                rules={[
                    {
                        required: true,
                        message: "请输入标题",
                    },
                ]}
            >
                <Input size={"large"} />
            </Form.Item>
            <Form.Item
                name={"sketch"}
                label={"简述"}
                rules={[
                    {
                        required: true,
                        message: "请输入简述",
                    },
                ]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Space.Compact
                css={css`
                    width: 100%;
                `}
            >
                <Form.Item
                    name={"started_at"}
                    label={"开始于"}
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
                    name={"ended_at"}
                    label={"结束于"}
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

            <Form.Item
                css={css`
                    display: flex;
                    justify-content: flex-end;
                `}
            >
                <Button
                    size={"large"}
                    type={"primary"}
                    loading={loading}
                    htmlType={"submit"}
                    icon={<CheckCircleLinear />}
                >
                    确定
                </Button>
            </Form.Item>
        </Form>
    );
}
