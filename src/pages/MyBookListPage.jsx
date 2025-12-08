// src/pages/MyBookListPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import BookList from "../components/books/BookList";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export default function MyBookListPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 로그인 안 되어 있으면 로그인 페이지로 보내기
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchMyBooks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/books/me`, {
          // 실제 엔드포인트에 맞게 수정
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } else {
            setError("내가 작성한 책 목록을 가져오는 중 오류가 발생했습니다.");
          }
          setLoading(false);
          return;
        }

        const data = await res.json();

        // 백엔드에서 내려주는 필드에 맞게 매핑
        // 예시: [{ id, title, authorName, description, thumbnailUrl, createdAt }, ...]
        const mapped = data.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.authorName || book.author || "나", // 없으면 임시
          description: book.description,
          thumbnail: book.thumbnailUrl,
          createdAt: book.createdAt,
        }));

        setBooks(mapped);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("서버와 통신 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [navigate]);

  if (!localStorage.getItem("token")) {
    // 위에서 navigate 한 직후 렌더 한 번 더 도는 것 방지용
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          내가 작성한 책
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            불러오는 중...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={700}>
          내가 작성한 책
        </Typography>
        <Typography variant="body2" color="text.secondary">
          로그인한 사용자가 작성한 책 목록입니다.
        </Typography>
      </Box>

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <BookList books={books} />
      )}
    </Box>
  );
}
