import React from 'react';
import '../css/Admin.css';

function Admin({ user }) {
    return (
        <div className="admin-wrapper">
            <div className="admin-header">
                <img
                    className="admin-logo"
                    src="/kicksco_embedded_app/logo.png"
                    alt="KickSco 로고"
                />
            </div>

            <h2 className="admin-title">관리자 페이지</h2>
            <p className="admin-subtitle">
                현재 로그인된 관리자: <strong>{user?.email}</strong>
            </p>

            <div className="admin-box">
                <p>📊 향후 여기에 관리자 대시보드, 요청 목록 통계, 유저 관리 기능 등을 추가할 수 있습니다.</p>
                <p>🔧 지금은 기본 레이아웃만 설정된 상태입니다.</p>
            </div>
        </div>
    );
}

export default Admin;