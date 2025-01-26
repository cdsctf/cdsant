import { createUser } from "@/api/user";
import { Group } from "@/models/user";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Modal, Grid, Form, Input, Select, Flex, Button, Space } from "antd";
import UserOutline from "~icons/solar/user-outline";
import MailBoxLinear from "~icons/solar/mailbox-linear";
import LockPasswordOutline from "~icons/solar/lock-password-outline";
import { useEffect, useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export interface UserCreateModalProps {
    open: boolean;
    onClose: () => void;
}

export default function UserCreateModal(props: UserCreateModalProps) {
    const { open, onClose } = props;

    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const screens = Grid.useBreakpoint();
    const [form] = Form.useForm<{
        username: string;
        nickname: string;
        email: string;
        group: Group;
        password: string;
    }>();

    const [loading, setLoading] = useState<boolean>(false);

    function handleUserCreate() {
        setLoading(true);
        createUser({
            username: form.getFieldValue("username"),
            nickname: form.getFieldValue("nickname"),
            email: form.getFieldValue("email"),
            group: form.getFieldValue("group"),
            password: form.getFieldValue("password"),
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "创建成功",
                        description: `用户 ${res?.data?.username} 创建成功`,
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
            title={"创建用户"}
        >
            <Form
                form={form}
                layout={"vertical"}
                onFinish={() => handleUserCreate()}
                autoComplete="off"
            >
                <Space.Compact
                    css={css`
                        width: 100%;
                    `}
                >
                    <Form.Item
                        name={"username"}
                        label={"用户名"}
                        rules={[
                            {
                                required: true,
                                message: "请输入用户名",
                            },
                            {
                                pattern: /^[a-z0-9_]{3,20}$/,
                                message: "用户名格式不正确",
                            },
                        ]}
                        css={css`
                            flex: 1;
                        `}
                    >
                        <Input prefix={<UserOutline />} size={"large"} />
                    </Form.Item>

                    <Form.Item
                        name={"nickname"}
                        label={"昵称"}
                        rules={[
                            {
                                required: true,
                                message: "请输入昵称",
                            },
                        ]}
                        css={css`
                            flex: 1;
                        `}
                    >
                        <Input size={"large"} />
                    </Form.Item>
                </Space.Compact>

                <Flex
                    gap={16}
                    css={css`
                        width: 100%;
                    `}
                >
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

                    <Form.Item
                        name={"group"}
                        label={"组"}
                        initialValue={Group.User}
                        rules={[
                            {
                                required: true,
                                message: "请选择组",
                            },
                        ]}
                        css={css`
                            width: 30%;
                        `}
                    >
                        <Select
                            size={"large"}
                            options={[
                                { label: "管理员", value: Group.Admin },
                                { label: "普通用户", value: Group.User },
                            ]}
                        />
                    </Form.Item>
                </Flex>

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
                    <Input prefix={<LockPasswordOutline />} size={"large"} />
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
