import { ReactNode } from "react";
import { UserPage } from "../views/UserPage/UserPage";
import { UserPosts } from "../views/UserPosts/UserPosts";
import LoginPage from "../views/LoginPage/LoginPage";
import HomePage from "../views/HomePage/HomePage";

interface Page {
    path: string,
    element: ReactNode,
    name: string,
};

const createPages = (userName: string): Page [] => [
    {
        path: "/",
        element: <LoginPage />,
        name: "Logout",
    },
    {
        path: "/user",
        element: <UserPage />,
        name: userName || "User",
    },
    {
        path: "/userPosts",
        element: <UserPosts />,
        name: "Your posts",
    },
    {
        path: "/homePage",
        element: <HomePage />,
        name: "Home",
    },
];

export { createPages };
export type { Page };