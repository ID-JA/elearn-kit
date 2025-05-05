import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-in","routes/sign-in.tsx"),
  layout("routes/portal.tsx", [route("dashboard", "routes/dashboard.tsx")]),
] satisfies RouteConfig;
