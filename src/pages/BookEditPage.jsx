// src/pages/BookEditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export default function BookEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
        setForm({
          title: data.title || "",
          author: data.author || "",
          description: data.description || "",
          genre: data.genre || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const validate = () => {
    if (!form.title.trim()) return "제목을 입력해주세요.";
    if (!form.author.trim()) return "저자를 입력해주세요.";
    if (!form.description.trim()) return "도서 소개를 입력해주세요.";
    if (!form.genre.trim()) return "장르를 입력해주세요.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      // TODO: 백엔드 준비 후 실 요청 테스트 (PUT /api/v1/books/:id)
      const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: form.title.trim(),
          author: form.author.trim(),
          description: form.description.trim(),
          genre: form.genre.trim(),
        }),
      });

      if (res.status === 404) {
        setError("도서를 찾을 수 없습니다.");
        return;
      }
      if (res.status === 403) {
        setError("수정 권한이 없습니다.");
        return;
      }
      if (!res.ok) throw new Error("도서 수정 중 오류가 발생했습니다.");

      const data = await res.json();
      setMessage("도서 정보가 수정되었습니다.");
      setTimeout(() => navigate(`/books/${data.id || id}`), 600);
    } catch (err) {
      console.error(err);
      setError("도서 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", px: 2, py: 3 }}>
        <Typography variant="h6">도서 정보를 불러오는 중입니다...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          도서 수정
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          도서 정보를 수정하고 저장하세요.
        </Typography>

        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          <TextField
            label="제목 *"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          <TextField
            label="저자 *"
            name="author"
            value={form.author}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          <TextField
            label="도서 소개 *"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={4}
            size="small"
          />

          <TextField
            label="장르 *"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
            >
              {saving ? "수정 중..." : "수정하기"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
