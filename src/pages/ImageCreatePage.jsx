// src/pages/ImageCreatePage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/BookCreatePage.css";
import AivleLogo2 from "../assets/aivle_logo2.png";
import { BASE_URL } from "../api/client.js"

const API_BASE_URL = `${BASE_URL}/api/v1`;

export default function ImageCreatePage() {
  const { id } = useParams(); // bookId
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(""); // 생성된 표지 URL
  const [message, setMessage] = useState("");

  const handlePromptChange = (e) => {
    const value = e.target.value;
    setPrompt(value);
    setError("");
    setMessage("");
    setResult("");
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("프롬프트를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setResult("");

    try {
      const token = localStorage.getItem("token");

      const body = {
        prompt: prompt.trim(),
      };

      const res = await fetch(`${API_BASE_URL}/books/gen/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        setError("이미지를 생성하려면 로그인이 필요합니다.");
        return;
      }
      if (res.status === 404) {
        setError("대상 도서를 찾을 수 없습니다.");
        return;
      }
      if (!res.ok) {
        throw new Error("이미지 생성 실패");
      }

      const json = await res.json();
      // 응답 형식:
      // {
      //   "status": 200,
      //   "message": "success",
      //   "data": { ..., "bookCoverUrl": "<URL>" }
      // }
      const data = json?.data ?? json;
      const coverUrl = data.bookCoverUrl;

      if (!coverUrl) {
        setError("생성된 표지 URL을 찾을 수 없습니다.");
        return;
      }

      setResult(coverUrl);
      setMessage("AI 표지가 생성되었습니다.");
    } catch (err) {
      console.error(err);
      setError("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPost = () => {
    navigate(`/books/${id}`);
  };

  return (
    <div className="book-create-card">
      <div className="book-form-wrapper">
        {/* 로고 영역 */}


        <form className="book-form" onSubmit={handleGenerate}>
          {/*  로고 + 제목 한 줄 */}
          <div className="book-form-header">
            <div className="logo-container">
              <img
                src={AivleLogo2}
                alt="에이블스쿨"
                className="logo_trip-image"
              />
            </div>
            <h2 className="book-form-title">AI 표지 이미지 생성</h2>
          </div>
          <p className="form-message">도서 ID: {id}</p>

          {/* 프롬프트 입력 */}
          <label className="book-form-label">
            프롬프트 입력 *
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder="원하는 표지 이미지 스타일이나 설명을 입력하세요."
              rows={4}
              className="book-input textarea"
            />
          </label>

          {/* 에러/메시지 */}
          {error && <p className="error-text">{error}</p>}
          {message && !error && (
            <p className="form-message" style={{ color: "#2e7d32" }}>
              {message}
            </p>
          )}

          {/* 생성 버튼 */}
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="book-form-button"
          >
            {loading ? "생성 중..." : "이미지 생성"}
          </button>

          {/* 결과 이미지 + 돌아가기 버튼 */}
          {result && (
            <div style={{ marginTop: "24px" }}>
              <h3 className="book-form-title" style={{ fontSize: "18px" }}>
                생성된 표지 미리보기
              </h3>
              <div className="cover-preview">
                <img src={result} alt="generated cover" />
              </div>

              {/* 게시글로 돌아가기 버튼 */}
              <button
                type="button"
                onClick={handleBackToPost}
                className="book-form-button"
                style={{
                  marginTop: "16px",
                  backgroundColor: "#ffffff",
                  color: "#1694a3",
                  border: "1px solid #1694a3",
                }}
              >
                도서로 돌아가기
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
