import { css } from "@emotion/react";
import { Button, Card, Flex, Form, Grid, Input, Image, theme } from "antd";
import UserOutline from "~icons/solar/user-outline";
import LockPasswordOutline from "~icons/solar/lock-password-outline";
import { login } from "@/api/user";
import { useAuthStore } from "@/stores/auth";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useNotificationStore } from "@/stores/notification";
import { useConfigStore } from "@/stores/config";
import { Captcha } from "@/components/widgets/Captcha";
import { useSharedStore } from "@/stores/shared";

export default function () {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const notificationStore = useNotificationStore();
    const configStore = useConfigStore();
    const sharedStore = useSharedStore();

    const { token } = theme.useToken();
    const [form] = Form.useForm<{
        account: string;
        password: string;
        captcha?: {
            id?: string;
            content?: string;
        };
    }>();
    const screens = Grid.useBreakpoint();

    const [loading, setLoading] = useState<boolean>(false);

    function handleLogin() {
        setLoading(true);
        login({
            account: form.getFieldValue("account"),
            password: form.getFieldValue("password"),
            captcha: form.getFieldValue("captcha"),
        })
            .then((res) => {
                if (res.code === 200) {
                    authStore.setUser(res.data);
                    notificationStore?.api?.success({
                        message: "登录成功",
                        description: "欢迎回来",
                    });
                    navigate("/");
                }

                if (res.code === 400) {
                    notificationStore?.api?.error({
                        message: "登录失败",
                        description: "用户名或密码错误",
                    });
                }

                if (res.code === 410) {
                    notificationStore?.api?.error({
                        message: "登录失败",
                        description: "验证码已失效",
                    });
                    sharedStore.setRefresh();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div
            css={css`
                flex: 1;
                display: flex;
                width: 100%;
                justify-content: center;
                align-items: center;
            `}
        >
            <Card
                css={css`
                    display: flex;
                    flex-direction: column;
                    width: ${screens.lg ? "35vw" : "100vw"};
                    min-height: ${screens.md ? "400px" : "calc(100vh - 64px)"};
                    justify-content: center;
                    align-items: center;
                    box-shadow: ${token.boxShadow};
                `}
            >
                <div
                    css={css`
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    `}
                >
                    <Flex
                        justify={"center"}
                        align={"center"}
                        gap={12}
                        css={css`
                            user-select: none;
                        `}
                    >
                        <Image
                            preview={false}
                            height={64}
                            width={64}
                            src={"/logo.svg"}
                            fallback={"/logo.svg"}
                            draggable={false}
                        />
                        {screens.lg && (
                            <h2
                                css={css`
                                    margin: 0;
                                    font-size: 1.5rem;
                                `}
                            >
                                登录
                            </h2>
                        )}
                    </Flex>
                    <Form
                        form={form}
                        name="login"
                        onFinish={() => handleLogin()}
                        autoComplete="off"
                        css={css`
                            display: flex;
                            flex-direction: column;
                        `}
                    >
                        <Form.Item
                            name={"account"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入用户名或邮箱",
                                },
                            ]}
                        >
                            <Input
                                placeholder={"用户名或邮箱"}
                                size={"large"}
                                prefix={<UserOutline />}
                            />
                        </Form.Item>
                        <Form.Item
                            name={"password"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入密码",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder={"密码"}
                                size={"large"}
                                prefix={<LockPasswordOutline />}
                            />
                        </Form.Item>
                        {configStore?.config?.captcha?.provider !== "none" && (
                            <Form.Item>
                                <Captcha
                                    onChange={(captcha) =>
                                        form.setFieldsValue({
                                            captcha,
                                        })
                                    }
                                />
                            </Form.Item>
                        )}
                        <Flex justify={"end"}>
                            <span
                                css={css`
                                    color: ${token.colorTextDescription};
                                `}
                            >
                                还没有账号？在这里
                                <Link to={"/register"}>注册</Link>。
                            </span>
                        </Flex>
                        <Button
                            type={"primary"}
                            size={"large"}
                            htmlType={"submit"}
                            loading={loading}
                            block
                        >
                            登录
                        </Button>
                    </Form>
                </div>
            </Card>
        </div>
    );
}
