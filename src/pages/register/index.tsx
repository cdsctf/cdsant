import { css } from "@emotion/react";
import {
    Button,
    Card,
    Flex,
    Form,
    Grid,
    Input,
    Image,
    theme,
    Space,
} from "antd";
import UserOutline from "~icons/solar/user-outline";
import LockPasswordOutline from "~icons/solar/lock-password-outline";
import MailBoxLinear from "~icons/solar/mailbox-linear";
import { register } from "@/api/user";
import { useAuthStore } from "@/stores/auth";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useNotificationStore } from "@/stores/notification";
import { useConfigStore } from "@/stores/config";
import { Captcha } from "@/components/widgets/Captcha";
import { useSharedStore } from "@/stores/shared";

export default function () {
    const navigate = useNavigate();
    const notificationStore = useNotificationStore();
    const configStore = useConfigStore();
    const sharedStore = useSharedStore();

    const { token } = theme.useToken();
    const [form] = Form.useForm<{
        username: string;
        nickname: string;
        email: string;
        password: string;
        captcha?: {
            id?: string;
            content?: string;
        };
    }>();
    const screens = Grid.useBreakpoint();

    const [loading, setLoading] = useState<boolean>(false);

    function handleRegister() {
        setLoading(true);
        register({
            username: form.getFieldValue("username"),
            nickname: form.getFieldValue("username"),
            email: form.getFieldValue("email"),
            password: form.getFieldValue("password"),
            captcha: form.getFieldValue("captcha"),
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "注册成功",
                        description: "请登录",
                    });
                    navigate("/login");
                }

                if (res.code === 400) {
                    notificationStore?.api?.error({
                        message: "注册失败",
                        description: res.msg,
                    });
                }

                if (res.code === 409) {
                    notificationStore?.api?.error({
                        message: "注册失败",
                        description: "用户名或邮箱冲突",
                    });
                    sharedStore.setRefresh();
                }

                if (res.code === 410) {
                    notificationStore?.api?.error({
                        message: "注册失败",
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
                                注册
                            </h2>
                        )}
                    </Flex>
                    <Form
                        form={form}
                        name="register"
                        onFinish={() => handleRegister()}
                        autoComplete="off"
                        css={css`
                            display: flex;
                            flex-direction: column;
                        `}
                    >
                        <Space.Compact>
                            <Form.Item
                                name={"username"}
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入用户名",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={"用户名"}
                                    size={"large"}
                                    prefix={<UserOutline />}
                                />
                            </Form.Item>
                            <Form.Item
                                name={"nickname"}
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入昵称",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={"昵称"}
                                    size={"large"}
                                    prefix={<UserOutline />}
                                />
                            </Form.Item>
                        </Space.Compact>
                        <Form.Item
                            name={"email"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入邮箱",
                                },
                            ]}
                        >
                            <Input
                                placeholder={"邮箱"}
                                size={"large"}
                                prefix={<MailBoxLinear />}
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
                                已有账号？在这里
                                <Link to={"/login"}>登录</Link>。
                            </span>
                        </Flex>
                        <Button
                            type={"primary"}
                            size={"large"}
                            htmlType={"submit"}
                            loading={loading}
                            block
                        >
                            注册
                        </Button>
                    </Form>
                </div>
            </Card>
        </div>
    );
}
