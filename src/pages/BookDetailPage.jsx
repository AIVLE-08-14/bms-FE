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
import { BASE_URL } from "../api/client.js"

const API_BASE_URL = `${BASE_URL}/api/v1`;

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // 로그인한 사용자 ID
  const rawUserId = localStorage.getItem("userId"); // 문자열 또는 null
  const currentUserId = rawUserId != null ? Number(rawUserId) : null;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchBook = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/books/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (res.status === 401) {
          setError("도서 정보를 보려면 로그인이 필요합니다.");
          setLoading(false);
          return;
        }
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

        const raw = await res.json();
        const data = raw?.data ?? raw;

        const thumbnail =
          data.coverUrl ||
          data.coverImageUrl ||
          data.thumbnail ||
          data.bookCoverUrl ||
          "";

        setBook({
          ...data,
          thumbnail,
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

  // 내가 작성한 책인지 여부
  const isOwner =
    book != null &&
    currentUserId != null &&
    Number(book.userId) === currentUserId;

  // 삭제 처리
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

      if (res.status === 401) {
        setError("도서를 삭제하려면 로그인이 필요합니다.");
        return;
      }
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
      <Box
        sx={{
          width: "100%",
          py: 3,
          px: { xs: 2, md: 3 },
          bgcolor: "#f5f7fb",
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: "auto" }}>
          <Typography variant="h6">도서 정보를 불러오는 중입니다...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Box
        sx={{
          width: "100%",
          py: 3,
          px: { xs: 2, md: 3 },
          bgcolor: "#0053faff",
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: "auto" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "도서를 찾을 수 없습니다."}
          </Alert>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
        bgcolor: "#ffffffff",
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* 상단 헤더 / 브레드크럼 느낌 */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            rowGap: 1,
          }}
        >
          <Button
            variant="text"
            size="small"
            onClick={() => navigate(-1)}
            sx={{ px: 0, minWidth: "auto" }}
          >
            ← 목록으로
          </Button>

          <Stack direction="row" spacing={1} alignItems="center">
            {isOwner && (
              <Chip
                label="내가 등록한 도서"
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {book.createdAt && (
              <Typography variant="caption" color="text.secondary">
                업로드: {book.createdAt}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* 제목 영역 */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ lineHeight: 1.25, wordBreak: "keep-all" }}
          >
            {book.title}
          </Typography>
          {book.author && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              저자 <strong>{book.author}</strong>
            </Typography>
          )}

          <Box
            sx={{
              mt: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {book.genre && (
              <Chip
                label={book.genre}
                size="small"
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 메인 카드 */}
        <Card
          sx={{
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.18)",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: book.thumbnail ? "320px 1fr" : "1fr",
            },
            background: "linear-gradient(135deg,#fdfbfb 0%,#ebedee 100%)",
          }}
        >
          {/* 왼쪽: 표지 이미지 */}
          {book.thumbnail && (
            <Box
              sx={{
                position: "relative",
                bgcolor: "#d1d1d1ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 2, md: 3 },
              }}
            >
              <CardMedia
                component="img"
                image={book.thumbnail}
                alt={book.title}
                sx={{
                  width: "100%",
                  height: { xs: 320, md: 440 },
                  maxHeight: 520,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                }}
              />

              <Chip
                label="BOOK COVER"
                size="small"
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  bgcolor: "rgba(15,23,42,0.45)",
                  color: "#ffffff",
                  fontSize: 11,
                  letterSpacing: 1,
                }}
              />
            </Box>
          )}

          {/* 오른쪽: 정보 영역 */}
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              p: { xs: 2.5, md: 3.5 },
            }}
          >
            <Stack spacing={2}>
              {/* 책 소개 */}
              {book.description && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontWeight: 600, letterSpacing: 0.4 }}
                  >
                    책 소개
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.7,
                      color: "text.primary",
                    }}
                  >
                    {book.description}
                  </Typography>
                </Box>
              )}

              {/* 추가 메타 섹션이 필요하면 여기 확장 */}
              {/* 예: 출판일, 소유자 등 */}
              {(book.ownerName || book.publisher || book.publishedAt) && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontWeight: 600, letterSpacing: 0.4 }}
                  >
                    정보
                  </Typography>
                  <Stack spacing={0.5}>
                    {book.ownerName && (
                      <Typography variant="body2" color="text.secondary">
                        등록자: {book.ownerName}
                      </Typography>
                    )}
                    {book.publisher && (
                      <Typography variant="body2" color="text.secondary">
                        출판사: {book.publisher}
                      </Typography>
                    )}
                    {book.publishedAt && (
                      <Typography variant="body2" color="text.secondary">
                        출판일: {book.publishedAt}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>

            {/* 버튼 영역 */}
            <Box
              sx={{
                mt: "auto",
                pt: 2,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                flexWrap: "wrap",
                rowGap: 1,
                columnGap: 1,
              }}
            >
              {/* 내가 쓴 책일 때만 수정/삭제 버튼 */}
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

              <Button
                variant="text"
                size="small"
                onClick={() => navigate(-1)}
                sx={{ ml: { xs: 0, md: 1 } }}
              >
                목록으로
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
