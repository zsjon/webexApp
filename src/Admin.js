import React from 'react';

function Admin({ user }) {
    return (
        <div style={{ padding: '2rem', maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <div
                style={{
                    height: '70px',
                    backgroundColor: '#A6DDF4',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <img
                    src="/kicksco_embedded_app/logo.png"
                    alt="KickSco 로고"
                    style={{ width: '64px', height: '64px', borderRadius: '10%', objectFit: 'cover' }}
                />
            </div>

            <h2 style={{ textAlign: 'center' }}>관리자 페이지</h2>
            <p style={{ textAlign: 'center', marginBottom: '1rem' }}>현재 로그인된 관리자: <strong>{user?.email}</strong></p>

            <div style={{ backgroundColor: '#f8f8f8', padding: '1rem', borderRadius: '8px' }}>
                <p>📊 향후 여기에 관리자 대시보드, 요청 목록 통계, 유저 관리 기능 등을 추가할 수 있습니다.</p>
                <p>🔧 지금은 기본 레이아웃만 설정된 상태입니다.</p>
            </div>
        </div>
    );
}

export default Admin;
