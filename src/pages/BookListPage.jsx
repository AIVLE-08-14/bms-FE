// src/pages/BookListPage.jsx
import { useState, useEffect } from "react";
import BookList from "../components/books/BookList";
import { Box, Pagination, Typography, Stack, CircularProgress, Alert } from "@mui/material";

// ✅ .env.local 에서 API 베이스 URL 사용 (예: http://localhost:8080)
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export default function BookListPage() {
  const [books, setBooks] = useState([]);      // 실제 서버 데이터
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/books`, {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.status === 401) {
          setError("도서 목록을 조회하려면 로그인이 필요합니다.");
          setBooks([]);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setError("도서 목록 조회 중 오류가 발생했습니다.");
          setBooks([]);
          setLoading(false);
          return;
        }

        const raw = await res.json();

        // 🔁 API 정의서: [ { "id", "title", "author", "genre", "coverImageUrl" } ]
        // 혹시 ApiResponse 래퍼로 감싸져 온 경우도 대비
        const list = Array.isArray(raw) ? raw : Array.isArray(raw.data) ? raw.data : [];

        // BookList 컴포넌트에 맞게 필드 매핑
        const mapped = list.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          description: b.description || "",      // 백엔드에 없으면 빈 문자열
          genre: b.genre,
          ownerName: b.ownerName || "",          // 없으면 비워둠
          createdAt: b.createdAt || "",          // 없으면 비워둠
          thumbnail: b.coverImageUrl || "",      // API 정의의 coverImageUrl → thumbnail
        }));

        setBooks(mapped);
      } catch (err) {
        console.error(err);
        setError("도서 목록 조회 중 오류가 발생했습니다.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const totalPages = Math.ceil(books.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = books.slice(startIndex, endIndex);

  const handleChangePage = (_event, value) => {
    setPage(value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          책 목록
        </Typography>
        <Typography variant="body2" color="text.secondary">
          사용자들이 업로드한 책 정보를 공유하는 페이지입니다.
        </Typography>
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <>
          <BookList books={currentBooks} />

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
