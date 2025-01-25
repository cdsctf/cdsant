import { css } from "@emotion/react";

export default function () {
    return (
        <div
            css={css`
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
            `}
        >
            这里是管理面板
        </div>
    );
}
