// src/pages/BookCreatePage.jsx
import React, { useState } from "react";
import "../css/BookCreatePage.css";
import AivleLogo2 from '../assets/aivle_logo2.png';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

// React 컴포넌트 → UI를 화면에 그리는 함수.
export default function BookCreatePage() {
    const [coverUrl, setCoverUrl] = useState("");

    const genre = [
        "소설", "에세이", "추리", "판타지", "로맨스",
        "인문", "자기계발", "경제/경영", "과학/기술", "역사/문화"
    ];

    const initialForm = {
        title: "",
        author: "",
        description: "",
        genre: "",
        coverUrl: "", // ← 책 표지 URL도 저장 가능하도록 확장 (선택)
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
        if (!form.genre) next.genre = "장르를 선택해 주세요.";
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
            const payload = { ...form, coverUrl };

            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                setMessage("로그인이 필요합니다.");
                setSubmitting(false);
                return;
            }

            if (!res.ok) throw new Error("서버 오류");

            setMessage("도서 등록 요청이 완료되었습니다.");

            setForm(initialForm);
            setCoverUrl("");

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

                {/* 로고 자리 */}
                <div className="logo-container">
                    <img src={AivleLogo2} alt="에이블스쿨" className="logo_trip-image" />
                </div>

                <form className="book-form" onSubmit={handleSubmit}>
                    <h2 className="book-form-title">도서 등록</h2>

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
                            className={`book-input textarea ${errors.description ? "error" : ""}`}
                            rows={4}
                        />
                        {errors.description && <p className="error-text">{errors.description}</p>}
                    </label>

                    {/* 카테고리 */}
                    <label className="book-form-label">
                        책의 장르별 카테고리를 선택해주세요 *
                        <select
                            name="genre"
                            value={form.genre}
                            onChange={handleChange}
                            className={`book-input select ${errors.genre ? "error" : ""}`}
                        >
                            <option value="">카테고리 선택</option>
                            {genre.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        {errors.genre && <p className="error-text">{errors.genre}</p>}
                    </label>

                    {/* 책 표지 URL 입력 */}
                    <label className="book-form-label">
                        책 표지의 url을 입력해주세요
                        <input
                            type="text"
                            name="coverUrl"
                            className="book-input"
                            placeholder="책 표지의 url을 입력해주세요."
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                        />
                    </label>

                    {/* 미리보기 영역 */}
                    {coverUrl && (
                        <div className="cover-preview">
                            <img src={coverUrl} alt="book cover" />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="book-form-button"
                        disabled={submitting}
                    >
                        {submitting ? "등록 중..." : "등록하기"}
                    </button>

                    {message && <p className="form-message">{message}</p>}
                </form>
            </div>
        </div>
    );
}
