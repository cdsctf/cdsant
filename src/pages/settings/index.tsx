import { useAuthStore } from "@/stores/auth";
import { css } from "@emotion/react";

export default function () {
    const authStore = useAuthStore();

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
            你好，{authStore?.user?.nickname}！
        </div>
    );
}
