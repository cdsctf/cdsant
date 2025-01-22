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
import LogoutLineDuotone from "~icons/solar/logout-linear";
import Book2Bold from "~icons/solar/book-2-bold";
import FlagBold from "~icons/solar/flag-bold";
import UsersGroupTwoRoundedBold from "~icons/solar/users-group-two-rounded-bold";
import StarFallMinimalistic2Bold from "~icons/solar/star-fall-minimalistic-2-bold";
import CupStarBold from "~icons/solar/cup-star-bold";
import HamburgerMenuLinear from "~icons/solar/hamburger-menu-linear";
import SettingsOutline from "~icons/solar/settings-outline";
import PlanetLinear from "~icons/solar/planet-linear";
import Sun2Bold from "~icons/solar/sun-2-bold";
import MoonBold from "~icons/solar/moon-bold";
import UserCircleBold from "~icons/solar/user-circle-bold";
import RoundArrowLeftBold from "~icons/solar/round-arrow-left-bold";
import { Link, useLocation, useNavigate, useParams } from "react-router";
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
import { useSharedStore } from "@/stores/shared";
import { Game } from "@/models/game";
import { getGames } from "@/api/game";
import useMode from "@/hooks/useMode";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

const { useToken } = theme;
const { Header } = Layout;

const NavbarCtx = createContext<{
    mode?: "default" | "game" | "setting";
    game?: Game;
}>({});

function Logo() {
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();
    const sharedStore = useSharedStore();
    const { mode, game } = useContext(NavbarCtx);

    return (
        <Button
            type="text"
            onClick={() =>
                navigate(mode === "game" ? `/games/${game?.id}` : "/")
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
                        : sharedStore?.config?.site?.title}
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
                    {
                        key: "2",
                        icon: <PlanetLinear />,
                        label: <Link to={"/settings"}>进入管理面板</Link>,
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
    );
}

function NavMenu() {
    const { mode, game } = useContext(NavbarCtx);

    const menuItems = useMemo<Array<ItemType<MenuItemType>>>(() => {
        if (mode === "game") {
            return [
                {
                    key: "challenges",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <StarFallMinimalistic2Bold />
                            <Link to={`/games/${game?.id}/challenges`}>
                                题目
                            </Link>
                        </Flex>
                    ),
                },
                {
                    key: "scoreboard",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <CupStarBold />
                            <Link to={`/games/${game?.id}/scoreboard`}>
                                积分榜
                            </Link>
                        </Flex>
                    ),
                },
            ];
        } else if (mode === "setting") {
            return [
                {
                    key: "challenges",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <Book2Bold />
                            <Link to={"/challenges"}>题库</Link>
                        </Flex>
                    ),
                },
                {
                    key: "games",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <FlagBold />
                            <Link to={"/games"}>比赛</Link>
                        </Flex>
                    ),
                },
                {
                    key: "teams",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <UsersGroupTwoRoundedBold />
                            <Link to={"/teams"}>团队</Link>
                        </Flex>
                    ),
                },
                {
                    key: "users",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <UsersGroupTwoRoundedBold />
                            <Link to={"/users"}>用户</Link>
                        </Flex>
                    ),
                },
            ];
        } else {
            return [
                {
                    key: "challenges",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <Book2Bold />
                            <Link to={"/challenges"}>题库</Link>
                        </Flex>
                    ),
                },
                {
                    key: "games",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <FlagBold />
                            <Link to={"/games"}>比赛</Link>
                        </Flex>
                    ),
                },
                {
                    key: "teams",
                    label: (
                        <Flex align={"center"} gap={10}>
                            <UsersGroupTwoRoundedBold />
                            <Link to={"/teams"}>团队</Link>
                        </Flex>
                    ),
                },
            ];
        }
    }, [mode]);

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
            selectedKeys={[location.pathname.split("/").slice(-1)[0]]}
            items={menuItems}
        />
    );
}

export default function Navbar() {
    const themeStore = useThemeStore();
    const authStore = useAuthStore();

    const location = useLocation();
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
                        ? "#001529"
                        : "#fff"};
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
                        <Tooltip title={"返回"}>
                            <Button
                                onClick={() =>
                                    navigate(mode === "game" ? "/games" : "/")
                                }
                                shape={"circle"}
                                color={"primary"}
                                variant={"text"}
                            >
                                <RoundArrowLeftBold />
                            </Button>
                        </Tooltip>
                    )}
                    <Button
                        type="text"
                        onClick={() =>
                            themeStore?.setDarkMode(!themeStore?.darkMode)
                        }
                        shape={"circle"}
                    >
                        {themeStore?.darkMode ? <Sun2Bold /> : <MoonBold />}
                    </Button>
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
