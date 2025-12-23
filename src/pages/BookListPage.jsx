// src/pages/BookListPage.jsx
import { useState, useEffect } from "react";
import BookList from "../components/books/BookList";
import {
  Box,
  Pagination,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { BASE_URL } from "../api/client.js"

// .env.local 에서 API 베이스 URL 사용 (예: http://localhost:8080)
const API_BASE_URL = `${BASE_URL}/api/v1`;

export default function BookListPage() {
  const [books, setBooks] = useState([]); // 실제 서버 데이터
  const [page, setPage] = useState(1);
  const itemsPerPage = 12; // 4열 기준 한 페이지 12개 보여주기

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
        console.log("BOOK LIST RES:", raw);

        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.data)
          ? raw.data
          : [];

        const sorted = [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

        const mapped = sorted.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          description: b.description || "",
          thumbnail: b.bookCoverUrl || b.coverImageUrl || "",
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
        px: { xs: 1.5, md: 2, xl: 3 }, 
        py: { xs: 2, md: 3 },
      }}
    >
      {/* 상단 헤더 영역 – 좌측 타이틀, 우측 총 개수 */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "flex-end" }}
        spacing={1}
        sx={{ mb: 3 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight={700}>
            책 목록
          </Typography>
          <Typography variant="body2" color="text.secondary">
            사용자들이 업로드한 책 정보를 공유하는 페이지입니다.
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          color="primary"
          sx={{ fontWeight: 600, mt: { xs: 1, sm: 0 } }}
        >
          총 {books.length}권의 도서가 등록되어 있습니다.
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
