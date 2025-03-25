import ROUTE_MAP from "./route_map";

import Loadable from "@/components/Loadable";

export const MAIN_ROUTES = [
  {
    PATH: "/*",
    ELEMENT: Loadable(() => import("@/pages/NotFound")),
  },
  {
    PATH: ROUTE_MAP.MAIN,
    ELEMENT: Loadable(() => import("@/pages/Main")),
  },
  {
    PATH: ROUTE_MAP.ANSWER,
    ELEMENT: Loadable(() => import("@/pages/Answer")),
  },
];
