// import React from 'react';
// import '../css/Admin.css';
//
// function Admin({ user }) { // 이거는 모바일 view가 아니므로
//     return (
//         <div className="admin-wrapper">
//             <div className="admin-header">
//                 <img
//                     className="admin-logo"
//                     src="/kicksco_embedded_app/logo.png"
//                     alt="KickSco 로고"
//                 />
//             </div>
//
//             <h2 className="admin-title">관리자 페이지</h2>
//             <p className="admin-subtitle">
//                 현재 로그인된 관리자: <strong>{user?.email}</strong>
//             </p>
//
//             <div className="admin-box">
//                 <p>📊 향후 여기에 관리자 대시보드, 요청 목록 통계, 유저 관리 기능 등을 추가할 수 있습니다.</p>
//                 <p>🔧 지금은 기본 레이아웃만 설정된 상태입니다.</p>
//             </div>
//         </div>
//     );
// }
//
// export default Admin;

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../css/Admin.css';

// Leaflet 마커 아이콘 경로 설정
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function Admin() {
    const [activeTab, setActiveTab] = useState('adjust');

    // 예제용 더미 데이터 (나중에 API 호출로 교체 예정)
    const dummyData = [
        {
            id: 'Q2XX-1234-ABCD',
            email: 'admin@cho010105-6xnw.wbx.ai',
            latitude: 37.5665,
            longitude: 126.978,
            message: '시청 앞 조정 완료',
            timestamp: '2025-04-12T17:30:00Z',
            returnImageUrl: 'https://via.placeholder.com/150x100?text=반납사진',
            violationImageUrl: 'https://via.placeholder.com/150x100?text=위반사진',
            adjustedImageUrl: 'https://via.placeholder.com/150x100?text=재위치사진',
            adjusted: true,
        },
    ];

    // Meraki Dashboard를 새 팝업창으로 열기 위한 함수
    const openMerakiDashboardPopup = () => {
        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;
        const width = Math.floor(screenWidth * 0.7);
        const height = Math.floor(screenHeight * 0.7);
        const left = Math.floor((screenWidth - width) / 2);
        const top = Math.floor((screenHeight - height) / 2);
        window.open(
            'https://dashboard.meraki.com',
            'MerakiDashboard',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
    };

    return (
        <div className="admin-wrapper">
            <h2 className="admin-title">📍 관리자용 반납 위치 지도</h2>

            <MapContainer
                center={[37.5665, 126.978]}
                zoom={12}
                className="admin-map"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {dummyData.map((item, idx) => (
                    <Marker key={idx} position={[item.latitude, item.longitude]}>
                        <Popup>
                            <strong>Meraki mv serial : {item.id}</strong><br />
                            {item.message}<br />
                            <button onClick={() => setActiveTab('return')}>반납 현황 보기</button>{' '}
                            <button onClick={() => setActiveTab('adjust')}>재위치 현황 보기</button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {activeTab !== 'none' && (
                <div>
                    <div className="admin-button-group">
                        <button onClick={() => setActiveTab('return')}>📦 PM 기기 반납 현황</button>
                        <button onClick={() => setActiveTab('adjust')}>🔄 재위치 필요 PM 현황</button>
                    </div>

                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                {activeTab === 'return' ? (
                                    <>
                                        <th>기기 번호</th>
                                        <th>반납 사진</th>
                                        <th>사진 보기</th>
                                        <th>시간</th>
                                    </>
                                ) : (
                                    <>
                                        <th>기기 번호</th>
                                        <th>재위치 여부</th>
                                        {/*<th>위반 사진</th>*/}
                                        {/*<th>재위치 사진</th>*/}
                                        <th>사진 보기</th>
                                        <th>감지 시각</th>
                                    </>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {dummyData.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.id}</td>
                                    {activeTab === 'return' ? (
                                        <>
                                            <td><img src={item.returnImageUrl} alt="반납사진" width="100" /></td>
                                            <td><button>사진 보기</button></td>
                                            <td>{new Date(item.timestamp).toLocaleString()}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{item.adjusted ? '✅' : '❌'}</td>
                                            {/*<td><img src={item.violationImageUrl} alt="위반사진" width="100" /></td>*/}
                                            {/*<td><img src={item.adjustedImageUrl} alt="재위치사진" width="100" /></td>*/}
                                            <td><button>사진 보기</button></td>
                                            <td>{new Date(item.timestamp).toLocaleString()}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 우측 하단의 Meraki Dashboard 버튼 */}
            <button
                className="meraki-button"
                onClick={openMerakiDashboardPopup}
            >
                Meraki Dashboard
            </button>
        </div>
    );
}

export default Admin;