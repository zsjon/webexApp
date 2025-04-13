import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

function User({ user }) {
    const [mode, setMode] = useState('return');
    const [selectedImage, setSelectedImage] = useState(null);
    const [coords, setCoords] = useState({ latitude: '', longitude: '' });
    const [requests, setRequests] = useState([]);
    const [useWebcam, setUseWebcam] = useState(false);
    const webcamRef = useRef(null);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const email = user?.email || '';
    const [reward, setReward] = useState(user?.reward ?? 0);

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

    React.useEffect(() => {
        if (mode === 'adjust') {
            getCurrentLocation();
        }
    }, [mode]);

    React.useEffect(() => {
        const interval = setInterval(fetchRequests, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        try {
            const webex = new window.Webex.EmbeddedAppSdk();
            await webex.ready();
            const { spaceId } = await webex.getSpaceId();
            const res = await fetch('https://dc7c-58-230-197-51.ngrok-free.app/api/requests?roomId=${spaceId}');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error('요청 목록 조회 실패:', err);
        }
    };

    const handleCapture = () => {
        const screenshot = webcamRef.current.getScreenshot();
        if (screenshot) {
            const byteString = atob(screenshot.split(',')[1]);
            const mimeString = screenshot.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], 'captured.jpg', { type: mimeString });
            setSelectedImage(file);
            setUseWebcam(false);
        }
    };

    const handleRetake = () => {
        setSelectedImage(null);
        setUseWebcam(false);
    };

    const handleSubmit = async () => {
        if (!email) return alert('이메일 정보가 없습니다.');
        if (!selectedImage) return alert('이미지를 선택해주세요.');

        try {
            const url = 'https://asdfjk123.pythonanywhere.com/reward/';

            const location = await getCurrentLocation();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const timestamp = tomorrow.toISOString();

            const body = {
                email,
                timestamp: timestamp,
                // lat: parseFloat(location.latitude),
                // lng: parseFloat(location.longitude)
                lat : parseFloat("333"),
                lng : parseFloat("333")
            };
            console.log(body.timestamp);
            console.log(body.lat+ "  " + body.lng);
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            });
            const data = await res.json();
            console.log(data);
            setReward(data.reward);
            if (data.message === "No historical data for the nearest camera") {
                setModalMessage("📡 주변 카메라에서 데이터를 찾을 수 없습니다.");
                return;
            }
            console.log(data.message);

            if (res.ok) {
                setReward(data.reward);
                setModalMessage(mode === 'return'
                    ? '✅ 반납 알림이 성공적으로 전송되었습니다!'
                    : '✅ 조정 내용이 성공적으로 전송되었습니다!');
            } else {
                setModalMessage('반납에 실패하였습니다.');
                throw new Error();
            }

            //alert(mode === 'return' ? '반납 알림이 전송되었습니다!' : '조정 내용이 전송되었습니다!');
        } catch (err) {
            console.error(err);
            alert(mode === 'return' ? '반납 요청 실패' : '조정 내용 전송 실패');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedImage(file);
    };

    return (
        <div style={{padding: '2rem', maxWidth: 500, margin: 'auto', fontFamily: 'Arial, sans-serif'}}>
            <div style={{
                height: '70px',
                backgroundColor: '#A6DDF4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '0 1rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <img src="/kicksco_embedded_app/logo.png" alt="KickSco 로고"
                     style={{width: '64px', height: '64px', borderRadius: '10%', objectFit: 'cover'}}
                />
                <button
                    onClick={() => navigate('/detail', {state: {user}})}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    <img src="/kicksco_embedded_app/user_icon.png" alt="User"
                         style={{width: '40px', height: '40px', borderRadius: '10%'}}/>
                </button>
            </div>

            <div style={{marginBottom: '1rem'}}>
                <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem'}}>
                    <button onClick={() => setMode('return')} style={{
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        backgroundColor: mode === 'return' ? '#007bff' : '#e0e0e0',
                        color: mode === 'return' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>PM 반납</button>
                    <button onClick={() => setMode('adjust')} style={{ padding: '0.5rem 1rem', fontSize: '1rem', backgroundColor: mode === 'adjust' ? '#007bff' : '#e0e0e0', color: mode === 'adjust' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>PM 위치 조정</button>
                </div>

            </div>

            {!selectedImage && !useWebcam && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => setUseWebcam(true)} style={{ padding: '0.75rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>📸 카메라로 촬영하기</button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
            )}

            {!selectedImage && useWebcam && (
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            facingMode: 'environment',
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                    <img src="/kicksco_embedded_app/img.png" onClick={handleCapture} style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fff', cursor: 'pointer', border: '2px solid #ddd', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
                </div>
            )}

            {selectedImage && (
                <div style={{ marginTop: '1rem' }}>
                    <img src={URL.createObjectURL(selectedImage)} alt="Captured" width="100%" />
                    <br />
                    <button onClick={handleRetake} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>돌아가기</button>
                </div>
            )}

            {mode === 'adjust' && requests.length > 0 && (
                <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', marginTop: '1rem', borderRadius: '4px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>조정 요청 목록</h4>
                    <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                        {requests.map((req, idx) => (
                            <li key={idx} style={{ padding: '0.3rem 0', borderBottom: '1px solid #ccc' }}>{req.text}</li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleSubmit} style={{ width: '100%', marginTop: '2rem', padding: '0.75rem', fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                전송
            </button>

            {modalMessage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '90%',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{modalMessage}</p>
                        <button
                            onClick={() => setModalMessage('')}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>

    );

}

export default User;