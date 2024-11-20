import { HabiticaKeys } from "@/app/_types/habitica.types";

const DIVIDER = ".";
export const Habitica = {
  foldKeys: function (habiticaKeys: HabiticaKeys): string {
    const folded = habiticaKeys.id + DIVIDER + habiticaKeys.token;
    return folded !== "." ? folded : "";
  },

  unfoldKeys: function (folded: string): HabiticaKeys {
    const [id = "", token = ""] = folded.split(DIVIDER);
    return { id, token };
  },
};
