// import React, { useState, useEffect } from 'react';
// import Webex from '@webex/embedded-app-sdk';
//
// function App() {
//     const [selectedDate, setSelectedDate] = useState('');
//     const [eventText, setEventText] = useState('');
//     const [webexReady, setWebexReady] = useState(false);
//
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (window.Webex?.EmbeddedAppSdk) {
//                 clearInterval(interval); // ✅ SDK 로딩 완료
//                 const webex = new window.Webex.EmbeddedAppSdk();
//
//                 webex.ready().then(() => {
//                     setWebexReady(true); // 버튼 활성화용
//                     return webex.getUser();
//                 }).then(user => {
//                     console.log('✅ Webex 사용자 정보:', user);
//                 }).catch(err => {
//                     console.error('❌ Webex SDK 초기화 실패:', err);
//                 });
//             }
//         }, 100);
//     }, []);
//
//     const handleSave = async () => {
//         const webex = new window.Webex.EmbeddedAppSdk();
//         let actualEmail = 'admin@cho010105-6xnw.wbx.ai';
//
//         try {
//             await webex.ready();
//             const user = await webex.getUser();
//             actualEmail = user?.email || actualEmail;
//         } catch (e) {
//             console.error('❌ Webex 사용자 정보 불러오기 실패', e);
//         }
//
//         try {
//             const response = await fetch('https://6c0e-210-119-237-103.ngrok-free.app/api/events', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     email: actualEmail,
//                     date: selectedDate,
//                     event: eventText
//                 })
//             });
//
//             if (!response.ok) {
//                 throw new Error('서버 응답 실패');
//             }
//
//             console.log('📨 저장 완료:', { email: actualEmail, date: selectedDate, event: eventText });
//             alert('일정이 저장되었습니다!');
//         } catch (err) {
//             console.error('❌ 저장 실패:', err);
//             alert('일정 저장에 실패했습니다.');
//         }
//     };
//
//     return (
//         <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
//             <h2>📅 <strong>Webex 캘린더</strong></h2>
//             <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={e => setSelectedDate(e.target.value)}
//                 style={{ width: '100%', marginBottom: '1rem' }}
//             />
//             <textarea
//                 placeholder="일정 입력"
//                 value={eventText}
//                 onChange={e => setEventText(e.target.value)}
//                 rows={4}
//                 style={{ width: '100%', marginBottom: '1rem' }}
//             />
//             <button
//                 onClick={handleSave}
//                 disabled={!webexReady}
//                 style={{ width: '100%', padding: '0.5rem' }}
//             >
//                 저장
//             </button>
//         </div>
//     );
// }
//
// export default App;

// import React, { useEffect, useState } from 'react';
//
// function App() {
//     const [webexReady, setWebexReady] = useState(false);
//     const [email, setEmail] = useState('');
//     const [mode, setMode] = useState('return'); // 'return' or 'adjust'
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [coords, setCoords] = useState({ latitude: '', longitude: '' });
//     const [message, setMessage] = useState('');
//     const webex = new window.Webex.EmbeddedAppSdk();
//
//     // ✅ Webex SDK 초기화
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (window.Webex?.EmbeddedAppSdk) {
//                 clearInterval(interval);
//                 const webex = new window.Webex.EmbeddedAppSdk();
//                 webex.ready()
//                     .then(() => webex.getUser())
//                     .then(user => {
//                         console.log('✅ Webex 사용자 정보:', user);
//                         setEmail(user?.email || '');
//                         setWebexReady(true);
//                     })
//                     .catch(err => {
//                         console.error('❌ Webex SDK 초기화 실패:', err);
//                         alert('Webex 사용자 정보 불러오기 실패');
//                     });
//             }
//         }, 100);
//     }, []);
//
//     // ✅ 위치 가져오기
//     const handleGetLocation = () => {
//         if (!navigator.geolocation) {
//             alert('위치 정보 사용이 불가능합니다.');
//             return;
//         }
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 setCoords({
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude
//                 });
//             },
//             (err) => {
//                 console.error('❌ 위치 정보 오류:', err);
//                 alert('위치 정보를 가져오지 못했습니다.');
//             }
//         );
//     };
//
//     // ✅ 서버로 전송
//     const handleSubmit = async () => {
//         if (!email) {
//             alert('이메일 정보가 없습니다.');
//             return;
//         }
//
//         if (mode === 'return') {
//             // 반납 모드 처리
//             try {
//                 const res = await fetch('https://7b6b-220-118-114-121.ngrok-free.app/api/return', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email })
//                 });
//                 if (!res.ok) throw new Error('서버 오류');
//                 alert('✅ 반납 알림이 전송되었습니다!');
//             } catch (err) {
//                 console.error('❌ 반납 전송 실패:', err);
//                 alert('❌ 반납 요청 실패');
//             }
//         } else {
//             // 조정 모드 처리
//             if (!selectedImage || !coords.latitude || !message) {
//                 alert('모든 항목을 입력해주세요.');
//                 return;
//             }
//
//             const formData = new FormData();
//             formData.append('email', email);
//             formData.append('latitude', coords.latitude);
//             formData.append('longitude', coords.longitude);
//             formData.append('message', message);
//             formData.append('image', selectedImage);
//
//             try {
//                 const res = await fetch('https://7b6b-220-118-114-121.ngrok-free.app/api/pm-adjusted', {
//                     method: 'POST',
//                     body: formData
//                 });
//                 if (!res.ok) throw new Error('서버 오류');
//                 alert('✅ 조정 내용이 전송되었습니다!');
//             } catch (err) {
//                 console.error('❌ 조정 전송 실패:', err);
//                 alert('❌ 조정 내용 전송 실패');
//             }
//         }
//     };
//
//     return (
//         <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto' }}>
//             <h2>📍 PM {mode === 'return' ? '반납' : '위치 조정'} 시스템</h2>
//
//             <div style={{ marginBottom: '1rem' }}>
//                 <label><strong>현재 모드:</strong></label>{' '}
//                 <select value={mode} onChange={e => setMode(e.target.value)}>
//                     <option value="return">PM 반납</option>
//                     <option value="adjust">PM 위치 조정</option>
//                 </select>
//             </div>
//
//             {mode === 'adjust' && (
//                 <>
//                     <textarea
//                         placeholder="PM 상태 설명"
//                         value={message}
//                         onChange={e => setMessage(e.target.value)}
//                         rows={3}
//                         style={{ width: '100%', marginBottom: '1rem' }}
//                     />
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={e => setSelectedImage(e.target.files[0])}
//                         style={{ marginBottom: '1rem' }}
//                     />
//                     <button onClick={handleGetLocation}>📡 위치 가져오기</button>
//                     {coords.latitude && (
//                         <p>📍 위도: {coords.latitude}, 경도: {coords.longitude}</p>
//                     )}
//                 </>
//             )}
//
//             <button
//                 onClick={handleSubmit}
//                 disabled={!webexReady}
//                 style={{ width: '100%', marginTop: '2rem', padding: '0.75rem', fontWeight: 'bold' }}
//             >
//                 {mode === 'return' ? '📤 반납 알림 보내기' : '📤 조정 내용 전송'}
//             </button>
//         </div>
//     );
// }
//
// export default App;

// client/src/App.js
import React, { useEffect, useState } from 'react';

function App() {
    const [webexReady, setWebexReady] = useState(false);
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('return');
    const [selectedImage, setSelectedImage] = useState(null);
    const [coords, setCoords] = useState({ latitude: '', longitude: '' });
    const [message, setMessage] = useState('');
    const [requests, setRequests] = useState([]);
    const webex = new window.Webex.EmbeddedAppSdk();

    // ✅ Webex SDK 초기화 및 사용자 정보 가져오기
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.Webex?.EmbeddedAppSdk) {
                clearInterval(interval);
                const webex = new window.Webex.EmbeddedAppSdk();
                webex.ready()
                    .then(() => webex.getUser())
                    .then(user => {
                        console.log('✅ Webex 사용자 정보:', user);
                        setEmail(user?.email || '');
                        setWebexReady(true);
                    })
                    .catch(err => {
                        console.error('❌ Webex SDK 초기화 실패:', err);
                        alert('Webex 사용자 정보 불러오기 실패');
                    });
            }
        }, 100);
    }, []);

    // ✅ 조정 요청 메시지 불러오기
    const fetchRequests = async () => {
        try {
            await webex.ready();
            const { spaceId } = await webex.getSpaceId();
            const res = await fetch(`https://813c-210-102-180-54.ngrok-free.app/api/requests?roomId=${spaceId}`);
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error('❌ 요청 메시지 조회 실패:', err);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchRequests, 10000); // 10초마다 폴링
        return () => clearInterval(interval);
    }, []);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('위치 정보 사용이 불가능합니다.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (err) => {
                console.error('❌ 위치 정보 오류:', err);
                alert('위치 정보를 가져오지 못했습니다.');
            }
        );
    };

    const handleSubmit = async () => {
        if (!email) {
            alert('이메일 정보가 없습니다.');
            return;
        }

        if (mode === 'return') {
            try {
                const res = await fetch('https://813c-210-102-180-54.ngrok-free.app/api/return', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (!res.ok) throw new Error('서버 오류');
                alert('✅ 반납 알림이 전송되었습니다!');
            } catch (err) {
                console.error('❌ 반납 전송 실패:', err);
                alert('❌ 반납 요청 실패');
            }
        } else {
            if (!selectedImage || !coords.latitude || !message) {
                alert('모든 항목을 입력해주세요.');
                return;
            }

            const formData = new FormData();
            formData.append('email', email);
            formData.append('latitude', coords.latitude);
            formData.append('longitude', coords.longitude);
            formData.append('message', message);
            formData.append('image', selectedImage);

            try {
                const res = await fetch('https://813c-210-102-180-54.ngrok-free.app/api/pm-adjusted', {
                    method: 'POST',
                    body: formData
                });
                if (!res.ok) throw new Error('서버 오류');
                alert('✅ 조정 내용이 전송되었습니다!');
            } catch (err) {
                console.error('❌ 조정 전송 실패:', err);
                alert('❌ 조정 내용 전송 실패');
            }
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto' }}>
            <h2>📍 PM {mode === 'return' ? '반납' : '위치 조정'} 시스템</h2>

            <div style={{ marginBottom: '1rem' }}>
                <label><strong>현재 모드:</strong></label>{' '}
                <select value={mode} onChange={e => setMode(e.target.value)}>
                    <option value="return">PM 반납</option>
                    <option value="adjust">PM 위치 조정</option>
                </select>
            </div>

            {mode === 'adjust' && (
                <>
          <textarea
              placeholder="PM 상태 설명"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              style={{ width: '100%', marginBottom: '1rem' }}
          />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setSelectedImage(e.target.files[0])}
                        style={{ marginBottom: '1rem' }}
                    />
                    <button onClick={handleGetLocation}>📡 위치 가져오기</button>
                    {coords.latitude && (
                        <p>📍 위도: {coords.latitude}, 경도: {coords.longitude}</p>
                    )}
                </>
            )}

            {mode === 'adjust' && requests.length > 0 && (
                <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', marginTop: '1rem' }}>
                    <h4>📢 조정 요청 목록</h4>
                    <ul>
                        {requests.map((req, idx) => (
                            <li key={idx}>{req.text}</li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!webexReady}
                style={{ width: '100%', marginTop: '2rem', padding: '0.75rem', fontWeight: 'bold' }}
            >
                {mode === 'return' ? '📤 반납 알림 보내기' : '📤 조정 내용 전송'}
            </button>
        </div>
    );
}

export default App;
