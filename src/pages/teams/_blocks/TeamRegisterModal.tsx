import { registerTeam } from "@/api/team";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Form, Input, Button, Space } from "antd";
import { useState } from "react";
import UsersGroupTwoRoundedLinear from "~icons/solar/users-group-two-rounded-linear";
import MailBoxLinear from "~icons/solar/mailbox-linear";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export interface TeamRegiserModalProps {
    onClose: () => void;
}

export default function TeamRegisterModal(props: TeamRegiserModalProps) {
    const { onClose } = props;

    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const [form] = Form.useForm<{
        name: string;
        email: string;
        password: string;
    }>();

    const [loading, setLoading] = useState<boolean>(false);

    function handleTeamRegsiter() {
        setLoading(true);
        registerTeam({
            name: form.getFieldValue("name"),
            email: form.getFieldValue("email"),
            password: form.getFieldValue("password"),
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "注册成功",
                        description: `团队 ${res?.data?.name} 注册成功`,
                    });
                    sharedStore.setRefresh();
                    onClose();
                }

                if (res.code === 400) {
                    notificationStore?.api?.error({
                        message: "发生了错误",
                        description: res.msg,
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
            onFinish={() => handleTeamRegsiter()}
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
