import { Alert, Button, Flex, Form, Input, InputNumber, Space } from "antd";
import { useContext, useEffect } from "react";
import { Context } from "../context";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import AddCircleLinear from "~icons/solar/add-circle-linear";
import MinusCircleLinear from "~icons/solar/minus-circle-linear";
import { css } from "@emotion/react";
import { updateChallenge } from "@/api/challenge";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { useKeyPress } from "ahooks";
import { Env } from "@/models/env";

export default function () {
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const { challenge } = useContext(Context);
    const [form] = Form.useForm<
        Env & {
            envs: Array<{
                key: string;
                value: string;
            }>;
        }
    >();

    useEffect(() => {
        form.setFieldsValue({
            image: challenge?.env?.image,
            envs: Object.keys(challenge?.env?.envs || {}).map(
                (key: string) => ({
                    key,
                    value: challenge?.env?.envs[key],
                })
            ),
            duration: challenge?.env?.duration,
            cpu_limit: challenge?.env?.cpu_limit,
            memory_limit: challenge?.env?.memory_limit,
            ports: challenge?.env?.ports,
        });
    }, [challenge]);

    function handleChallengeUpdate() {
        updateChallenge({
            id: challenge?.id,
            env: {
                image: form.getFieldValue("image"),
                envs:
                    Object.fromEntries(
                        form
                            .getFieldValue("envs")
                            .map((env: { key: string; value: string }) => [
                                env.key,
                                env.value,
                            ])
                    ) || [],
                duration: form.getFieldValue("duration"),
                cpu_limit: form.getFieldValue("cpu_limit"),
                memory_limit: form.getFieldValue("memory_limit"),
                ports: form.getFieldValue("ports") || [],
            },
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: `题目 ${res?.data?.title} 容器信息已更新`,
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
            <Form.Item>
                <Flex align={"center"} gap={12}>
                    <Alert
                        message={"题目所依赖的容器镜像，及相关配置。"}
                        showIcon
                        css={css`
                            flex: 1;
                        `}
                    />
                    <Button
                        size={"large"}
                        type={"primary"}
                        htmlType={"submit"}
                        icon={<CheckCircleLinear />}
                    >
                        保存
                    </Button>
                </Flex>
            </Form.Item>
            <h3>基本</h3>
            <Flex
                align={"center"}
                css={css`
                    gap: 16px;
                `}
            >
                <Form.Item
                    name={["image"]}
                    label={"镜像名"}
                    required
                    css={css`
                        flex: 1;
                    `}
                >
                    <Input
                        size={"large"}
                        placeholder={"请输入镜像名（REPOSITORY:TAG）"}
                    />
                </Form.Item>
                <Form.Item
                    name={["duration"]}
                    label={"持续时间（秒）"}
                    required
                    initialValue={1800}
                >
                    <InputNumber
                        min={10}
                        size={"large"}
                        css={css`
                            width: 150px;
                        `}
                    />
                </Form.Item>
                <Form.Item
                    name={["cpu_limit"]}
                    label={"CPU 限制"}
                    required
                    initialValue={2}
                >
                    <InputNumber
                        min={2}
                        size={"large"}
                        css={css`
                            width: 150px;
                        `}
                    />
                </Form.Item>
                <Form.Item
                    name={["memory_limit"]}
                    label={"内存限制（MB）"}
                    required
                    initialValue={32}
                >
                    <InputNumber
                        min={32}
                        size={"large"}
                        css={css`
                            width: 150px;
                        `}
                    />
                </Form.Item>
            </Flex>
            <h3>端口</h3>
            <Form.List name={["ports"]}>
                {(fields, { add, remove }) => (
                    <Flex
                        gap={16}
                        css={css`
                            flex-wrap: wrap;
                        `}
                    >
                        {fields.map(({ key, name, ...restFields }) => (
                            <Flex
                                key={key}
                                css={css`
                                    gap: 8px;
                                `}
                            >
                                <Form.Item name={name} {...restFields}>
                                    <InputNumber min={0} max={65535} />
                                </Form.Item>
                                <Button
                                    type={"text"}
                                    icon={<MinusCircleLinear />}
                                    onClick={() => remove(name)}
                                />
                            </Flex>
                        ))}
                        <Form.Item>
                            <Button
                                type={"dashed"}
                                onClick={() => add()}
                                icon={<AddCircleLinear />}
                            >
                                添加端口
                            </Button>
                        </Form.Item>
                    </Flex>
                )}
            </Form.List>
            <h3>环境变量</h3>
            <Form.List name={["envs"]}>
                {(fields, { add, remove }) => (
                    <Flex
                        gap={16}
                        css={css`
                            flex-wrap: wrap;
                        `}
                    >
                        {fields.map(({ key, name, ...restFields }) => (
                            <Flex
                                key={key}
                                css={css`
                                    gap: 8px;
                                `}
                            >
                                <Space.Compact>
                                    <Form.Item
                                        name={[name, "key"]}
                                        {...restFields}
                                    >
                                        <Input addonBefore={"K"} />
                                    </Form.Item>
                                    <Form.Item
                                        name={[name, "value"]}
                                        {...restFields}
                                    >
                                        <Input addonBefore={"V"} />
                                    </Form.Item>
                                </Space.Compact>
                                <Button
                                    type={"text"}
                                    icon={<MinusCircleLinear />}
                                    onClick={() => remove(name)}
                                />
                            </Flex>
                        ))}
                        <Form.Item>
                            <Button
                                type={"dashed"}
                                onClick={() => add()}
                                icon={<AddCircleLinear />}
                            >
                                添加环境变量
                            </Button>
                        </Form.Item>
                    </Flex>
                )}
            </Form.List>
        </Form>
    );
}
