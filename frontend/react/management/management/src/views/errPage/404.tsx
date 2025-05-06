import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>抱歉，您访问的页面不存在</p>
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      </div>
    </div>
  );
};

export default NotFound; 