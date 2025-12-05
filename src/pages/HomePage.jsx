// src/pages/HomePage.jsx
import { useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testApi = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/health"); 
      // 실제 백엔드의 테스트용 API로 경로 수정해야 함

      setResult(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>홈 화면</h2>
      <p>읽은 책 요약, 최근 읽은 책 등을 보여줄 예정</p>

      <button
        onClick={testApi}
        style={{ padding: "10px 20px", marginTop: "20px" }}
      >
        API 호출 테스트
      </button>

      <div style={{ marginTop: "20px" }}>
        {result && <div>응답 데이터: {JSON.stringify(result)}</div>}
        {error && <div style={{ color: "red" }}>에러: {error}</div>}
      </div>
    </div>
  );
}
