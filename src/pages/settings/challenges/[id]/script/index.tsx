import { Button, Flex, Form, theme } from "antd";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { lintChallengeScript, updateChallenge } from "@/api/challenge";
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
        script: string;
    }>();

    useEffect(() => {
        form.setFieldValue("script", challenge?.script);
    }, [challenge]);

    const [lint, setLint] = useState<string>();

    function handleChallengeUpdate() {
        updateChallenge({
            id: challenge?.id,
            script: form.getFieldValue("script"),
        }).then((res) => {
            if (res.code === 200) {
                notificationStore?.api?.success({
                    message: "更新成功",
                    description: `题目 ${res?.data?.title} 脚本信息已更新`,
                });
                sharedStore.setRefresh();
                handleLintChallengeScript();
            }
        });
    }

    function handleLintChallengeScript() {
        lintChallengeScript(challenge?.id!).then((res) => {
            setLint(res?.msg);
            console.log(res?.msg);
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
            <Form.Item
                name={"script"}
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
                    height={"52vh"}
                />
            </Form.Item>
            <div
                dangerouslySetInnerHTML={{
                    __html: new AnsiUp().ansi_to_html(lint || ""),
                }}
            />
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
