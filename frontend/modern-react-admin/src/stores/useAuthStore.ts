import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from 'axios';

// 用户类型
interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  email: string;
  roleId: string;
  isSecondFactorEnabled: boolean;
  permissions?: string[];
}

// 登录活动类型
interface LoginActivity {
  id: string;
  userId: string;
  ip: string;
  userAgent: string;
  time: string;
  status: 'success' | 'failure';
  reason?: string;
}

// 认证状态
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 方法
  login: (username: string, password: string) => Promise<{ user: User } | null>;
  logout: () => void;
  clearError: () => void;
  updateUserProfile: (userData: Partial<User>) => void;

  // 登录活动相关
  recordLoginActivity: (activity: Omit<LoginActivity, 'id' | 'time'>) => void;
}

// 假设的用户数据库
const userDb = [
  {
    id: '1',
    username: 'admin',
    name: '系统管理员',
    email: 'admin@example.com',
    password: 'admin123', // 实际应用中密码应该加密存储
    roleId: '1', // 超级管理员
    isSecondFactorEnabled: true,
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    permissions: ['*'] // 所有权限
  },
  {
    id: '2',
    username: 'operator',
    name: '运营人员',
    email: 'operator@example.com',
    password: 'operator123',
    roleId: '4', // 运营人员
    isSecondFactorEnabled: false,
    permissions: ['user:view', 'role:view']
  },
  {
    id: '3',
    username: 'auditor',
    name: '审计员',
    email: 'auditor@example.com',
    password: 'auditor123',
    roleId: '5', // 审计员
    isSecondFactorEnabled: false,
    permissions: ['audit:view', 'user:view']
  }
];

// 登录活动记录
let loginActivities: LoginActivity[] = [];

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (username: string, password: string) => {
          set({ isLoading: true, error: null });
          console.log('开始登录流程:', username);

          try {
            // 移除外部API调用，直接使用本地IP标记
            const ip = "本地登录";

            // 模拟登录API调用
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 查找用户
            const foundUser = userDb.find(u => u.username === username);
            console.log('查找用户结果:', foundUser ? '找到用户' : '未找到用户');

            if (foundUser && foundUser.password === password) {
              // 登录成功
              const { password: _, ...userWithoutPassword } = foundUser;
              const user = userWithoutPassword as User;

              // 记录登录活动
              get().recordLoginActivity({
                userId: user.id,
                ip,
                userAgent: navigator.userAgent,
                status: 'success'
              });

              // 设置登录状态
              console.log('登录成功，更新认证状态');
              set({
                isLoading: false,
                token: 'mock-jwt-token-' + Math.random(),
                user,
                isAuthenticated: true,
              });

              // 确认状态已更新
              console.log('认证状态已更新为:', true);
              return { user };
            } else {
              // 登录失败
              const userId = foundUser?.id || 'unknown';
              console.log('登录失败:', foundUser ? '密码错误' : '用户不存在');

              // 记录失败的登录尝试
              get().recordLoginActivity({
                userId,
                ip,
                userAgent: navigator.userAgent,
                status: 'failure',
                reason: foundUser ? '密码错误' : '用户不存在'
              });

              set({
                isLoading: false,
                error: '用户名或密码错误',
              });
              return null;
            }
          } catch (error) {
            console.error('登录过程中发生错误:', error);
            set({
              isLoading: false,
              error: '登录服务暂时不可用，请稍后再试',
            });
            return null;
          }
        },

        logout: () => {
          // 记录登出活动
          if (get().user) {
            get().recordLoginActivity({
              userId: get().user!.id,
              ip: '本地操作', // 实际应用中应该获取真实IP
              userAgent: navigator.userAgent,
              status: 'success',
              reason: '用户主动登出'
            });
          }

          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        },

        clearError: () => {
          set({ error: null });
        },

        updateUserProfile: (userData) => {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...userData }
            });
          }
        },

        recordLoginActivity: (activity) => {
          const newActivity: LoginActivity = {
            id: Date.now().toString(),
            time: new Date().toISOString(),
            ...activity
          };

          // 在实际应用中，这里应该发送API请求记录登录活动
          loginActivities = [newActivity, ...loginActivities].slice(0, 1000); // 只保留最近1000条记录

          console.log('登录活动已记录:', newActivity);
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

// 提供一个获取登录活动记录的辅助函数
export const getLoginActivities = (userId?: string) => {
  if (userId) {
    return loginActivities.filter(activity => activity.userId === userId);
  }
  return loginActivities;
};

export default useAuthStore; 