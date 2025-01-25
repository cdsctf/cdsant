import { createChallenge } from "@/api/challenge";
import { useCategoryStore } from "@/stores/category";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Modal, Grid, Form, Input, Select, Flex, Button } from "antd";
import { useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export interface ChallengeCreateModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ChallengeCreateModal(props: ChallengeCreateModalProps) {
    const { open, onClose } = props;

    const sharedStore = useSharedStore();
    const categoryStore = useCategoryStore();
    const notificationStore = useNotificationStore();
    const screens = Grid.useBreakpoint();
    const [form] = Form.useForm<{
        title: string;
        category: number;
    }>();

    const [loading, setLoading] = useState<boolean>(false);

    function handleChallengeCreate() {
        setLoading(true);
        createChallenge({
            title: form.getFieldValue("title"),
            category: form.getFieldValue("category"),
            description: "",
        })
            .then((res) => {
                notificationStore?.api?.success({
                    message: "创建成功",
                    description: `题目 ${res?.data?.title} 创建成功`,
                });
                sharedStore.setRefresh();
                onClose();
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Modal
            centered
            footer={null}
            closable={false}
            width={screens.md ? "40vw" : "90vw"}
            destroyOnClose
            open={open}
            onCancel={onClose}
            onClose={onClose}
            title={"创建题目"}
        >
            <Form
                form={form}
                layout={"vertical"}
                onFinish={() => handleChallengeCreate()}
                css={css`
                    display: flex;
                    gap: 16px;
                    align-items: end;
                `}
            >
                <Form.Item
                    name={"title"}
                    label={"标题"}
                    required
                    css={css`
                        flex: 1;
                    `}
                >
                    <Input size={"large"} />
                </Form.Item>

                <Form.Item
                    name={"category"}
                    label={"分类"}
                    required
                    initialValue={1}
                    css={css`
                        width: 30%;
                    `}
                >
                    <Select
                        size={"large"}
                        options={categoryStore?.categories?.map((category) => ({
                            value: category?.id,
                            label: (
                                <Flex
                                    align={"center"}
                                    gap={12}
                                    css={css`
                                        color: ${category?.color};
                                    `}
                                >
                                    {category?.icon}
                                    <span>{category?.name?.toUpperCase()}</span>
                                </Flex>
                            ),
                        }))}
                    />
                </Form.Item>
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
        </Modal>
    );
}
