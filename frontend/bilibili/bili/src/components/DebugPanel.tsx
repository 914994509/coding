import { useState, useEffect } from 'react';
import { fetchCourses, SearchParams } from '../util/api';
import '../styles/DebugPanel.css';

const DebugPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('跑步');
  const [categoryId, setCategoryId] = useState('-1');
  const [sortType, setSortType] = useState('1'); // 销量最高
  const [page, setPage] = useState(1);
  const [showPanel, setShowPanel] = useState(true);

  const testFetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: SearchParams = {
        word: keyword,
        classification_id: categoryId !== '-1' ? categoryId : undefined,
        sort_type: getSortType(sortType),
        page,
        page_size: 10
      };

      console.log('请求参数:', params);
      const data = await fetchCourses(params);
      console.log('API返回数据:', data);

      setResults(data);
    } catch (err) {
      console.error('API调用失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  // 将排序类型ID转换为API需要的格式
  const getSortType = (sortId: string): string | undefined => {
    switch (sortId) {
      case '1': return 'sales'; // 销量最高
      case '2': return 'latest'; // 最新上架
      case '3': return 'price_asc'; // 价格最低
      case '4': return 'price_desc'; // 价格最高
      default: return undefined; // 综合排序
    }
  };

  return (
    <div className={`debug-panel ${showPanel ? 'open' : 'closed'}`}>
      <div className="debug-toggle" onClick={() => setShowPanel(!showPanel)}>
        {showPanel ? '隐藏' : '显示'} 调试面板
      </div>

      {showPanel && (
        <div className="debug-content">
          <h3>API调试工具</h3>

          <div className="debug-controls">
            <div className="control-group">
              <label>搜索关键词</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="输入关键词"
              />
            </div>

            <div className="control-group">
              <label>分类ID</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="-1">全部</option>
                <option value="1">语言学习</option>
                <option value="2">职场提升</option>
                <option value="3">兴趣技能</option>
                <option value="4">考试考证</option>
                <option value="6">运动健身</option>
              </select>
            </div>

            <div className="control-group">
              <label>排序方式</label>
              <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                <option value="-1">综合排序</option>
                <option value="1">销量最高</option>
                <option value="2">最新上架</option>
                <option value="3">价格最低</option>
                <option value="4">价格最高</option>
              </select>
            </div>

            <div className="control-group">
              <label>页码</label>
              <input
                type="number"
                min="1"
                value={page}
                onChange={(e) => setPage(parseInt(e.target.value) || 1)}
              />
            </div>

            <button
              className="fetch-button"
              onClick={testFetchData}
              disabled={loading}
            >
              {loading ? '请求中...' : '测试API调用'}
            </button>
          </div>

          {error && (
            <div className="debug-error">
              <h4>错误信息</h4>
              <pre>{error}</pre>
            </div>
          )}

          {results && (
            <div className="debug-results">
              <h4>API返回结果</h4>
              <div className="results-summary">
                <p>总计: {results.total || results.totalPages || 0} 条记录</p>
                <p>当前页: {page}</p>
                <p>返回课程数: {results.courses.length}</p>
              </div>

              <div className="results-details">
                <h5>课程数据:</h5>
                <pre>{JSON.stringify(results.courses[0] || {}, null, 2)}</pre>

                {results.courses.length > 0 && (
                  <div className="sample-course">
                    <h5>第一个课程预览:</h5>
                    <div className="preview-card">
                      <img
                        src={results.courses[0].cover || 'https://via.placeholder.com/236x133.png?text=暂无封面'}
                        alt={results.courses[0].title}
                        className="preview-image"
                      />
                      <div className="preview-details">
                        <h4>{results.courses[0].title}</h4>
                        <p>{results.courses[0].brief || '暂无简介'}</p>
                        <p>价格: ¥{results.courses[0].price.toFixed(0)}</p>
                        <p>学习人数: {results.courses[0].studentCount?.toLocaleString() || 0}</p>
                        <p>章节数: {results.courses[0].chapterCount || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;                                                                      