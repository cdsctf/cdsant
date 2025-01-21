import { useThemeStore } from "@/stores/theme";
import {
    Button,
    Layout,
    Image,
    Avatar,
    Dropdown,
    Menu,
    Divider,
    theme,
    Grid,
    Flex,
} from "antd";
import LogoutLineDuotone from "~icons/solar/logout-linear";
import Book2Bold from "~icons/solar/book-2-bold";
import FlagBold from "~icons/solar/flag-bold";
import UsersGroupTwoRoundedBold from "~icons/solar/users-group-two-rounded-bold";
import HamburgerMenuLinear from "~icons/solar/hamburger-menu-linear";
import SettingsOutline from "~icons/solar/settings-outline";
import PlanetLinear from "~icons/solar/planet-linear";
import Sun2Bold from "~icons/solar/sun-2-bold";
import MoonBold from "~icons/solar/moon-bold";
import UserCircleBold from "~icons/solar/user-circle-bold";
import { Link, useLocation, useNavigate } from "react-router";
import { cloneElement, CSSProperties, ReactElement, useState } from "react";
import { css } from "@emotion/react";
import { useAuthStore } from "@/stores/auth";
import { useSharedStore } from "@/stores/shared";

const { useToken } = theme;
const { Header } = Layout;

export default function Navbar() {
    const themeStore = useThemeStore();
    const authStore = useAuthStore();
    const sharedStore = useSharedStore();

    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useToken();
    const screens = Grid.useBreakpoint();

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    return (
        <Header
            css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                background-color: ${themeStore.darkMode ? "#001529" : "#fff"};
                box-shadow: ${token.boxShadowTertiary};
                border-bottom: 1px solid rgba(5, 5, 5, 0.06);
                z-index: 2;
            `}
        >
            <Flex
                css={css`
                    flex: 1;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 16px;
                `}
            >
                <Button
                    type="text"
                    onClick={() => navigate("/")}
                    css={css`
                        display: flex;
                        align-items: center;
                        height: 80%;
                        gap: 5px;
                        padding: 2px 16px;
                    `}
                >
                    <Image
                        preview={false}
                        height={42}
                        width={42}
                        src={"/api/configs/icon"}
                        fallback={"/logo.svg"}
                        draggable={false}
                    />
                    {screens.lg && (
                        <h2
                            css={css`
                                margin: 0;
                                font-size: 1.25rem;
                            `}
                        >
                            {sharedStore?.config?.site?.title}
                        </h2>
                    )}
                </Button>
                <Menu
                    mode={"horizontal"}
                    css={css`
                        flex: 1;
                        background-color: transparent;
                        border: none;
                    `}
                    overflowedIndicator={<HamburgerMenuLinear />}
                    triggerSubMenuAction={"click"}
                    selectedKeys={[location.pathname]}
                    items={[
                        {
                            key: "/challenges",
                            label: (
                                <Flex align={"center"} gap={10}>
                                    <Book2Bold />
                                    <Link to={"/challenges"}>题库</Link>
                                </Flex>
                            ),
                        },
                        {
                            key: "/games",
                            label: (
                                <Flex align={"center"} gap={10}>
                                    <FlagBold />
                                    <Link to={"/games"}>比赛</Link>
                                </Flex>
                            ),
                        },
                        {
                            key: "/teams",
                            label: (
                                <Flex align={"center"} gap={10}>
                                    <UsersGroupTwoRoundedBold />
                                    <Link to={"/teams"}>团队</Link>
                                </Flex>
                            ),
                        },
                    ]}
                />
            </Flex>
            <div
                css={css`
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    gap: 16px;
                `}
            >
                <Button
                    type="text"
                    onClick={() =>
                        themeStore?.setDarkMode(!themeStore?.darkMode)
                    }
                    shape={"circle"}
                >
                    {themeStore?.darkMode ? <Sun2Bold /> : <MoonBold />}
                </Button>
                {authStore?.user && (
                    <Dropdown
                        open={dropdownOpen}
                        onOpenChange={(open, _) => setDropdownOpen(open)}
                        trigger={["click"]}
                        placement={"bottom"}
                        dropdownRender={(menu) => (
                            <div
                                css={css`
                                    margin: 20px 16px;
                                    background-color: ${token.colorBgElevated};
                                    border-radius: ${token.borderRadiusLG}px;
                                    box-shadow: ${token.boxShadowSecondary};
                                `}
                            >
                                <div
                                    css={css`
                                        padding: 8px;
                                    `}
                                >
                                    <Button
                                        type="text"
                                        css={css`
                                            display: flex;
                                            height: 56px;
                                            width: 180px;
                                            justify-content: center;
                                            gap: 12px;
                                        `}
                                        onClick={() => {
                                            authStore?.user
                                                ? navigate(
                                                      `/users/${authStore?.user?.id}`
                                                  )
                                                : navigate("/login");
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <Avatar
                                            src={
                                                authStore?.user
                                                    ? `/api/users/${authStore?.user?.id}/avatar`
                                                    : undefined
                                            }
                                            icon={<UserCircleBold />}
                                        />
                                        <Flex vertical>
                                            <span
                                                css={css`
                                                    font-size: 16px;
                                                    width: 100px;
                                                    overflow: hidden;
                                                    text-overflow: ellipsis;
                                                `}
                                            >
                                                {authStore?.user?.nickname}
                                            </span>
                                            <span
                                                css={css`
                                                    font-size: 0.85em;
                                                `}
                                            >
                                                {`# ${authStore?.user?.id
                                                    ?.toString()
                                                    .padStart(6, "0")}`}
                                            </span>
                                        </Flex>
                                    </Button>
                                </div>
                                {authStore?.user && (
                                    <>
                                        <Divider
                                            css={css`
                                                margin: 0;
                                            `}
                                        />
                                        {cloneElement(
                                            menu as ReactElement<{
                                                style: CSSProperties;
                                            }>,
                                            {
                                                style: {
                                                    boxShadow: "none",
                                                },
                                            }
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        menu={{
                            items: [
                                {
                                    key: "2",
                                    icon: <PlanetLinear />,
                                    label: (
                                        <Link to={"/settings"}>
                                            进入管理面板
                                        </Link>
                                    ),
                                },
                                {
                                    key: "3",
                                    icon: <SettingsOutline />,
                                    label: "账户设置",
                                },
                                {
                                    key: "4",
                                    label: "退出登录",
                                    icon: <LogoutLineDuotone />,
                                    danger: true,
                                    onClick: () => {
                                        authStore.clear();
                                    },
                                },
                            ],
                        }}
                    >
                        <Button
                            type={"text"}
                            css={css`
                                gap: 12px;
                            `}
                            size={"large"}
                            icon={
                                <Avatar
                                    src={
                                        authStore?.user
                                            ? `/api/users/${authStore?.user?.id}/avatar`
                                            : undefined
                                    }
                                    icon={<UserCircleBold />}
                                    css={css`
                                        cursor: pointer;
                                    `}
                                />
                            }
                        />
                    </Dropdown>
                )}
                {!authStore?.user && (
                    <Button
                        type={"text"}
                        size={"large"}
                        onClick={() => navigate("/login")}
                    >
                        <span
                            css={css`
                                font-size: 1rem;
                                font-weight: 600;
                            `}
                        >
                            请先登录
                        </span>
                    </Button>
                )}
            </div>
        </Header>
    );
}
