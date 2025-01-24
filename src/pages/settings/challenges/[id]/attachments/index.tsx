import {
    deleteChallengeAttachment,
    getChallengeAttachmentMetadata,
} from "@/api/challenge";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import { Button, Flex, Input, Space, Upload } from "antd";
import { css } from "@emotion/react";
import InboxOutLinear from "~icons/solar/inbox-out-linear";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { Metadata } from "@/models/media";

const { Dragger } = Upload;

export default function () {
    const { challenge } = useContext(Context);
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const [metadata, setMetadata] = useState<Metadata>();

    function fetchChallengeAttachmentMetadata() {
        getChallengeAttachmentMetadata(challenge?.id!).then((res) => {
            setMetadata(res.data);
        });
    }

    function handleChallengeAttachmentDelete() {
        deleteChallengeAttachment(challenge?.id!)
            .then(() => {
                notificationStore?.api?.success({
                    message: "删除成功",
                    description: "附件删除成功",
                });
            })
            .finally(() => {
                sharedStore.setRefresh();
            });
    }

    useEffect(() => {
        if (challenge) {
            fetchChallengeAttachmentMetadata();
        }
    }, [challenge, sharedStore.refresh]);

    return (
        <Flex vertical gap={16}>
            <Dragger
                name={"file"}
                multiple={false}
                showUploadList={false}
                action={`/api/challenges/${challenge?.id}/attachment`}
                method={"POST"}
                onChange={(info) => {
                    const { status, percent } = info.file;

                    if (status === "uploading") {
                        notificationStore?.api?.info({
                            key: "attachment-upload",
                            message: "上传中",
                            description: `文件 ${info.file.name} 上传中 ${percent}%`,
                            duration: null,
                        });
                    }

                    if (status === "done") {
                        notificationStore?.api?.success({
                            key: "attachment-upload",
                            message: "上传成功",
                            description: `文件 ${info.file.name} 上传成功`,
                        });
                    }

                    if (status === "error") {
                        notificationStore?.api?.error({
                            key: "attachment-upload",
                            message: "上传失败",
                            description: `文件 ${info.file.name} 上传失败`,
                        });
                    }

                    if (status !== "uploading") {
                        sharedStore.setRefresh();
                    }
                }}
            >
                <p
                    className="ant-upload-drag-icon"
                    css={css`
                        font-size: 2rem;
                    `}
                >
                    <InboxOutLinear />
                </p>
                <p className="ant-upload-text">
                    点击或拖拽文件到该区域进行上传
                </p>
                <p className="ant-upload-hint">
                    建议使用压缩包打包本题全部附件
                </p>
            </Dragger>
            <Space.Compact
                size={"large"}
                css={css`
                    caret-color: transparent;
                    width: 100%;
                `}
            >
                <Input
                    value={metadata?.filename}
                    addonBefore={"文件名"}
                    readOnly
                    css={css`
                        width: 60%;
                    `}
                />
                <Input
                    value={metadata?.size}
                    addonBefore={"文件大小"}
                    readOnly
                    css={css`
                        width: 40%;
                    `}
                />
                <Button
                    type={"primary"}
                    danger
                    onClick={handleChallengeAttachmentDelete}
                    disabled={!metadata}
                >
                    删除附件
                </Button>
            </Space.Compact>
        </Flex>
    );
}
