// src/pages/BookDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
  Stack,
} from "@mui/material";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchBook = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/books/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (res.status === 404) {
          setError("도서를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }
        if (res.status === 403) {
          setError("열람 권한이 없습니다.");
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("도서 정보를 불러오지 못했습니다.");

        const data = await res.json();
        setBook({
          ...data,
          thumbnail: data.thumbnail || data.thumbnailUrl || data.coverImageUrl,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("도서 정보를 불러오지 못했습니다.");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const isOwner =
    currentUser &&
    book &&
    (book.userId === currentUser.userId ||
      book.userId === currentUser.id ||
      book.ownerId === currentUser.userId);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (res.status === 404) {
        setError("도서를 찾을 수 없습니다.");
        return;
      }
      if (res.status === 403) {
        setError("삭제 권한이 없습니다.");
        return;
      }
      if (!res.ok) throw new Error("도서 삭제 중 오류가 발생했습니다.");

      navigate("/books");
    } catch (err) {
      console.error(err);
      setError("도서 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: 2, py: 3 }}>
        <Typography variant="h6">도서 정보를 불러오는 중입니다...</Typography>
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: 2, py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "도서를 찾을 수 없습니다."}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", rowGap: 1 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {book.author}
          </Typography>
        </Box>

        <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
          {book.genre && (
            <Chip
              label={book.genre}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600, mb: 0.5 }}
            />
          )}
          {book.createdAt && (
            <Typography variant="caption" color="text.secondary" display="block">
              업로드: {book.createdAt}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Card
        sx={{
          width: "100%",
          borderRadius: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        {book.thumbnail && (
          <CardMedia
            component="img"
            image={book.thumbnail}
            alt={book.title}
            sx={{
              width: { xs: "100%", sm: 260 },
              height: { xs: 260, sm: "auto" },
              objectFit: "cover",
            }}
          />
        )}

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 3,
          }}
        >
          <Stack spacing={1.5}>
            {book.genre && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  장르
                </Typography>
                <Typography variant="body1">{book.genre}</Typography>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                저자
              </Typography>
              <Typography variant="body1">{book.author}</Typography>
            </Box>

            {book.description && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  책 소개
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                  {book.description}
                </Typography>
              </Box>
            )}
          </Stack>

          <Box
            sx={{
              mt: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              rowGap: 1,
            }}
          >
            <Box>
              {book.ownerName && (
                <Typography variant="caption" color="text.secondary" display="block">
                  작성자: {book.ownerName}
                </Typography>
              )}
              {book.createdAt && (
                <Typography variant="caption" color="text.disabled" display="block">
                  등록일: {book.createdAt}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {isOwner && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/books/${book.id}/edit`)}
                  >
                    수정하기
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "삭제 중..." : "삭제하기"}
                  </Button>
                </>
              )}
              <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
                목록으로
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
