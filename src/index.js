import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminApp from "./scripts/Admin";
import User from "./scripts/User";
import UserDetail from "./scripts/UserDetail";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = ({ user }) => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<User user={user} />} />
                <Route path="/admin" element={<AdminApp user={user} />} />
                <Route path="/detail" element={<UserDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
};

const init = async () => {
    if (window.Webex?.EmbeddedAppSdk) {
        const webex = new window.Webex.EmbeddedAppSdk();
        try {
            await webex.ready();
            const user = await webex.getUser();
            console.log("Webex 로그인 사용자:", user);
            root.render(<App user={user} />);
        } catch (e) {
            console.error("❌ 초기화 실패:", e);
            root.render(<div>Webex 사용자 정보를 불러올 수 없습니다.</div>);
        }
    } else {
        root.render(<div>Webex SDK가 로드되지 않았습니다.</div>);
    }
};

init();