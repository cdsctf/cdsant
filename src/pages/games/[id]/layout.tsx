import { Outlet, useParams } from "react-router";
import { Context } from "./context";
import { useSharedStore } from "@/stores/shared";
import { useEffect, useState } from "react";
import { Game } from "@/models/game";
import { getGames, getGameTeams } from "@/api/game";
import { GameTeam } from "@/models/game_team";
import { useAuthStore } from "@/stores/auth";

export default function () {
    const { id } = useParams<{ id: string }>();
    const sharedStore = useSharedStore();
    const authStore = useAuthStore();

    const [game, setGame] = useState<Game>();
    const [selfGameTeam, setSelfGameTeam] = useState<GameTeam>();
    const [gtLoaded, setGtLoaded] = useState<boolean>(false);

    function fetchGame() {
        getGames({
            id: Number(id),
        }).then((res) => {
            setGame(res?.data?.[0]);
        });
    }

    function fetchSelfGameTeam() {
        getGameTeams({
            game_id: Number(id),
            user_id: authStore?.user?.id,
        })
            .then((res) => {
                setSelfGameTeam(res.data?.[0]);
            })
            .finally(() => {
                setGtLoaded(true);
            });
    }

    useEffect(() => {
        if (authStore?.user) {
            fetchSelfGameTeam();
        }
    }, [sharedStore?.refresh]);

    useEffect(() => {
        fetchGame();
    }, [sharedStore?.refresh]);

    return (
        <Context.Provider value={{ game, selfGameTeam, gtLoaded }}>
            <Outlet />
        </Context.Provider>
    );
}
