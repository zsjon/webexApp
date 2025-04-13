import React, { useRef, useEffect, useState } from 'react';

function User({ user }) {
    const [mode, setMode] = useState('return');
    const [selectedImage, setSelectedImage] = useState(null);
    const [coords, setCoords] = useState({ latitude: '', longitude: '' });
    const [requests, setRequests] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const email = user?.email || '';

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

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: 'environment' } }
        })
            .then((stream) => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error("카메라 접근 실패:", err);
                alert("카메라를 사용할 수 없습니다.");
            });
    }, []);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
            setSelectedImage(file);
        }, 'image/jpeg');
    };

    const handleRetake = () => {
        setSelectedImage(null);
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => track.stop());
            streamRef.current = null;
        }
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: 'environment' } }
        })
            .then((stream) => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error("카메라 접근 실패:", err);
                alert("카메라를 다시 시작할 수 없습니다.");
            });
    };

    const handleSubmit = async () => {
        if (!email) return alert('이메일 정보가 없습니다.');
        if (!selectedImage) return alert('이미지를 선택해주세요.');

        try {
            const location = await getCurrentLocation();
            const formData = new FormData();
            formData.append('email', email);
            formData.append('timestamp', new Date().toISOString());
            formData.append('lat', location.latitude);
            formData.append('lng', location.longitude);

            const url = mode === 'return'
                ? 'http://192.168.1.5:8000/readjust/'
                : 'https://dc7c-58-230-197-51.ngrok-free.app/api/pm-adjusted';

            const res = await fetch(url, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error();

            alert(mode === 'return' ? '반납 알림이 전송되었습니다!' : '조정 내용이 전송되었습니다!');
        } catch (err) {
            console.error(err);
            alert(mode === 'return' ? '반납 요청 실패' : '조정 내용 전송 실패');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ height: '70px', backgroundColor: '#A6DDF4', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
                <img src="/kicksco_embedded_app/logo.png" alt="KickSco 로고" style={{ width: '64px', height: '64px', borderRadius: '10%', objectFit: 'cover' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <div><label style={{ fontWeight: 'bold' }}> 사용자 : </label> <span>{email}</span></div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button onClick={() => setMode('return')} style={{ padding: '0.5rem 1rem', fontSize: '1rem', backgroundColor: mode === 'return' ? '#007bff' : '#e0e0e0', color: mode === 'return' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>PM 반납</button>
                    <button onClick={() => setMode('adjust')} style={{ padding: '0.5rem 1rem', fontSize: '1rem', backgroundColor: mode === 'adjust' ? '#007bff' : '#e0e0e0', color: mode === 'adjust' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>PM 위치 조정</button>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                {!selectedImage && (
                    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                        <canvas ref={canvasRef} width="320" height="180" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#000' }} />
                        <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
                        <img src="/kicksco_embedded_app/img.png" onClick={handleCapture} style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fff', cursor: 'pointer', border: '2px solid #ddd', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
                    </div>
                )}

                {selectedImage && (
                    <div style={{ marginTop: '1rem' }}>
                        <img src={URL.createObjectURL(selectedImage)} alt="Captured" width="100%" />
                        <br />
                        <button onClick={handleRetake} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>재촬영</button>
                    </div>
                )}
            </div>

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
        </div>
    );
}

export default User;
