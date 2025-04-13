import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminApp from './scripts/Admin';
import User from './scripts/User';
import UserDetail from './scripts/UserDetail';

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderUserApp = (user) => {
    root.render(
        <BrowserRouter basename="/kicksco_embedded_app">
            <Routes>
                <Route path="/" element={<User user={user} />} />
                <Route path="/detail" element={<UserDetail />} />
            </Routes>
        </BrowserRouter>
    );
};

const renderAdminApp = (user) => {
    root.render(<AdminApp user={user} />);
};

const init = async () => {
    if (window.Webex?.EmbeddedAppSdk) {
        const webex = new window.Webex.EmbeddedAppSdk();
        try {
            await webex.ready();
            const user = await webex.getUser();
            console.log(user)
            // 관리자
            if (user.email === 'admin@cho010105-6xnw.wbx.ai') {
                return renderAdminApp(user);
            }

            // 일반 사용자: reward 포함시켜서 렌더링
            const res = await fetch('https://asdfjk123.pythonanywhere.com/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email })
            });

            if (!res.ok) throw new Error(`서버 응답 실패: ${res.status}`);
            const data = await res.json();
            const reward = data?.user?.reward ?? 0;
            console.log(reward);
            return renderUserApp({ ...user, reward });

        } catch (e) {
            console.error('❌ 초기화 실패:', e);
            root.render(<div>Webex 사용자 정보를 불러올 수 없습니다.</div>);
        }
    } else {
        root.render(<div>Webex SDK가 로드되지 않았습니다.</div>);
    }
};

init();
