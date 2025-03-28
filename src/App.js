import React, { useState, useEffect } from 'react';
import Webex from '@webex/embedded-app-sdk';

function App() {
    const [selectedDate, setSelectedDate] = useState('');
    const [eventText, setEventText] = useState('');
    const [webexReady, setWebexReady] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.Webex?.EmbeddedAppSdk) {
                clearInterval(interval); // ✅ SDK 로딩 완료
                const webex = new window.Webex.EmbeddedAppSdk();

                webex.ready().then(() => {
                    setWebexReady(true); // 버튼 활성화용
                    return webex.getUser();
                }).then(user => {
                    console.log('✅ Webex 사용자 정보:', user);
                }).catch(err => {
                    console.error('❌ Webex SDK 초기화 실패:', err);
                });
            }
        }, 100);
    }, []);

    const handleSave = async () => {
        const webex = new window.Webex.EmbeddedAppSdk();
        let actualEmail = 'admin@cho010105-6xnw.wbx.ai';

        try {
            await webex.ready();
            const user = await webex.getUser();
            actualEmail = user?.email || actualEmail;
        } catch (e) {
            console.error('❌ Webex 사용자 정보 불러오기 실패', e);
        }

        try {
            const response = await fetch('https://6c0e-210-119-237-103.ngrok-free.app/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: actualEmail,
                    date: selectedDate,
                    event: eventText
                })
            });

            if (!response.ok) {
                throw new Error('서버 응답 실패');
            }

            console.log('📨 저장 완료:', { email: actualEmail, date: selectedDate, event: eventText });
            alert('일정이 저장되었습니다!');
        } catch (err) {
            console.error('❌ 저장 실패:', err);
            alert('일정 저장에 실패했습니다.');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
            <h2>📅 <strong>Webex 캘린더</strong></h2>
            <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem' }}
            />
            <textarea
                placeholder="일정 입력"
                value={eventText}
                onChange={e => setEventText(e.target.value)}
                rows={4}
                style={{ width: '100%', marginBottom: '1rem' }}
            />
            <button
                onClick={handleSave}
                disabled={!webexReady}
                style={{ width: '100%', padding: '0.5rem' }}
            >
                저장
            </button>
        </div>
    );
}

export default App;
