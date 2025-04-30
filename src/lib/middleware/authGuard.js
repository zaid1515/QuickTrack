import { verifyJWT } from "../auth";

export function authGuard(handler) {
  return async function (req, ...args) {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyJWT(token);

    if (!user) {
      return Response.json({ message: "Invalid Token" }, { status: 403 });
    }

    req.user = user;
    return handler(req, ...args);
  };
}
