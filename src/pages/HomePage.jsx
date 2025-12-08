// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/HomePage.css";
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';

// import { useNavigate } from "react-router-dom";

// 배너 슬라이드 이미지 목록
const bannerImages = [banner1, banner2, banner3];

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

    // 현재 보여주는 인덱스
    const [currentIndex, setCurrentIndex] = useState(0);

    // 5초마다 자동으로 다음 배너로 이동
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
        }, 7000);

        // 컴포넌트가 사라질 때 인터벌 정리
        return () => clearInterval(timer);
    }, []);

    // 추후 실제 데이터로 교체
    const recentBooks = [
        { id: 1, title: "최근 본 책 1", author: "저자 A", genre: "소설" },
        { id: 2, title: "최근 본 책 2", author: "저자 B", genre: "에세이" },
        { id: 3, title: "최근 본 책 3", author: "저자 C", genre: "인문" },
    ];

    const recommendedBooks = [
        { id: 1, title: "추천 도서 1" },
        { id: 2, title: "추천 도서 2" },
        { id: 3, title: "추천 도서 3" },
        { id: 4, title: "추천 도서 4" },
    ];

    // 클릭 시 동작 (지금은 콘솔만, 나중에 상세 페이지 이동으로 교체)
    const handleHeroClick = () => {
        console.log("슬라이드 영역 클릭");
        // 예시) navigate("/books");
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    };

    const handlePrev = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
        );
    };

    const handleRecentClick = (book) => {
        console.log("최근 본 책 클릭:", book.id, book.title);
        // 예시) navigate(`/books/${book.id}`);
    };

    const handleRecommendClick = (book) => {
        console.log("추천 도서 클릭:", book.id, book.title);
        // 예시) navigate(`/books/${book.id}`);
    };

    return (
        <div className="home-page">
            {/* 상단 : 검색바 + 슬라이드 영역 */}
            <section className="home-top">
                <div className="home-search-row">
                    <input
                        className="home-search-input"
                        placeholder="제목, 작가, 장르로 검색해보세요."
                    />
                </div>

                <div className="home-hero">
                    <button
                        type="button"
                        className="hero-nav hero-nav--left"
                        onClick={handlePrev}
                    >
                        ‹
                    </button>

                    <div
                        className="home-hero-slide clickable"
                        onClick={handleHeroClick}
                    >
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

            {/* 하단 : 최근 본 책 / 추천 도서 */}
            <section className="home-bottom">
                {/* 최근 본 책 */}
                <div className="home-section home-section-recent">
                    <h2 className="home-section-title">최근 본 책</h2>

                    <div className="recent-book-list">
                        {recentBooks.map((book) => (
                            <article
                                key={book.id}
                                className="recent-book-card clickable"
                                onClick={() => handleRecentClick(book)}
                            >
                                <div className="recent-book-cover-circle" />
                                <div className="recent-book-info">
                                    <h3 className="recent-book-title">{book.title}</h3>
                                    <p className="recent-book-meta">{book.author}</p>
                                    <p className="recent-book-meta">{book.genre}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* 추천 도서 */}
                <div className="home-section home-section-recommend">
                    <h2 className="home-section-title">추천 도서</h2>

                    <div className="recommend-book-list">
                        {recommendedBooks.map((book) => (
                            <article
                                key={book.id}
                                className="recommend-book-card clickable"
                                onClick={() => handleRecommendClick(book)}
                            >
                                <div className="recommend-book-cover" />
                                <div className="recommend-book-body">
                                    <h3 className="recommend-book-title">{book.title}</h3>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
