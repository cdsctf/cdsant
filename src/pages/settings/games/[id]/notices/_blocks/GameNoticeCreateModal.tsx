import { createGameNotice } from "@/api/game";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { css } from "@emotion/react";
import { Button, Flex, Form, Input } from "antd";
import { useContext, useState } from "react";
import { Context } from "../../context";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";

export interface GameNoticeCreateModalProps {
    onClose: () => void;
}

export default function GameNoticeCreateModal(
    props: GameNoticeCreateModalProps
) {
    const { onClose } = props;
    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const { game } = useContext(Context);
    const [form] = Form.useForm<{
        title: string;
        content: string;
    }>();

    const [loading, setLoading] = useState(false);

    function handleCreateGameNotice() {
        setLoading(true);
        createGameNotice({
            game_id: game?.id!,
            title: form.getFieldValue("title"),
            content: form.getFieldValue("content"),
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        key: "notice-create",
                        message: "发布成功",
                        description: `公告 ${res.data?.title} 已发布`,
                    });
                    sharedStore.setRefresh();
                    onClose();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Flex
            vertical
            gap={16}
            css={css`
                padding: 1rem 0;
            `}
        >
            <Form
                form={form}
                onFinish={() => handleCreateGameNotice()}
                layout={"vertical"}
                autoComplete="off"
            >
                <Form.Item
                    name={"title"}
                    label={"标题"}
                    rules={[
                        {
                            required: true,
                            message: "标题不能为空",
                        },
                    ]}
                >
                    <Input size={"large"} />
                </Form.Item>
                <Form.Item
                    name={"content"}
                    label={"内容"}
                    rules={[
                        {
                            required: true,
                            message: "内容不能为空",
                        },
                    ]}
                >
                    <Input.TextArea size={"large"} rows={8} />
                </Form.Item>
                <Flex
                    css={css`
                        display: flex;
                        justify-content: flex-end;
                    `}
                >
                    <Button
                        size={"large"}
                        type={"primary"}
                        htmlType={"submit"}
                        loading={loading}
                        icon={<CheckCircleLinear />}
                        onClick={handleCreateGameNotice}
                    >
                        确定
                    </Button>
                </Flex>
            </Form>
        </Flex>
    );
}
