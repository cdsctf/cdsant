import {
    Button,
    Flex,
    Form,
    Input,
    Image,
    Space,
    Upload,
    theme,
    Select,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { Context } from "./context";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { css } from "@emotion/react";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { useKeyPress } from "ahooks";
import UserOutline from "~icons/solar/user-outline";
import MailBoxLinear from "~icons/solar/mailbox-linear";
import LockPasswordOutline from "~icons/solar/lock-password-outline";
import { Metadata } from "@/models/media";
import TrashBinTrashLinear from "~icons/solar/trash-bin-trash-linear";
import { Group } from "@/models/user";
import {
    deleteUserAvatar,
    getUserAvatarMetadata,
    updateUser,
} from "@/api/user";

const { Dragger } = Upload;

export default function () {
    const { token } = theme.useToken();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const { user } = useContext(Context);

    const [avatarMetadata, setAvatarMetadata] = useState<Metadata>();

    const [form] = Form.useForm<{
        username: string;
        nickname: string;
        email: string;
        password: string;
        group: Group;
        description: string;
    }>();

    useEffect(() => {
        form.setFieldsValue({
            username: user?.username,
            nickname: user?.nickname,
            email: user?.email,
            group: user?.group,
            description: user?.description,
        });
    }, [user]);

    function handleUserUpdate() {
        updateUser({
            id: user?.id!,
            username: form.getFieldValue("username"),
            nickname: form.getFieldValue("nickname"),
            email: form.getFieldValue("email"),
            group: form.getFieldValue("group"),
            password: form.getFieldValue("password") ?? undefined,
            description: form.getFieldValue("description"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: `用户 ${res?.data?.username} 信息已更新`,
                });
                sharedStore.setRefresh();
            }
        });
    }

    function fetchAvatarMetadata() {
        getUserAvatarMetadata(user?.id!).then((res) => {
            setAvatarMetadata(res?.data);
        });
    }

    function handleDeleteAvatar() {
        deleteUserAvatar(user?.id!)
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "删除成功",
                        description: `用户头像已删除`,
                    });
                }
            })
            .finally(() => {
                sharedStore.setRefresh();
            });
    }

    useEffect(() => {
        if (user?.id) {
            fetchAvatarMetadata();
        }
    }, [sharedStore?.refresh, user?.id]);

    useKeyPress(["ctrl.s"], (e) => {
        e.preventDefault();
        handleUserUpdate();
    });

    return (
        <Form
            layout={"vertical"}
            form={form}
            onFinish={() => handleUserUpdate()}
            autoComplete="off"
            css={css`
                display: flex;
                flex-direction: column;
                gap: 12px;
            `}
        >
            <Flex gap={16}>
                <Flex
                    vertical
                    css={css`
                        width: 100%;
                    `}
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
                                    message:
                                        "用户名格式不正确，请输入 3-20 位小写字母、数字或下划线",
                                },
                            ]}
                            css={css`
                                flex: 1;
                            `}
                        >
                            <Input size={"large"} prefix={<UserOutline />} />
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
                                    required: true,
                                    message: "请输入邮箱",
                                },
                                {
                                    type: "email",
                                    message: "邮箱格式不正确",
                                },
                            ]}
                            css={css`
                                flex: 1;
                            `}
                        >
                            <Input size={"large"} prefix={<MailBoxLinear />} />
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
                </Flex>
                <Flex
                    vertical
                    gap={8}
                    css={css`
                        height: fit-content;
                    `}
                >
                    <Flex align={"center"}>
                        <span
                            css={css`
                                margin: 2px 0;
                            `}
                        >
                            头像
                        </span>
                        {avatarMetadata && (
                            <Button
                                type={"link"}
                                size={"small"}
                                danger
                                icon={<TrashBinTrashLinear />}
                                onClick={handleDeleteAvatar}
                            />
                        )}
                    </Flex>
                    <Dragger
                        name={"file"}
                        action={`/api/users/${user?.id}/avatar`}
                        method={"POST"}
                        multiple={false}
                        showUploadList={false}
                        onChange={(info) => {
                            const { status, percent } = info.file;

                            if (status === "uploading") {
                                notificationStore?.api?.info({
                                    key: "user-avatar-upload",
                                    message: "上传中",
                                    description: `用户头像 ${info.file.name} 上传中 ${percent}%`,
                                    duration: null,
                                });
                            }

                            if (status === "done") {
                                notificationStore?.api?.success({
                                    key: "user-avatar-upload",
                                    message: "上传成功",
                                    description: `用户头像 ${info.file.name} 上传成功`,
                                });
                            }

                            if (status === "error") {
                                notificationStore?.api?.error({
                                    key: "user-avatar-upload",
                                    message: "上传失败",
                                    description: `用户头像 ${info.file.name} 上传失败`,
                                });
                            }

                            if (status !== "uploading") {
                                sharedStore.setRefresh();
                            }
                        }}
                        style={{ borderRadius: 9999 }}
                        css={css`
                            height: 135px;
                            aspect-ratio: 1/1;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        `}
                    >
                        {avatarMetadata && (
                            <Image
                                src={`/api/users/${user?.id}/avatar?${sharedStore?.refresh}`}
                                preview={false}
                                css={css`
                                    width: 100%;
                                    aspect-ratio: 1/1;
                                    border-radius: 9999px;
                                `}
                            />
                        )}
                    </Dragger>
                </Flex>
            </Flex>

            <Form.Item name={"description"} label={"简介（支持 Markdown）"}>
                <Input.TextArea rows={8} />
            </Form.Item>

            <Form.Item name={"password"} label={"密码（若需修改则填写）"}>
                <Input prefix={<LockPasswordOutline />} />
            </Form.Item>

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
