// src/pages/BookCreatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/BookCreatePage.css";
import AivleLogo2 from "../assets/aivle_logo2.png";
import { BASE_URL } from "../api/client.js"

const API_BASE_URL = `${BASE_URL}/api/v1`;

export default function BookCreatePage() {
  const navigate = useNavigate();

  const initialForm = {
    title: "",
    author: "",
    description: "",
    // genre 삭제됨
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        setMessage("로그인이 필요합니다.");
        setSubmitting(false);
        return;
      }

      if (!res.ok) throw new Error("서버 오류");

      const json = await res.json();
      console.log("API raw response:", json);

      const createdId = json?.data?.id;

      if (!createdId) {
        setMessage("ID 응답이 없습니다. API 응답을 확인하십시오.");
        setSubmitting(false);
        return;
      }

      // ✅ 등록 후 이미지 생성 페이지로 이동
      navigate(`/images/${createdId}`);
    } catch (err) {
      console.error(err);
      setMessage("등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-create-card">
      <div className="book-form-wrapper">
        <form className="book-form" onSubmit={handleSubmit}>
          {/*  로고 + 제목 한 줄 */}
          <div className="book-form-header">
            <div className="logo-container">
              <img
                src={AivleLogo2}
                alt="에이블스쿨"
                className="logo_trip-image"
              />
            </div>
            <h2 className="book-form-title">도서 등록</h2>
          </div>

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

          {/* 버튼: 다음 */}
          <button
            type="submit"
            className="book-form-button"
            disabled={submitting}
          >
            {submitting ? "저장 중..." : "다음"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
