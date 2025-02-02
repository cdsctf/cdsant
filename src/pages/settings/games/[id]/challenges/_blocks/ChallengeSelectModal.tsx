import { getChallenges } from "@/api/challenge";
import { Challenge } from "@/models/challenge";
import { useCategoryStore } from "@/stores/category";
import { css } from "@emotion/react";
import { Button, Flex, Grid, Input, Modal, Space, theme } from "antd";
import { useEffect, useState } from "react";
import CheckCircleLinear from "~icons/solar/check-circle-linear";

export interface ChallengeSelectModalProps {
    onClose: () => void;
    onConfirm: (challenge: Challenge) => void;
}

export default function ChallengeSelectModal(props: ChallengeSelectModalProps) {
    const { onClose, onConfirm } = props;
    const { token } = theme.useToken();
    const categoryStore = useCategoryStore();

    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState<Array<Challenge>>();

    function fetchChallenges() {
        getChallenges({
            id: id.length ? id : undefined,
            title: title,
            page: 1,
            size: 10,
        }).then((res) => {
            setOptions(res?.data);
        });
    }

    useEffect(() => {
        fetchChallenges();
    }, [title, id]);

    return (
        <Flex vertical gap={16}>
            <Space.Compact>
                <Input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder={"ID"}
                    css={css`
                        width: 30%;
                    `}
                />
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={"标题"}
                />
            </Space.Compact>
            <Flex vertical gap={16}>
                {options?.map((challenge) => (
                    <Flex
                        key={challenge?.id}
                        justify={"space-between"}
                        align={"center"}
                    >
                        <Flex gap={8} align={"center"}>
                            <Flex
                                align={"center"}
                                css={css`
                                    color: ${categoryStore?.getCategory(
                                        challenge?.category
                                    )?.color};
                                `}
                            >
                                {
                                    categoryStore?.getCategory(
                                        challenge?.category
                                    )?.icon
                                }
                            </Flex>
                            <span>{challenge?.title}</span>
                            <span
                                css={css`
                                    color: ${token.colorTextSecondary};
                                `}
                            >{`<${challenge?.id}>`}</span>
                        </Flex>
                        <Button
                            type={"text"}
                            icon={<CheckCircleLinear />}
                            onClick={() => {
                                onConfirm(challenge);
                                onClose();
                            }}
                        />
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}
