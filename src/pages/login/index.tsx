import { css } from "@emotion/react";
import { Button, Card, Flex, Form, Grid, Input, Image, theme } from "antd";
import UserOutline from "~icons/solar/user-outline";
import LockPasswordOutline from "~icons/solar/lock-password-outline";
import { login } from "@/api/user";
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useNotificationStore } from "@/stores/notification";
import { Turnstile } from "@marsidev/react-turnstile";
import { useConfigStore } from "@/stores/config";
import { useThemeStore } from "@/stores/theme";

export default function () {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const notificationStore = useNotificationStore();
    const configStore = useConfigStore();
    const themeStore = useThemeStore();

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
                        placement: "bottomRight",
                    });
                    navigate("/");
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
                    height: ${screens.md ? "400px" : "calc(100vh - 64px)"};
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
                                {configStore?.config?.captcha?.provider ===
                                    "turnstile" && (
                                    <Turnstile
                                        siteKey={String(
                                            configStore?.config?.captcha
                                                ?.turnstile?.site_key
                                        )}
                                        onSuccess={(token) =>
                                            form.setFieldsValue({
                                                captcha: {
                                                    content: token,
                                                },
                                            })
                                        }
                                        options={{
                                            size: "flexible",
                                            theme: themeStore?.darkMode
                                                ? "dark"
                                                : "light",
                                        }}
                                    />
                                )}
                            </Form.Item>
                        )}
                        <Button
                            type={"primary"}
                            size={"large"}
                            htmlType={"submit"}
                            loading={loading}
                            css={css`
                                width: 100%;
                            `}
                        >
                            登录
                        </Button>
                    </Form>
                </div>
            </Card>
        </div>
    );
}
