import React, { useEffect, useState } from 'react';

function App() {
    const [webexReady, setWebexReady] = useState(false);
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('return');
    const [selectedImage, setSelectedImage] = useState(null);
    const [coords, setCoords] = useState({ latitude: '', longitude: '' });
    const [requests, setRequests] = useState([]);
    // message 상태는 사용하지 않을 경우 제거할 수 있습니다.
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
                        console.error('Webex 초기화 실패:', err);
                        alert('Webex 사용자 정보를 불러오지 못했습니다.');
                    });
            }
        }, 100);
    }, []);

    // 위치 정보 가져오기 (Promise 반환)
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
                    console.error('위치 정보 오류:', err);
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
            const res = await fetch(`https://dc7c-58-230-197-51.ngrok-free.app/api/requests?roomId=${spaceId}`);
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error('요청 목록 조회 실패:', err);
        }
    };

    // adjust 모드일 때 위치 가져오기
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

    // 제출 처리 함수
    const handleSubmit = async () => {
        if (!email) return alert('이메일 정보가 없습니다.');

        if (mode === 'return') {
            // PM 반납 모드: 이미지 파일이 반드시 선택되어야 함.
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
                // Django 서버에서 요구하는 추가 데이터도 함께 전송
                formData.append('timestamp', new Date().toISOString());
                formData.append('lat', location.latitude);
                formData.append('lng', location.longitude);

                const res = await fetch('https://dc7c-58-230-197-51.ngrok-free.app/api/return', {
                    method: 'POST',
                    body: formData
                });
                if (!res.ok) throw new Error();
                alert('반납 알림이 전송되었습니다!');
            } catch (err) {
                console.error(err);
                alert('반납 요청 실패');
            }
        } else {
            // PM 위치 조정 모드
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
                // 필요한 경우, message 필드를 추가할 수 있습니다.
                // formData.append('message', message);

                const res = await fetch('https://dc7c-58-230-197-51.ngrok-free.app/api/pm-adjusted', {
                    method: 'POST',
                    body: formData
                });
                if (!res.ok) throw new Error();
                alert('조정 내용이 전송되었습니다!');
            } catch (err) {
                console.error(err);
                alert('조정 내용 전송 실패');
            }
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>PM {mode === 'return' ? '반납' : '위치 조정'} 시스템</h2>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>현재 모드:</label>{' '}
                <select value={mode} onChange={e => setMode(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }}>
                    <option value="return">PM 반납</option>
                    <option value="adjust">PM 위치 조정</option>
                </select>
            </div>

            {/* 이미지 업로드 컴포넌트: 두 모드 모두 동일하게 사용 */}
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>이미지 선택:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setSelectedImage(e.target.files[0])}
                    style={{ display: 'block', marginTop: '0.5rem' }}
                />
            </div>

            {mode === 'adjust' && (
                <div style={{ marginBottom: '1rem' }}>
                    {coords.latitude ? (
                        <p>📍 위도: {parseFloat(coords.latitude).toFixed(5)}, 경도: {parseFloat(coords.longitude).toFixed(5)}</p>
                    ) : (
                        <p>위치 정보를 가져옵니다...</p>
                    )}
                </div>
            )}

            {mode === 'adjust' && requests.length > 0 && (
                <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', marginTop: '1rem', borderRadius: '4px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>조정 요청 목록</h4>
                    <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                        {requests.map((req, idx) => (
                            <li key={idx} style={{ padding: '0.3rem 0', borderBottom: '1px solid #ccc' }}>
                                {req.text}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!webexReady}
                style={{
                    width: '100%',
                    marginTop: '2rem',
                    padding: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {mode === 'return' ? '반납 알림 보내기' : '조정 내용 전송'}
            </button>
        </div>
    );
}

export default App;
