import { getCaptcha } from "@/api/config";
import { useConfigStore } from "@/stores/config";
import { useThemeStore } from "@/stores/theme";
import { css } from "@emotion/react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Turnstile } from "@marsidev/react-turnstile";
import { useCounter } from "ahooks";
import { Button, Input, Space, Image, Flex } from "antd";
import { useEffect, useState } from "react";
import RefreshLinear from "~icons/solar/refresh-linear";
import CalculatorMinimalisticLinear from "~icons/solar/calculator-minimalistic-linear";
import CryptoJS from "crypto-js";

export interface CaptchaProps {
    onChange: (captcha?: { id?: string; content?: string }) => void;
}

export function Captcha(props: CaptchaProps) {
    const { onChange } = props;
    const configStore = useConfigStore();
    const themeStore = useThemeStore();

    switch (configStore?.config?.captcha?.provider) {
        case "none":
            return <></>;
        case "turnstile":
            return (
                <Turnstile
                    siteKey={String(
                        configStore?.config?.captcha?.turnstile?.site_key
                    )}
                    onSuccess={(token) => onChange({ content: token })}
                    options={{
                        size: "flexible",
                        theme: themeStore?.darkMode ? "dark" : "light",
                    }}
                />
            );
        case "hcaptcha":
            return (
                <HCaptcha
                    sitekey={String(
                        configStore?.config?.captcha?.hcaptcha?.site_key
                    )}
                    onVerify={(token) => onChange({ content: token })}
                />
            );
        case "pow":
            return <PowCaptcha onChange={onChange} />;
        case "image":
            return <ImageCaptcha onChange={onChange} />;
    }
}

function PowCaptcha(props: CaptchaProps) {
    const { onChange } = props;

    const [refresh, { inc }] = useCounter(0);
    const [loading, setLoading] = useState<boolean>(false);

    const [result, setResult] = useState<string>();
    const [id, setId] = useState<string>();

    useEffect(() => {
        const calculateWorker = new Worker(
            new URL("@/workers/pow.ts", import.meta.url),
            { type: "module" }
        );

        calculateWorker.onmessage = (e) => {
            const result = e.data;
            setResult(result);
            setLoading(false);
        };

        async function fetchCaptchaData() {
            setLoading(true);
            const res = await getCaptcha();
            const d = Number(res.data?.challenge?.split("#")[0]);
            const c = res.data?.challenge?.split("#")[1];
            setId(res.data?.id);

            calculateWorker.postMessage({ c, d });
        }

        fetchCaptchaData();

        return () => {
            calculateWorker.terminate();
        };
    }, [refresh]);

    useEffect(() => {
        onChange({
            id,
            content: result,
        });
    }, [id, result]);

    return (
        <Space.Compact
            size="large"
            css={css`
                width: 100%;
            `}
        >
            <Input
                readOnly
                value={result}
                prefix={<CalculatorMinimalisticLinear />}
            />
            <Button
                type={"primary"}
                icon={<RefreshLinear />}
                loading={loading}
                onClick={() => inc()}
            />
        </Space.Compact>
    );
}

function ImageCaptcha(props: CaptchaProps) {
    const { onChange } = props;

    const [refresh, { inc }] = useCounter(0);
    const [loading, setLoading] = useState<boolean>(false);

    const [result, setResult] = useState<string>();
    const [id, setId] = useState<string>();
    const [challenge, setChallenge] = useState<string>();

    async function fetchCaptchaData() {
        setLoading(true);
        const res = await getCaptcha();
        setId(res.data?.id);
        setChallenge(res.data?.challenge);
    }

    useEffect(() => {
        fetchCaptchaData();
    }, [refresh]);

    useEffect(() => {
        onChange({
            id,
            content: result,
        });
    }, [id, result]);

    return (
        <Space.Compact
            size="large"
            css={css`
                width: 100%;
            `}
        >
            <Input value={result} onChange={(e) => setResult(e.target.value)} />
            <Image
                src={`data:image/svg+xml;base64,${CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(String(challenge)))}`}
                preview={false}
                onClick={() => inc()}
                draggable={false}
                style={{
                    height: 40,
                    width: 60,
                }}
            />
        </Space.Compact>
    );
}
