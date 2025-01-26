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
    deleteTeamAvatar,
    getTeamAvatarMetadata,
    updateTeam,
} from "@/api/team";

const { Dragger } = Upload;

export default function () {
    const { token } = theme.useToken();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const { team } = useContext(Context);

    const [avatarMetadata, setAvatarMetadata] = useState<Metadata>();

    const [form] = Form.useForm<{
        name: string;
        email: string;
        slogan: string;
        description: string;
    }>();

    useEffect(() => {
        form.setFieldsValue({
            name: team?.name,
            email: team?.email,
            slogan: team?.slogan,
            description: team?.description,
        });
    }, [team]);

    function handleTeamUpdate() {
        updateTeam({
            id: team?.id!,
            name: form.getFieldValue("name"),
            email: form.getFieldValue("email"),
            slogan: form.getFieldValue("slogan"),
            description: form.getFieldValue("description"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: `团队 ${res?.data?.name} 信息已更新`,
                });
                sharedStore.setRefresh();
            }
        });
    }

    function fetchAvatarMetadata() {
        getTeamAvatarMetadata(team?.id!).then((res) => {
            setAvatarMetadata(res?.data);
        });
    }

    function handleDeleteAvatar() {
        deleteTeamAvatar(team?.id!)
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "删除成功",
                        description: `团队头像已删除`,
                    });
                }
            })
            .finally(() => {
                sharedStore.setRefresh();
            });
    }

    useEffect(() => {
        if (team?.id) {
            fetchAvatarMetadata();
        }
    }, [sharedStore?.refresh, team?.id]);

    useKeyPress(["ctrl.s"], (e) => {
        e.preventDefault();
        handleTeamUpdate();
    });

    return (
        <Form
            layout={"vertical"}
            form={form}
            onFinish={() => handleTeamUpdate()}
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
                            <Input size={"large"} prefix={<UserOutline />} />
                        </Form.Item>
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
                    </Space.Compact>
                    <Form.Item name={"slogan"} label={"标语"}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
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
                        action={`/api/teams/${team?.id}/avatar`}
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
                            height: 195px;
                            aspect-ratio: 1/1;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        `}
                    >
                        {avatarMetadata && (
                            <Image
                                src={`/api/teams/${team?.id}/avatar?${sharedStore?.refresh}`}
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
