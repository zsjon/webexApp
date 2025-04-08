import React, { useEffect, useState } from 'react';

function App() {
    const [webexReady, setWebexReady] = useState(false);
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('return');
    const [selectedImage, setSelectedImage] = useState(null);
    const [coords, setCoords] = useState({ latitude: '', longitude: '' });
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState('');

    // Webex SDK 초기화
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.Webex?.EmbeddedAppSdk) {
                clearInterval(interval);
                const webex = new window.Webex.EmbeddedAppSdk();
                webex.ready()
                    .then(() => webex.getUser())
                    .then(user => {
                        setEmail(user?.email || '');
                        setWebexReady(true);
                    })
                    .catch(err => {
                        console.error('❌ Webex 초기화 실패:', err);
                        alert('Webex 사용자 정보를 불러오지 못했습니다.');
                    });
            }
        }, 100);
    }, []);

    // 위치 정보 가져오기
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                alert('위치 정보 사용이 불가능합니다.');
                return reject(new Error('Geolocation not supported'));
            }
            navigator.geolocation.getCurrentPosition(
                position => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setCoords(location);
                    resolve(location);
                },
                err => {
                    console.error('❌ 위치 정보 오류:', err);
                    alert('위치 정보를 가져오지 못했습니다.');
                    reject(err);
                }
            );
        });
    };

    // 요청 목록 주기적 조회
    useEffect(() => {
        const interval = setInterval(fetchRequests, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        try {
            const webex = new window.Webex.EmbeddedAppSdk();
            await webex.ready();
            const { spaceId } = await webex.getSpaceId();
            const res = await fetch(`https://bba6-210-102-180-54.ngrok-free.app/api/requests?roomId=${spaceId}`);
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error('❌ 요청 목록 조회 실패:', err);
        }
    };


    useEffect(() => {
        if (mode === 'adjust') {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                err => {
                    console.error('❌ 위치 정보 오류:', err);
                    alert('위치 정보를 가져오지 못했습니다.');
                }
            );
        }
    }, [mode]);




    // 제출 처리
    const handleSubmit = async () => {
        if (!email) return alert('이메일 정보가 없습니다.');

        if (mode === 'return') {
            try {
                const location = await getCurrentLocation();

                const res = await fetch('https://bba6-210-102-180-54.ngrok-free.app/api/return', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        latitude: location.latitude,
                        longitude: location.longitude
                    })
                });
                if (!res.ok) throw new Error();
                alert('✅ 반납 알림이 전송되었습니다!');
            } catch {
                alert('❌ 반납 요청 실패');
            }
        } else {
            if (!selectedImage) {
                return alert('이미지를 선택해주세요.');
            }

            try {
                const location = await getCurrentLocation();
                const formData = new FormData();
                formData.append('email', email);
                formData.append('latitude', location.latitude);
                formData.append('longitude', location.longitude);
                formData.append('image', selectedImage);
                formData.append('message', message || '');  // 빈 값도 허용


                const res = await fetch('https://bba6-210-102-180-54.ngrok-free.app/api/pm-adjusted', {
                    method: 'POST',
                    body: formData
                });
                if (!res.ok) throw new Error();
                alert('✅ 조정 내용이 전송되었습니다!');
            } catch {
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
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setSelectedImage(e.target.files[0])}
                        style={{ marginBottom: '1rem' }}
                    />
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
