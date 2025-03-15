import { ReactNode } from "react";
import { LoginPage } from "../views/LoginPage/LoginPage";
import { UserPage } from "../views/UserPage/UserPage";
import { UserPosts } from "../views/UserPosts/UserPosts";

interface Page {
    path: string,
    element: ReactNode,
    name: string,
};

const pages: Page[] = [
    {
        path: "/",
        element: <LoginPage />,
        name: "Login",
    },
    {
        path: "/user",
        element: <UserPage />,
        name: "User",
    },
    {
        path: "/userPosts",
        element: <UserPosts />,
        name: "Your posts",
    },
];

export { pages };
export type { Page };