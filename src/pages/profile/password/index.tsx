import { updateUserProfilePassword } from "@/api/user";
import { UpdateUserProfilePasswordRequest } from "@/models/user";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Button, Flex, Form, Input } from "antd";
import LockPasswordLinear from "~icons/solar/lock-password-linear";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export default function () {
    const [form] = Form.useForm<
        UpdateUserProfilePasswordRequest & {
            new_password_confirm: string;
        }
    >();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();

    function handleUserProfilePasswordUpdate() {
        updateUserProfilePassword({
            old_password: form.getFieldValue("old_password"),
            new_password: form.getFieldValue("new_password"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: "你的密码已更新",
                });
                sharedStore.setRefresh();
            }

            if (res.code === 400) {
                notificationStore?.api?.error({
                    message: "失败",
                    description: "密码无效",
                });
            }
        });
    }

    return (
        <Flex
            justify={"center"}
            align={"center"}
            css={css`
                height: calc(100vh - 64px);
                overflow: auto;
            `}
        >
            <Form
                layout={"vertical"}
                form={form}
                onFinish={() => handleUserProfilePasswordUpdate()}
                autoComplete="off"
                css={css`
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 60%;
                `}
            >
                <Flex gap={16}>
                    <Flex
                        vertical
                        css={css`
                            width: 100%;
                        `}
                    >
                        <Form.Item
                            name={"old_password"}
                            label={"旧密码"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入旧密码",
                                },
                            ]}
                            css={css`
                                flex: 1;
                            `}
                        >
                            <Input.Password
                                size={"large"}
                                prefix={<LockPasswordLinear />}
                            />
                        </Form.Item>
                        <Form.Item
                            name={"new_password"}
                            label={"新密码"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入新密码",
                                },
                            ]}
                            css={css`
                                flex: 1;
                            `}
                        >
                            <Input.Password
                                size={"large"}
                                prefix={<LockPasswordLinear />}
                            />
                        </Form.Item>
                        <Form.Item
                            name={"new_password_confirm"}
                            label={"确认新密码"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入确认密码",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("new_password") ===
                                                value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("密码不匹配")
                                        );
                                    },
                                }),
                            ]}
                            css={css`
                                flex: 1;
                            `}
                        >
                            <Input.Password
                                size={"large"}
                                prefix={<LockPasswordLinear />}
                            />
                        </Form.Item>
                    </Flex>
                </Flex>

                <Form.Item>
                    <Button
                        type={"primary"}
                        htmlType={"submit"}
                        size={"large"}
                        block
                        icon={<CheckCircleLinear />}
                    >
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
}
