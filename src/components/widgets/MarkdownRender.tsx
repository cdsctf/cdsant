import { Typography } from "antd";
import { ComponentProps } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.min.css";
import { css } from "@emotion/react";

const { Title, Paragraph, Text, Link } = Typography;

export interface MarkdownRenderProps extends ComponentProps<"div"> {
    src?: string;
}

export function MarkdownRender(props: MarkdownRenderProps) {
    const { src, ...rest } = props;

    return (
        <Typography {...rest}>
            <Markdown
                remarkPlugins={[
                    remarkGfm,
                    remarkParse,
                    remarkMath,
                    remarkRehype,
                ]}
                rehypePlugins={[
                    rehypeKatex,
                    rehypeAutolinkHeadings,
                    rehypeStringify,
                    rehypeHighlight,
                ]}
                components={{
                    pre: ({ children }) => {
                        return (
                            <pre
                                css={css`
                                    border-radius: 12px;
                                    overflow: hidden;
                                    margin: 10px 0;
                                `}
                            >
                                {children}
                            </pre>
                        );
                    },
                    p: ({ children }) => {
                        return <Paragraph>{children}</Paragraph>;
                    },
                    a: ({ children, href }) => {
                        return <Link href={href}>{children}</Link>;
                    },
                    h1: ({ children }) => {
                        return <Title level={1}>{children}</Title>;
                    },
                    h2: ({ children }) => {
                        return <Title level={2}>{children}</Title>;
                    },
                    text: ({ children }) => {
                        return <Text>{children}</Text>;
                    },
                }}
            >
                {src}
            </Markdown>
        </Typography>
    );
}
