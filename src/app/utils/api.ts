// API 服务文件，用于处理后端接口调用

// 后端服务器地址
const API_BASE_URL = 'https://backend-six-vert-19.vercel.app/api';

// 登录接口
export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // 存储 token 到 localStorage
      localStorage.setItem('token', data.token);
      return data;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// 注册接口
export async function register(name: string, email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

// 获取当前用户信息
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      return data.user;
    } else {
      throw new Error(data.error || 'Failed to get user');
    }
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// 退出登录
export function logout() {
  localStorage.removeItem('token');
}

// 对话记录接口
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

// 获取对话记录
export async function getChatRecord(artifactId: number): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${artifactId}`);
    const data = await response.json();

    if (data.success) {
      return data.messages || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Get chat error:', error);
    return [];
  }
}

// 保存对话记录
export async function saveChatRecord(artifactId: number, messages: Message[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${artifactId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Save chat error:', error);
    return false;
  }
}

// 清除对话记录
export async function clearChatRecord(artifactId: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${artifactId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Clear chat error:', error);
    return false;
  }
}