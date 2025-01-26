import { Team } from "@/models/team";
import { createContext } from "react";

export const Context = createContext<{
    team?: Team;
}>({});
