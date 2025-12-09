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
    Modal,
    TextField,
} from "@mui/material";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export default function BookDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [showApiKeyModal, setShowApiKeyModal] = useState(false); // 모달 표시 여부
    const [openAIApiKey, setOpenAIApiKey] = useState(""); // 사용자가 입력할 API Key
    const [isGenerating, setIsGenerating] = useState(false); // AI 생성 요청 중 상태
    const [generationMessage, setGenerationMessage] = useState(""); // AI 생성 관련 피드백 메시지

    const rawUserId = localStorage.getItem("userId"); // 문자열 또는 null
    const currentUserId = rawUserId != null ? Number(rawUserId) : null;

    const fetchBook = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        setError("");

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
                data.coverUrl || data.coverImageUrl || data.thumbnail || "";

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

    useEffect(() => {
        fetchBook();
    }, [id]);

    const handleGenerateCover = async () => {
        if (!openAIApiKey.trim() || !book) {
            setGenerationMessage("API Key나 도서 정보가 누락되었습니다.");
            return;
        }

        setIsGenerating(true);
        setGenerationMessage("AI 표지 생성을 요청 중입니다...");
        setShowApiKeyModal(false);

        try {
            const prompt = `A cinematic, fantasy book cover for a book titled '${book.title}' about: ${book.description}. Style: Detailed illustration, deep colors.`;

            const payload = {
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
            };

            const openAIRes = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${openAIApiKey}`,
                },
                body: JSON.stringify(payload),
            });

            if (!openAIRes.ok) {
                const errorData = await openAIRes.json();

                throw new Error(`OpenAI API 호출 실패: ${errorData.error?.message || openAIRes.statusText}`);
            }

            const openAIRaw = await openAIRes.json();

            const imageUrl = openAIRaw.data[0].url;

            setGenerationMessage("이미지 생성 성공! 백엔드에 URL 저장 요청 중...");

            const token = localStorage.getItem("token");

            const saveRes = await fetch(`${API_BASE_URL}/books/${id}/cover`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ coverUrl: imageUrl }),
            });

            if (!saveRes.ok) {
                throw new Error("백엔드 저장 API 호출에 실패했습니다. (URL 전달 실패)");
            }

            await fetchBook();
            setGenerationMessage("AI 표지가 성공적으로 저장되어 화면에 반영되었습니다!");

        } catch (err) {
            console.error(err);
            setGenerationMessage(`AI 표지 생성/저장 중 오류가 발생했습니다: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // ✅ 내가 작성한 책인지 여부
    const isOwner =
        book != null &&
        currentUserId != null &&
        Number(book.userId) === currentUserId;

    console.log("IS OWNER:", isOwner);
    console.log("CURRENT USER ID:", currentUserId);
    console.log("BOOK OWNER ID:", book?.userId);

    // ✅ 삭제 처리
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
        <Box
            sx={{
                width: "100%",
                maxWidth: 1200,
                mx: "auto",
                px: { xs: 2, md: 3 },
                py: { xs: 2, md: 3 },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    flexWrap: "wrap",
                    rowGap: 1,
                }}
            >
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
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                        >
                            업로드: {book.createdAt}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {generationMessage && (
                <Alert severity={generationMessage.includes('오류') ? "error" : "info"} sx={{ mb: 2 }}>
                    {generationMessage}
                </Alert>
            )}

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
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    장르
                                </Typography>
                                <Typography variant="body1">{book.genre}</Typography>
                            </Box>
                        )}

                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                gutterBottom
                            >
                                저자
                            </Typography>
                            <Typography variant="body1">{book.author}</Typography>
                        </Box>

                        {book.description && (
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    책 소개
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
                                >
                                    {book.description}
                                </Typography>
                            </Box>
                        )}
                    </Stack>

                    <Box
                        sx={{
                            mt: "auto",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            flexWrap: "wrap",
                            rowGap: 1,
                            gap: 1,
                        }}
                    >
                        {isOwner && (
                            <>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        setOpenAIApiKey("");
                                        setGenerationMessage("");
                                        setShowApiKeyModal(true);
                                    }}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? "생성 중..." : "AI 표지 생성"}
                                </Button>

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
                </CardContent>
            </Card>

            <Modal
                open={showApiKeyModal}
                onClose={() => setShowApiKeyModal(false)}
                aria-labelledby="api-key-modal-title"
                aria-describedby="api-key-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: 300, sm: 400 },
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="api-key-modal-title" variant="h6" component="h2" mb={2}>
                        AI 표지 생성을 위한 API Key 입력
                    </Typography>
                    <Typography id="api-key-modal-description" sx={{ mt: 1, mb: 3 }}>
                        OpenAI DALL-E API 사용을 위해 **API Secret Key**를 입력해주세요.
                    </Typography>

                    <TextField
                        fullWidth
                        type="password"
                        label="OpenAI API Key"
                        variant="outlined"
                        value={openAIApiKey}
                        onChange={(e) => setOpenAIApiKey(e.target.value)}
                        error={!!generationMessage}
                        helperText={generationMessage}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpenAIApiKey("");
                                setGenerationMessage("");
                                setShowApiKeyModal(false);
                            }}
                            disabled={isGenerating}
                        >
                            취소
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerateCover}
                            disabled={!openAIApiKey.trim() || isGenerating}
                        >
                            {isGenerating ? "요청 중..." : "표지 생성 요청"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}