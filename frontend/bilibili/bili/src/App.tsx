import { SearchProvider } from "./context/SearchContext";
import CourseContent from "./components/CourseContent";
// import DebugPanel from "./components/DebugPanel";
import { SearchBar } from "./components/SearchBar";
import "./styles/CategoryNav.css"; // 确保全局引入样式

function App() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-[#f6f7f8]">
        <div className="search-wrp bigMode">
          <SearchBar />
          {/* <SearchHeader /> */}
        </div>
        <main
          className="search-wrp bigMode hasPagi py-6"
          style={{ width: "1248px", margin: "0 auto" }}
        >
          <CourseContent />
        </main>
        <footer className="bg-white py-6 border-t border-[#e3e5e7]">
          <div className="text-center mb-4">
            © 哔哩哔哩 bilibili.com 版权所有
          </div>
        </footer>
        {/* 调试面板 */}
        {/* <DebugPanel /> */}
      </div>
    </SearchProvider>
  );
}

export default App;
