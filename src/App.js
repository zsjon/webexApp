import React, { useState, useEffect } from 'react';
import Webex from '@webex/embedded-app-sdk';

function App() {
    const [email, setEmail] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [eventText, setEventText] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.Webex?.EmbeddedAppSdk) {
                clearInterval(interval); // ✅ SDK 로딩 완료

                const webex = new window.Webex.EmbeddedAppSdk();

                webex.ready().then(() => {
                    return webex.getUser();
                }).then(user => {
                    setEmail(user?.email || 'admin@cho010105-6xnw.wbx.ai');
                }).catch(err => {
                    console.error('Webex SDK 초기화 실패:', err);
                });
            }
        }, 100); // SDK가 로드될 때까지 100ms마다 체크
    }, []);


    const handleSave = async () => {
        await fetch('https://812b-210-119-237-103.ngrok-free.app/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // email,
                email: email || 'admin@cho010105-6xnw.wbx.ai',
                date: selectedDate,
                event: eventText
            })
        });
        console.log('email:', email);
        console.log('date:', selectedDate);
        console.log('event:', eventText);
        alert('일정이 저장되었습니다!');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
            <h2>📅 Webex 캘린더</h2>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            <textarea
                placeholder="일정 입력"
                value={eventText}
                onChange={e => setEventText(e.target.value)}
                rows={4}
                style={{ width: '100%', marginTop: '1rem' }}
            />
            <button onClick={handleSave} style={{ marginTop: '1rem', width: '100%' }}>저장</button>
        </div>
    );
}

export default App;