// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/HomePage.css";
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import { BASE_URL } from "../api/client.js"

// 배너 슬라이드 이미지 목록
const bannerImages = [banner1, banner2, banner3];

// .env.local 에서 API 베이스 URL 사용 (예: http://localhost:8080)
const API_BASE_URL = `${BASE_URL}/api/v1`;

export default function HomePage() {
  const navigate = useNavigate();

  // 배너 현재 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // 최근 업데이트된 도서 (최신 6개)
  const [latestBooks, setLatestBooks] = useState([]);

  // 7초마다 자동으로 다음 배너로 이동
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  // 홈 화면용: 최근 업데이트된 도서 6개 가져오기
  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/books`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.data)
          ? raw.data
          : [];

        // createdAt 기준 최신순 정렬 (없으면 id 기준 정렬)
        const sorted = [...list].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          if (!a.createdAt && !b.createdAt) {
            return (b.id ?? 0) - (a.id ?? 0);
          }
          return b.createdAt ? 1 : -1;
        });

        // 홈에서 사용할 형태로 매핑 (최신 6개)
        const mapped = sorted.slice(0, 6).map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          thumbnail: b.bookCoverUrl || b.coverImageUrl || "",
        }));

        setLatestBooks(mapped);
      } catch (err) {
        console.error("홈 최신 도서 조회 오류:", err);
        setLatestBooks([]);
      }
    };

    fetchLatestBooks();
  }, []);

  // 배너 클릭 시 → 전체 목록으로 이동
  const handleHeroClick = () => {
    navigate("/books");
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
    );
  };

  // 최근 업데이트 도서 클릭 → /books/:id 이동
  const handleRecommendClick = (book) => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="home-page">
      {/* 상단 : 슬라이드 영역 */}
      <section className="home-top">
        <div className="home-hero">
          <button
            type="button"
            className="hero-nav hero-nav--left"
            onClick={handlePrev}
          >
            ‹
          </button>

          <div className="home-hero-slide clickable" onClick={handleHeroClick}>
            {bannerImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`배너 이미지 ${index + 1}`}
                className={
                  index === currentIndex
                    ? "home-hero-image is-active"
                    : "home-hero-image"
                }
              />
            ))}
          </div>

          <button
            type="button"
            className="hero-nav hero-nav--right"
            onClick={handleNext}
          >
            ›
          </button>
        </div>
      </section>

      {/* 하단 : 최근 업데이트 된 도서 */}
      <section className="home-bottom">
        <div className="home-section home-section-recommend">
          <h2 className="home-section-title">최근 업데이트 된 도서</h2>

          <div className="recommend-book-list">
            {latestBooks.length === 0 ? (
              <p>최근 업데이트된 도서가 없습니다.</p>
            ) : (
              latestBooks.map((book) => (
                <article
                  key={book.id}
                  className="recommend-book-card clickable"
                  onClick={() => handleRecommendClick(book)}
                >
                  <div className="recommend-book-cover">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="recommend-book-cover-image"
                      />
                    ) : (
                      <span className="recommend-book-cover-placeholder">
                        {book.title?.charAt(0) || "B"}
                      </span>
                    )}
                  </div>
                  <div className="recommend-book-body">
                    <h3 className="recommend-book-title">{book.title}</h3>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
