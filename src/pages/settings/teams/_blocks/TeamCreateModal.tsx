import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Modal, Grid, Form, Input, Flex, Button, Space } from "antd";
import { useEffect, useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import UsersGroupTwoRoundedLinear from "~icons/solar/users-group-two-rounded-linear";
import MailBoxLinear from "~icons/solar/mailbox-linear";
import { createTeam } from "@/api/team";

export interface TeamCreateModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TeamCreateModal(props: TeamCreateModalProps) {
    const { open, onClose } = props;

    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const screens = Grid.useBreakpoint();
    const [form] = Form.useForm<{
        name: string;
        email: string;
        slogan: string;
        password: string;
    }>();

    const [loading, setLoading] = useState<boolean>(false);

    function handleTeamCreate() {
        setLoading(true);
        createTeam({
            name: form.getFieldValue("name"),
            email: form.getFieldValue("email"),
            slogan: form.getFieldValue("slogan"),
            password: form.getFieldValue("password"),
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "创建成功",
                        description: `团队 ${res?.data?.name} 创建成功`,
                    });
                    sharedStore.setRefresh();
                    onClose();
                }

                if (res.code !== 200) {
                    notificationStore?.api?.error({
                        message: "创建失败",
                        description: res.msg,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open]);

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
            title={"创建团队"}
        >
            <Form
                form={form}
                layout={"vertical"}
                onFinish={() => handleTeamCreate()}
                autoComplete="off"
            >
                <Space.Compact
                    css={css`
                        width: 100%;
                    `}
                >
                    <Form.Item
                        name={"name"}
                        label={"团队名"}
                        rules={[
                            {
                                required: true,
                                message: "请输入团队名",
                            },
                        ]}
                        css={css`
                            flex: 1;
                        `}
                    >
                        <Input
                            prefix={<UsersGroupTwoRoundedLinear />}
                            size={"large"}
                        />
                    </Form.Item>

                    <Form.Item
                        name={"email"}
                        label={"邮箱"}
                        rules={[
                            {
                                type: "email",
                                message: "请输入正确的邮箱地址",
                            },
                            {
                                required: true,
                                message: "请输入邮箱地址",
                            },
                        ]}
                        css={css`
                            flex: 1;
                        `}
                    >
                        <Input prefix={<MailBoxLinear />} size={"large"} />
                    </Form.Item>
                </Space.Compact>

                <Form.Item
                    name={"password"}
                    label={"预设密码"}
                    rules={[
                        {
                            required: true,
                            message: "请输入预设密码",
                        },
                    ]}
                >
                    <Input size={"large"} />
                </Form.Item>

                <Form.Item
                    name={"slogan"}
                    label={"标语"}
                    rules={[
                        {
                            required: true,
                            message: "请输入标语",
                        },
                    ]}
                >
                    <Input.TextArea rows={4} size={"large"} />
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
                        loading={loading}
                        htmlType={"submit"}
                        icon={<CheckCircleLinear />}
                    >
                        确定
                    </Button>
                </Flex>
            </Form>
        </Modal>
    );
}
