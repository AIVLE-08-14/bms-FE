// src/pages/BookEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/BookCreatePage.css";
import AivleLogo2 from "../assets/aivle_logo2.png";
import { BASE_URL } from "../api/client.js"

const API_BASE_URL = `${BASE_URL}/api/v1`;

export default function BookEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // CreatePage와 동일한 필드 구조
  const initialForm = {
    title: "",
    author: "",
    description: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [globalError, setGlobalError] = useState("");

  // 기존 도서 정보 불러오기
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setGlobalError("");
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/books/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (res.status === 401) {
          setGlobalError("도서 정보를 불러오려면 로그인이 필요합니다.");
          setLoading(false);
          return;
        }
        if (res.status === 404) {
          setGlobalError("도서를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }
        if (res.status === 403) {
          setGlobalError("열람 권한이 없습니다.");
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("도서 정보를 불러오지 못했습니다.");

        const raw = await res.json();
        const data = raw?.data ?? raw;

        const nextForm = {
          title: data.title || "",
          author: data.author || "",
          description: data.description || "",
        };

        setForm(nextForm);
      } catch (err) {
        console.error(err);
        setGlobalError("도서 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors({});
    setMessage("");
    setGlobalError("");
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "제목은 필수입니다.";
    if (!form.description.trim()) next.description = "소개는 필수입니다.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setMessage("");
    setGlobalError("");

    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
      };

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setGlobalError("도서를 수정하려면 로그인이 필요합니다.");
        return;
      }
      if (res.status === 404) {
        setGlobalError("도서를 찾을 수 없습니다.");
        return;
      }
      if (res.status === 403) {
        setGlobalError("수정 권한이 없습니다.");
        return;
      }
      if (!res.ok) throw new Error("서버 오류");

      try {
        const raw = await res.json();
        console.log("UPDATE RESPONSE:", raw);
      } catch ( e) {
        console.log(e)
        // 204 등 응답 바디 없음
      }

      setMessage("도서 정보가 수정되었습니다.");
      setTimeout(() => navigate(`/books/${id}`), 800);
    } catch (err) {
      console.error(err);
      setGlobalError("수정 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="book-create-card">
        <div className="book-form-wrapper">
          <form className="book-form">
            <div className="book-form-header">
              <div className="logo-container">
                <img
                  src={AivleLogo2}
                  alt="에이블스쿨"
                  className="logo_trip-image"
                />
              </div>
              <h2 className="book-form-title">도서 정보를 불러오는 중...</h2>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (globalError && !form.title && !form.description) {
    return (
      <div className="book-create-card">
        <div className="book-form-wrapper">
          <form className="book-form">
            <div className="book-form-header">
              <div className="logo-container">
                <img
                  src={AivleLogo2}
                  alt="에이블스쿨"
                  className="logo_trip-image"
                />
              </div>
              <h2 className="book-form-title">도서 수정</h2>
            </div>
            <p className="form-message" style={{ color: "red" }}>
              {globalError}
            </p>
            <button
              type="button"
              className="book-form-button"
              onClick={() => navigate(-1)}
            >
              돌아가기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="book-create-card">
      <div className="book-form-wrapper">
        <form className="book-form" onSubmit={handleSubmit}>
          {/* 🔥 로고 + 제목 한 줄 (Create와 동일 구조) */}
          <div className="book-form-header">
            <div className="logo-container">
              <img
                src={AivleLogo2}
                alt="에이블스쿨"
                className="logo_trip-image"
              />
            </div>
            <h2 className="book-form-title">도서 수정</h2>
          </div>

          {globalError && (
            <p className="form-message" style={{ color: "red" }}>
              {globalError}
            </p>
          )}

          {/* 제목 */}
          <label className="book-form-label">
            제목을 입력해주세요 *
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="제목을 입력하여주세요."
              className={`book-input ${errors.title ? "error" : ""}`}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </label>

          {/* 저자 */}
          <label className="book-form-label">
            저자를 입력해주세요
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="저자를 입력하여주세요."
              className="book-input"
            />
          </label>

          {/* 소개 */}
          <label className="book-form-label">
            책의 소개를 작성해주세요 *
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="책의 소개를 작성해주세요."
              className={`book-input textarea ${
                errors.description ? "error" : ""
              }`}
              rows={4}
            />
            {errors.description && (
              <p className="error-text">{errors.description}</p>
            )}
          </label>

          {/* 버튼 영역 */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <button
              type="button"
              className="book-form-button"
              style={{
                backgroundColor: "#fff",
                color: "#1976d2",
                border: "1px solid #1976d2",
              }}
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="book-form-button"
              disabled={submitting}
            >
              {submitting ? "수정 중..." : "수정하기"}
            </button>
          </div>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
