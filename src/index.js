import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './scripts/Admin';
import UserApp from './scripts/User';

const root = ReactDOM.createRoot(document.getElementById('root'));

const init = async () => {
    if (window.Webex?.EmbeddedAppSdk) {
        const webex = new window.Webex.EmbeddedAppSdk();
        try {
            await webex.ready();
            const user = await webex.getUser();

            console.log('🔍 Webex 로그인 이메일:', user.email);
            if (user.email === 'admin@cho010105-6xnw.wbx.ai') {
                root.render(<AdminApp user={user} />);
            } else {
                root.render(<UserApp user={user} />);
            }
        } catch (e) {
            console.error('Webex 초기화 실패:', e);
            root.render(<div>Webex 사용자 정보를 불러올 수 없습니다.</div>);
        }
    } else {
        root.render(<div>Webex SDK가 로드되지 않았습니다.</div>);
    }
};

init();
