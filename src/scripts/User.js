import React, { useEffect, useRef, useState } from 'react';
import '../css/User.css';

function User({ user }) {
    const [mode, setMode] = useState('return');
    const [selectedImage, setSelectedImage] = useState(null);
    const [coords, setCoords] = useState({ latitude: '', longitude: '' });
    const [requests, setRequests] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const email = user?.email || '';

    // 위치 정보 가져오기
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                alert('위치 정보 사용이 불가능합니다.');
                return reject(new Error('Geolocation not supported'));
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setCoords(location);
                    resolve(location);
                },
                (err) => {
                    console.error('위치 정보 오류:', err);
                    alert('위치 정보를 가져오지 못했습니다.');
                    reject(err);
                }
            );
        });
    };

    // adjust 모드일 때 위치 가져오기
    useEffect(() => {
        if (mode === 'adjust') {
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
        }
    }, [mode]);

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
            const res = await fetch(`https://5851-210-119-237-101.ngrok-free.app/api/requests?roomId=${spaceId}`);
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error('요청 목록 조회 실패:', err);
        }
    };

    // 카메라 스트리밍 시작
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
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

            if (video.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
                video.srcObject = null;
            }
        }, 'image/jpeg');
    };

    const handleRetake = () => {
        setSelectedImage(null);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
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
            formData.append('latitude', location.latitude);
            formData.append('longitude', location.longitude);
            formData.append('image', selectedImage);
            formData.append('timestamp', new Date().toISOString());
            formData.append('lat', location.latitude);
            formData.append('lng', location.longitude);

            const url = mode === 'return'
                ? 'https://5851-210-119-237-101.ngrok-free.app/api/return'
                : 'https://5851-210-119-237-101.ngrok-free.app/api/pm-adjusted';

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
        <div className="user-wrapper">
            <div className="user-header">
                <img
                    className="user-logo"
                    src="/kicksco_embedded_app/logo.png"
                    alt="KickSco 로고"
                />
            </div>

            <div className="user-info">
                <div>
                    <label> 사용자 : </label> <span>{email}</span>
                </div>
                <div className="user-mode-buttons">
                    <button
                        onClick={() => setMode('return')}
                        className={`user-mode-button ${mode === 'return' ? 'active' : 'inactive'}`}
                    >
                        PM 반납
                    </button>
                    <button
                        onClick={() => setMode('adjust')}
                        className={`user-mode-button ${mode === 'adjust' ? 'active' : 'inactive'}`}
                    >
                        PM 위치 조정
                    </button>
                </div>
            </div>

            <div className="video-container">
                {!selectedImage && (
                    <>
                        <video
                            ref={videoRef}
                            width="320"
                            height="240"
                            autoPlay
                            playsInline
                            className="video-player"
                        />
                        <img
                            src="/kicksco_embedded_app/img.png"
                            onClick={handleCapture}
                            className="capture-button"
                            alt="캡처"
                        />
                    </>
                )}

                {selectedImage && (
                    <div className="selected-image-container">
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Captured"
                            className="selected-image"
                        />
                        <br />
                        <button onClick={handleRetake} className="retake-button">
                            재촬영
                        </button>
                    </div>
                )}

                <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
            </div>

            {mode === 'adjust' && requests.length > 0 && (
                <div className="user-request-list">
                    <h4>조정 요청 목록</h4>
                    <ul>
                        {requests.map((req, idx) => (
                            <li key={idx}>{req.text}</li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleSubmit} className="user-submit-button">
                전송
            </button>
        </div>
    );
}

export default User;