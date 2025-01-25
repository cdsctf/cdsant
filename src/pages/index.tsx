import { useConfigStore } from "@/stores/config";
import { css } from "@emotion/react";
import { Flex, Image } from "antd";

export default function () {
    const configStore = useConfigStore();

    return (
        <div
            css={css`
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 16px;
            `}
        >
            <Flex justify={"center"} align={"center"} gap={36}>
                <Image
                    preview={false}
                    height={128}
                    width={128}
                    src={"/api/configs/icon"}
                    fallback={"/logo.svg"}
                    draggable={false}
                />
                <h1
                    css={css`
                        font-size: 64px;
                    `}
                >
                    {configStore?.meta?.title}
                </h1>
            </Flex>
            <h3>{configStore?.meta?.description}</h3>
        </div>
    );
}
