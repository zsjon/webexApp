// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import AdminApp from './scripts/Admin';
// import UserApp from './scripts/User';
//
// const root = ReactDOM.createRoot(document.getElementById('root'));
//
// const init = async () => {
//     if (window.Webex?.EmbeddedAppSdk) {
//         const webex = new window.Webex.EmbeddedAppSdk();
//         try {
//             await webex.ready();
//             const user = await webex.getUser();
//
//             console.log('🔍 Webex 로그인 이메일:', user.email);
//             if (user.email === 'admin@cho010105-6xnw.wbx.ai') {
//                 root.render(<AdminApp user={user} />);
//             } else {
//                 root.render(<UserApp user={user} />);
//             }
//         } catch (e) {
//             console.error('Webex 초기화 실패:', e);
//             root.render(<div>Webex 사용자 정보를 불러올 수 없습니다.</div>);
//         }
//     } else {
//         root.render(<div>Webex SDK가 로드되지 않았습니다.</div>);
//     }
// };
//
// init();

import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './scripts/Admin'; //
import UserApp from './scripts/User';   //

const root = ReactDOM.createRoot(document.getElementById('root'));

const init = async () => {
    if (window.Webex?.EmbeddedAppSdk) {
        const webex = new window.Webex.EmbeddedAppSdk();
        try {
            await webex.ready();
            const user = await webex.getUser();

            console.log('Webex 로그인 이메일:', user.email);
            console.log('Webex 로그인 이름:', user.name);

            fetch('http://192.168.1.5:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email })
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`서버 응답 실패: ${res.status}`);
                    }
                    console.log('✅ 서버 응답 성공');
                })
                .catch(e => {
                    console.error('❌ fetch 요청 중 에러 발생:', e);
                });


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
