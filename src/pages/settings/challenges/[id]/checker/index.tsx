import { Alert, Button, Flex, Form, theme } from "antd";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { updateChallengeChecker } from "@/api/challenge";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { useKeyPress } from "ahooks";
import { css } from "@emotion/react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useThemeStore } from "@/stores/theme";
import { AnsiUp } from "ansi_up";

export default function () {
    const { token } = theme.useToken();
    const notificationStore = useNotificationStore();
    const sharedStore = useSharedStore();
    const themeStore = useThemeStore();
    const { challenge } = useContext(Context);
    const [form] = Form.useForm<{
        checker: string;
    }>();

    useEffect(() => {
        form.setFieldValue("checker", challenge?.checker);
    }, [challenge]);

    const [lint, setLint] = useState<string>();

    function handleChallengeUpdate() {
        updateChallengeChecker({
            id: challenge?.id,
            checker: form.getFieldValue("checker"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    key: "challenge-checker-update",
                    message: "更新成功",
                    description: `题目 ${challenge?.title} 脚本信息已更新`,
                });
                sharedStore.setRefresh();
                setLint(res?.msg);
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
            <Form.Item>
                <Flex align={"center"} gap={12}>
                    <Alert
                        message={"题目的评测脚本。请确保编译通过且语义正确。"}
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
            <Form.Item
                name={"checker"}
                css={css`
                    overflow: hidden;
                    border-radius: ${token.borderRadius}px;
                `}
            >
                <AceEditor
                    mode={"rust"}
                    theme={themeStore?.darkMode ? "github_dark" : "github"}
                    fontSize={14}
                    lineHeight={19}
                    showPrintMargin
                    highlightActiveLine
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        enableMobileMenu: true,
                        showLineNumbers: true,
                        tabSize: 4,
                    }}
                    width={"100%"}
                    height={"calc(100vh - 24rem)"}
                />
            </Form.Item>
            <pre
                dangerouslySetInnerHTML={{
                    __html: new AnsiUp().ansi_to_html(lint || ""),
                }}
            />
        </Form>
    );
}
