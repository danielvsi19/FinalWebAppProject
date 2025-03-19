import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createPages } from "./router";
import { Navbar } from "./components/Navbar/Navbar";
import { AuthProvider, AuthContext, AuthContextType } from "./contexts/AuthContext";
import { useContext } from "react";

const AppContent: React.FC = () => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);

    if (!authContext) {
        return <div>Loading...</div>;
    }

    const { user } = authContext;
    const userName = user?.username || 'User';
    const pages = createPages(userName);

    return (
        <>
            <Navbar />
            <Routes>
                {pages.map((page) => (
                    <Route key={page.path} path={page.path} element={page.element} />
                ))}
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;