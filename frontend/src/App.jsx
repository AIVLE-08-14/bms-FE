// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import BookListPage from "./pages/BookListPage.jsx";
import BookCreatePage from "./pages/BookCreatePage.jsx";

function App() {
  return (
    <Routes>
      {/* Layout이 공통 레이아웃 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<BookListPage />} />
        <Route path="books/new" element={<BookCreatePage />} />
        {/* 추후: <Route path="books/:id" element={<BookDetailPage />} /> 등 추가 */}
        <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
      </Route>
    </Routes>
  );
}

export default App;
