import { Team } from "@/models/team";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Form, Input, Button } from "antd";
import { useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { joinTeam } from "@/api/team";
import { useAuthStore } from "@/stores/auth";

export interface TeamJoinModalProps {
    team?: Team;
    onClose: () => void;
}

export default function TeamJoinModal(props: TeamJoinModalProps) {
    const { team, onClose } = props;

    const authStore = useAuthStore();
    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const [form] = Form.useForm<{
        password: string;
    }>();

    const [loading, setLoading] = useState<boolean>(false);

    function handleJoinTeam() {
        setLoading(true);
        joinTeam({
            user_id: authStore?.user?.id,
            team_id: team?.id!,
            password: form.getFieldValue("password"),
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "加入成功",
                    });
                    sharedStore.setRefresh();
                    onClose();
                }

                if (res.code === 400) {
                    notificationStore?.api?.error({
                        message: "发生了错误",
                        description: res.msg,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Form
            form={form}
            layout={"vertical"}
            onFinish={() => handleJoinTeam()}
            css={css`
                display: flex;
                gap: 15px;
                align-items: end;
            `}
        >
            <Form.Item
                name={"password"}
                label={"密码"}
                rules={[
                    {
                        required: true,
                        message: "请输入密码",
                    },
                ]}
                css={css`
                    flex: 1;
                `}
            >
                <Input.Password size={"large"} />
            </Form.Item>
            <Form.Item
                css={css`
                    display: flex;
                    justify-content: flex-end;
                `}
            >
                <Button
                    size={"large"}
                    type={"primary"}
                    loading={loading}
                    htmlType={"submit"}
                    icon={<CheckCircleLinear />}
                >
                    确定
                </Button>
            </Form.Item>
        </Form>
    );
}
