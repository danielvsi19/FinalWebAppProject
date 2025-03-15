import { BrowserRouter, Route, Routes } from "react-router-dom";
import { pages } from "./router";

const App: React.FC = () => {
    return (
        <div>
            <h1>Hello, World!</h1>
            <BrowserRouter>
                <Routes>
                    {pages.map((page) => (
                        <Route key={page.path} path={page.path} element={page.element} />
                    ))}    
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;