import { useSharedStore } from "@/stores/shared";
import { css } from "@emotion/react";
import { Flex, Image, theme } from "antd";

export default function () {
    const sharedStore = useSharedStore();
    const { token } = theme.useToken();

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
                    {sharedStore?.config?.site?.title}
                </h1>
            </Flex>
            <h3>{sharedStore?.config?.site?.description}</h3>
        </div>
    );
}
