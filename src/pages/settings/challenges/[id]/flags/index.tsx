import { Flag, Type } from "@/models/flag";
import { Button, Flex, Form, Input, Select, Switch } from "antd";
import { useContext, useEffect } from "react";
import { Context } from "../context";
import { css } from "@emotion/react";
import MinusCircleLinear from "~icons/solar/minus-circle-linear";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { updateChallenge } from "@/api/challenge";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { useKeyPress } from "ahooks";

export default function () {
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const { challenge } = useContext(Context);
    const [form] = Form.useForm<{
        flags: Array<Flag>;
    }>();

    useEffect(() => {
        form.setFieldValue("flags", challenge?.flags);
    }, [challenge]);

    const flags = Form.useWatch("flags", form) || [];

    function handleChallengeUpdate() {
        updateChallenge({
            id: challenge?.id,
            flags: form.getFieldValue("flags"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: `题目 ${res?.data?.title} Flag 信息已更新`,
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
            form={form}
            autoComplete="off"
            onFinish={() => handleChallengeUpdate()}
        >
            <Form.List name={"flags"}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => {
                            const type = flags[name]?.type;

                            return (
                                <Flex
                                    key={key}
                                    css={css`
                                        display: flex;
                                        margin: 8px 0;
                                        gap: 16px;
                                    `}
                                >
                                    <Form.Item
                                        name={[name, "type"]}
                                        required
                                        label={"类型"}
                                        initialValue={Type.Static}
                                        css={css`
                                            width: 20%;
                                        `}
                                        {...restField}
                                    >
                                        <Select
                                            options={[
                                                {
                                                    value: Type.Static,
                                                    label: "静态",
                                                },
                                                {
                                                    value: Type.Pattern,
                                                    label: "正则表达式",
                                                },
                                                {
                                                    value: Type.Dynamic,
                                                    label: "动态",
                                                    disabled:
                                                        !challenge?.is_dynamic,
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={[name, "value"]}
                                        required
                                        label={"Flag 字符串"}
                                        css={css`
                                            flex: 1;
                                        `}
                                        {...restField}
                                    >
                                        <Input />
                                    </Form.Item>
                                    {type === Type.Dynamic && (
                                        <Form.Item
                                            name={[name, "env"]}
                                            required
                                            label={"注入至环境变量"}
                                            initialValue={""}
                                            {...restField}
                                        >
                                            <Input placeholder={"FLAG"} />
                                        </Form.Item>
                                    )}
                                    {type !== Type.Dynamic && (
                                        <Form.Item
                                            name={[name, "banned"]}
                                            required
                                            label={"封禁 Flag"}
                                            initialValue={false}
                                            {...restField}
                                        >
                                            <Switch />
                                        </Form.Item>
                                    )}
                                    <Button
                                        type={"text"}
                                        icon={<MinusCircleLinear />}
                                        onClick={() => remove(name)}
                                    />
                                </Flex>
                            );
                        })}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block>
                                添加 Flag
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
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
