import { updateGameChallenge } from "@/api/game";
import CheckCircleLinear from "~icons/solar/check-circle-linear";
import { useCategoryStore } from "@/stores/category";
import { css } from "@emotion/react";
import {
    Button,
    Flex,
    Form,
    Grid,
    InputNumber,
    Modal,
    Space,
    theme,
} from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../../context";
import { useNotificationStore } from "@/stores/notification";
import { useSharedStore } from "@/stores/shared";
import { GameChallenge } from "@/models/game_challenge";
import ReactECharts from "echarts-for-react";
import { curve } from "@/utils/math";

export interface GameChallengeCreateModalProps {
    gameChallenge?: GameChallenge;
    onClose: () => void;
    open: boolean;
}

export default function GameChallengeCreateModal(
    props: GameChallengeCreateModalProps
) {
    const { gameChallenge, onClose, open } = props;
    const screens = Grid.useBreakpoint();
    const categoryStore = useCategoryStore();
    const sharedStore = useSharedStore();
    const notificationStore = useNotificationStore();
    const { token } = theme.useToken();
    const { game } = useContext(Context);

    const [form] = Form.useForm<GameChallenge>();
    const minPtsValue = Form.useWatch("min_pts", form);
    const maxPtsValue = Form.useWatch("max_pts", form);
    const difficultyValue = Form.useWatch("difficulty", form);

    const series = useMemo(() => {
        return [
            {
                data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((x) => {
                    return curve(
                        Number(maxPtsValue),
                        Number(minPtsValue),
                        Number(difficultyValue),
                        x
                    );
                }),
                type: "line",
                smooth: true,
            },
        ];
    }, [minPtsValue, maxPtsValue, difficultyValue]);

    const [loading, setLoading] = useState(false);

    function handleUpdateGameChallenge() {
        setLoading(true);
        updateGameChallenge({
            game_id: game?.id!,
            challenge_id: gameChallenge?.challenge_id!,
            difficulty: form.getFieldValue("difficulty"),
            first_blood_reward_ratio: form.getFieldValue(
                "first_blood_reward_ratio"
            ),
            second_blood_reward_ratio: form.getFieldValue(
                "second_blood_reward_ratio"
            ),
            third_blood_reward_ratio: form.getFieldValue(
                "third_blood_reward_ratio"
            ),
            min_pts: form.getFieldValue("min_pts"),
            max_pts: form.getFieldValue("max_pts"),
        })
            .then((res) => {
                if (res.code === 200) {
                    notificationStore?.api?.success({
                        message: "更新成功",
                        description: `赛题 ${gameChallenge?.challenge?.title} 更新成功`,
                    });
                    onClose();
                    sharedStore.setRefresh();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (open) {
            form.setFieldValue("difficulty", gameChallenge?.difficulty);
            form.setFieldValue(
                "first_blood_reward_ratio",
                gameChallenge?.first_blood_reward_ratio
            );
            form.setFieldValue(
                "second_blood_reward_ratio",
                gameChallenge?.second_blood_reward_ratio
            );
            form.setFieldValue(
                "third_blood_reward_ratio",
                gameChallenge?.third_blood_reward_ratio
            );
            form.setFieldValue("min_pts", gameChallenge?.min_pts);
            form.setFieldValue("max_pts", gameChallenge?.max_pts);
        }
    }, [gameChallenge, open]);

    return (
        <Modal
            centered
            footer={null}
            closable={false}
            width={screens.lg ? "40vw" : "90vw"}
            destroyOnClose
            open={open}
            onCancel={onClose}
            onClose={onClose}
            title={"更新比赛题目"}
        >
            <Flex
                vertical
                gap={16}
                css={css`
                    padding: 1rem 0;
                `}
            >
                <Button
                    size={"large"}
                    disabled
                    css={css`
                        height: 4rem;
                    `}
                >
                    <Flex gap={8} align={"center"}>
                        <Flex
                            align={"center"}
                            css={css`
                                color: ${categoryStore?.getCategory(
                                    gameChallenge?.challenge?.category
                                )?.color};
                            `}
                        >
                            {
                                categoryStore?.getCategory(
                                    gameChallenge?.challenge?.category
                                )?.icon
                            }
                        </Flex>
                        <span>{gameChallenge?.challenge?.title}</span>
                        <span
                            css={css`
                                color: ${token.colorTextSecondary};
                            `}
                        >{`<${gameChallenge?.challenge?.id}>`}</span>
                    </Flex>
                </Button>
                <Form
                    form={form}
                    layout={"vertical"}
                    onFinish={() => handleUpdateGameChallenge()}
                    css={css`
                        width: 100%;
                    `}
                >
                    <Flex vertical>
                        <Flex
                            gap={16}
                            css={css`
                                width: 100%;
                            `}
                        >
                            <Space.Compact
                                size={"large"}
                                css={css`
                                    width: 100%;
                                `}
                            >
                                <Form.Item
                                    name={"min_pts"}
                                    label={"最小分值"}
                                    css={css`
                                        width: 100%;
                                    `}
                                >
                                    <InputNumber
                                        css={css`
                                            width: 100%;
                                        `}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={"max_pts"}
                                    label={"最大分值"}
                                    css={css`
                                        width: 100%;
                                    `}
                                >
                                    <InputNumber
                                        css={css`
                                            width: 100%;
                                        `}
                                    />
                                </Form.Item>
                            </Space.Compact>
                            <Form.Item name={"difficulty"} label={"难度"}>
                                <InputNumber size={"large"} />
                            </Form.Item>
                        </Flex>
                        <Space.Compact
                            css={css`
                                width: 100%;
                            `}
                        >
                            <Form.Item
                                name={"first_blood_reward_ratio"}
                                label={"一血奖励（%）"}
                                css={css`
                                    width: 100%;
                                `}
                            >
                                <InputNumber
                                    css={css`
                                        width: 100%;
                                    `}
                                />
                            </Form.Item>
                            <Form.Item
                                name={"second_blood_reward_ratio"}
                                label={"二血奖励（%）"}
                                css={css`
                                    width: 100%;
                                `}
                            >
                                <InputNumber
                                    css={css`
                                        width: 100%;
                                    `}
                                />
                            </Form.Item>
                            <Form.Item
                                name={"third_blood_reward_ratio"}
                                label={"三血奖励（%）"}
                                css={css`
                                    width: 100%;
                                `}
                            >
                                <InputNumber
                                    css={css`
                                        width: 100%;
                                    `}
                                />
                            </Form.Item>
                        </Space.Compact>
                    </Flex>
                    <Flex justify={"center"}>
                        <ReactECharts
                            option={{
                                xAxis: {
                                    type: "category",
                                    data: [
                                        0, 10, 20, 30, 40, 50, 60, 70, 80, 90,
                                        100,
                                    ],
                                },
                                yAxis: {
                                    type: "value",
                                },
                                series: series,
                            }}
                            style={{
                                height: "300px",
                                width: "580px",
                            }}
                        />
                    </Flex>
                    <Flex
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
                    </Flex>
                </Form>
            </Flex>
        </Modal>
    );
}
