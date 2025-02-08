import {
    deleteUserAvatar,
    getUserAvatarMetadata,
    updateUserProfile,
} from "@/api/user";
import { Metadata } from "@/models/media";
import { UpdateUserProfileRequest } from "@/models/user";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { useKeyPress } from "ahooks";
import { Button, Flex, Form, Input, Space, Upload, Image } from "antd";
import { useEffect, useState } from "react";
import UserOutline from "~icons/solar/user-outline";
import MailBoxLinear from "~icons/solar/mailbox-linear";
import TrashBinTrashLinear from "~icons/solar/trash-bin-trash-linear";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

const { Dragger } = Upload;

export default function () {
    const [form] = Form.useForm<UpdateUserProfileRequest>();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const authStore = useAuthStore();

    const [avatarMetadata, setAvatarMetadata] = useState<Metadata>();

    function handleUserProfileUpdate() {
        updateUserProfile({
            email: form.getFieldValue("email"),
            nickname: form.getFieldValue("nickname"),
            description: form.getFieldValue("description"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: `用户 ${res?.data?.username} 信息已更新`,
                });
                authStore?.setUser(res.data);
                sharedStore.setRefresh();
            }
        });
    }

    function fetchAvatarMetadata() {
        getUserAvatarMetadata(authStore?.user?.id!).then((res) => {
            setAvatarMetadata(res?.data);
        });
    }

    function handleDeleteAvatar() {
        deleteUserAvatar(authStore?.user?.id!)
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
        if (authStore?.user?.id!) {
            fetchAvatarMetadata();
        }
    }, [sharedStore?.refresh, authStore?.user?.id!]);

    useEffect(() => {
        form.setFieldsValue({
            nickname: authStore?.user?.nickname,
            email: authStore?.user?.email,
            description: authStore?.user?.description,
        });
    }, [authStore?.user]);

    useKeyPress(["ctrl.s"], (e) => {
        e.preventDefault();
        handleUserProfileUpdate();
    });

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
                onFinish={() => handleUserProfileUpdate()}
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
                        <Space.Compact
                            css={css`
                                width: 100%;
                            `}
                        >
                            <Form.Item
                                label={"用户名"}
                                css={css`
                                    flex: 1;
                                `}
                            >
                                <Input
                                    disabled
                                    size={"large"}
                                    prefix={<UserOutline />}
                                    value={authStore?.user?.username}
                                />
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
                                <Input
                                    size={"large"}
                                    prefix={<MailBoxLinear />}
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
                            action={`/api/users/${authStore?.user?.id}/avatar`}
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
                                    src={`/api/users/${authStore?.user?.id}/avatar?${sharedStore?.refresh}`}
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
                    <Input.TextArea rows={12} />
                </Form.Item>

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
