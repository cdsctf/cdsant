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
    Tooltip,
} from "antd";
import LogoutLinear from "~icons/solar/logout-linear";
import Book2Linear from "~icons/solar/book-2-linear";
import FlagLinear from "~icons/solar/flag-linear";
import UsersGroupTwoRoundedLinear from "~icons/solar/users-group-two-rounded-linear";
import StarFallMinimalistic2Linear from "~icons/solar/star-fall-minimalistic-2-linear";
import CupStarLinear from "~icons/solar/cup-star-linear";
import HamburgerMenuLinear from "~icons/solar/hamburger-menu-linear";
import SettingsOutline from "~icons/solar/settings-outline";
import PlanetLinear from "~icons/solar/planet-linear";
import Sun2Linear from "~icons/solar/sun-2-linear";
import MoonLinear from "~icons/solar/moon-linear";
import UserCircleLinear from "~icons/solar/user-circle-linear";
import RoundArrowLeftLinear from "~icons/solar/round-arrow-left-linear";
import UserRoundedOutline from "~icons/solar/user-rounded-outline";
import { Link, useNavigate, useParams } from "react-router";
import {
    cloneElement,
    createContext,
    CSSProperties,
    ReactElement,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { css } from "@emotion/react";
import { useAuthStore } from "@/stores/auth";
import { Game } from "@/models/game";
import { getGames } from "@/api/game";
import useMode from "@/hooks/useMode";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { useConfigStore } from "@/stores/config";
import { Group } from "@/models/user";

const { useToken } = theme;
const { Header } = Layout;

const NavbarCtx = createContext<{
    mode?: "default" | "game" | "setting";
    game?: Game;
}>({});

function Logo() {
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();
    const configStore = useConfigStore();
    const { mode, game } = useContext(NavbarCtx);

    return (
        <Button
            type="text"
            onClick={() =>
                navigate(
                    mode === "game"
                        ? `/games/${game?.id}`
                        : mode === "setting"
                          ? "/settings"
                          : "/"
                )
            }
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
                src={
                    mode === "game"
                        ? `/api/games/${game?.id}/icon`
                        : "/api/configs/icon"
                }
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
                    {mode === "game"
                        ? game?.title
                        : configStore?.config?.meta?.title}
                </h2>
            )}
        </Button>
    );
}

function NavDropdown() {
    const authStore = useAuthStore();

    const navigate = useNavigate();
    const { token } = useToken();
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    return (
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
                                    ? navigate(`/users/${authStore?.user?.id}`)
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
                                icon={<UserCircleLinear />}
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
                                        ?.toString(16)
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
                    ...(authStore?.user?.group === Group.Admin
                        ? [
                              {
                                  key: "2",
                                  icon: <PlanetLinear />,
                                  label: (
                                      <Link to={"/settings"}>进入管理面板</Link>
                                  ),
                              },
                          ]
                        : []),
                    {
                        key: "3",
                        icon: <SettingsOutline />,
                        label: "账户设置",
                    },
                    {
                        key: "4",
                        label: "退出登录",
                        icon: <LogoutLinear />,
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
                        icon={<UserCircleLinear />}
                        css={css`
                            cursor: pointer;
                        `}
                    />
                }
            />
        </Dropdown>
    );
}

function NavMenu() {
    const { mode, game } = useContext(NavbarCtx);

    const menuItems = useMemo<Array<ItemType<MenuItemType>>>(() => {
        if (mode === "game") {
            return [
                {
                    key: "challenges",
                    icon: <StarFallMinimalistic2Linear />,
                    label: (
                        <Link to={`/games/${game?.id}/challenges`}>题目</Link>
                    ),
                },
                {
                    key: "scoreboard",
                    icon: <CupStarLinear />,
                    label: (
                        <Link to={`/games/${game?.id}/scoreboard`}>积分榜</Link>
                    ),
                },
            ];
        } else if (mode === "setting") {
            return [
                {
                    key: "challenges",
                    icon: <Book2Linear />,
                    label: <Link to={"/settings/challenges"}>题库</Link>,
                },
                {
                    key: "games",
                    icon: <FlagLinear />,
                    label: <Link to={"/settings/games"}>比赛</Link>,
                },
                {
                    key: "teams",
                    icon: <UsersGroupTwoRoundedLinear />,
                    label: <Link to={"/settings/teams"}>团队</Link>,
                },
                {
                    key: "users",
                    icon: <UserRoundedOutline />,
                    label: <Link to={"/settings/users"}>用户</Link>,
                },
            ];
        } else {
            return [
                {
                    key: "challenges",
                    icon: <Book2Linear />,
                    label: <Link to={"/challenges"}>题库</Link>,
                },
                {
                    key: "games",
                    icon: <FlagLinear />,
                    label: <Link to={"/games"}>比赛</Link>,
                },
                {
                    key: "teams",
                    icon: <UsersGroupTwoRoundedLinear />,
                    label: <Link to={"/teams"}>团队</Link>,
                },
            ];
        }
    }, [mode, game?.id]);

    return (
        <Menu
            mode={"horizontal"}
            css={css`
                flex: 1;
                background-color: transparent;
                border: none;
            `}
            overflowedIndicator={<HamburgerMenuLinear />}
            triggerSubMenuAction={"click"}
            selectedKeys={[
                location.pathname.split("/").slice(1)[0],
                location.pathname.split("/").slice(2)[0],
                location.pathname.split("/").slice(3)[0],
            ]}
            items={menuItems}
        />
    );
}

export default function Navbar() {
    const themeStore = useThemeStore();
    const authStore = useAuthStore();

    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useToken();

    const mode = useMode();

    const [game, setGame] = useState<Game>();

    function fetchGame() {
        getGames({
            id: Number(id),
        }).then((res) => {
            setGame(res.data?.[0]);
        });
    }

    useEffect(() => {
        if (mode === "game") {
            fetchGame();
        }
    }, [mode, id]);

    return (
        <NavbarCtx.Provider value={{ mode, game }}>
            <Header
                css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    background-color: ${themeStore.darkMode
                        ? "#0015297d"
                        : "#ffffff7d"};
                    box-shadow: ${token.boxShadowTertiary};
                    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
                    backdrop-filter: blur(10px);
                    z-index: 5;
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
                    <Logo />
                    <NavMenu />
                </Flex>
                <div
                    css={css`
                        display: flex;
                        align-items: center;
                        justify-content: end;
                        gap: 16px;
                    `}
                >
                    {mode !== "default" && (
                        <Tooltip title={"退出"}>
                            <Button
                                onClick={() =>
                                    navigate(mode === "game" ? "/games" : "/")
                                }
                                variant={"text"}
                                color={"blue"}
                                icon={<RoundArrowLeftLinear />}
                            />
                        </Tooltip>
                    )}
                    <Button
                        type="text"
                        onClick={() =>
                            themeStore?.setDarkMode(!themeStore?.darkMode)
                        }
                        icon={
                            themeStore?.darkMode ? (
                                <Sun2Linear />
                            ) : (
                                <MoonLinear />
                            )
                        }
                    ></Button>
                    {authStore?.user ? (
                        <NavDropdown />
                    ) : (
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
        </NavbarCtx.Provider>
    );
}
