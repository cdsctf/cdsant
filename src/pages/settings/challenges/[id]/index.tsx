import { Button, Flex, Form, Input, Select, Switch } from "antd";
import { useContext, useEffect } from "react";
import { Context } from "./context";
import { useCategoryStore } from "@/stores/category";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { css } from "@emotion/react";
import { updateChallenge } from "@/api/challenge";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { useKeyPress } from "ahooks";

export default function () {
    const categoryStore = useCategoryStore();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const { challenge } = useContext(Context);
    const [form] = Form.useForm<{
        title: string;
        category: number;
        description: string;
        is_dynamic: boolean;
        has_attachment: boolean;
    }>();

    useEffect(() => {
        form.setFieldsValue({
            title: challenge?.title,
            category: challenge?.category,
            description: challenge?.description,
            is_dynamic: challenge?.is_dynamic,
            has_attachment: challenge?.has_attachment,
        });
    }, [challenge]);

    function handleChallengeUpdate() {
        updateChallenge({
            id: challenge?.id,
            title: form.getFieldValue("title"),
            category: form.getFieldValue("category"),
            description: form.getFieldValue("description"),
            is_dynamic: form.getFieldValue("is_dynamic"),
            has_attachment: form.getFieldValue("has_attachment"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: `题目 ${res?.data?.title} 信息已更新`,
                });
                sharedStore.setRefresh();
            }
        });
    }

    useKeyPress(["ctrl.s"], (e) => {
        e.preventDefault();
        handleChallengeUpdate();
    });

    return (
        <Form
            layout={"vertical"}
            form={form}
            onFinish={() => handleChallengeUpdate()}
            autoComplete="off"
        >
            <Flex
                css={css`
                    gap: 16px;
                `}
            >
                <Form.Item
                    name={"title"}
                    label={"标题"}
                    required
                    css={css`
                        width: 80%;
                    `}
                >
                    <Input size={"large"} placeholder={"请输入题目标题"} />
                </Form.Item>
                <Form.Item
                    name={"category"}
                    label={"分类"}
                    required
                    css={css`
                        width: 20%;
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
            </Flex>
            <Form.Item name={"description"} label={"描述（支持 Markdown）"}>
                <Input.TextArea rows={12} />
            </Form.Item>
            <Flex
                justify={"space-between"}
                css={css`
                    gap: 16px;
                `}
            >
                <Form.Item
                    name={"is_dynamic"}
                    label={"是否需要使用容器"}
                    layout={"horizontal"}
                >
                    <Switch />
                </Form.Item>
                <Form.Item
                    name={"has_attachment"}
                    label={"是否需要提供附件"}
                    layout={"horizontal"}
                >
                    <Switch />
                </Form.Item>
            </Flex>
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
