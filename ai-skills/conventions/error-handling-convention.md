# Error Handling Convention

本规范定义项目中错误处理的标准方式，确保错误被正确捕获、处理和反馈。

## 错误分类

### 1. 业务错误

后端返回的业务逻辑错误，如参数校验失败、权限不足等：

```typescript
// 后端返回格式示例
{
  code: 4001,
  message: '用户名已存在',
  data: null
}
```

### 2. 网络错误

网络层面的错误，如请求超时、断网等：

```typescript
// Request 错误示例
{
  message: 'Network Error',
  code: 'ECONNABORTED'
}
```

### 3. 系统错误

后端系统错误，如 500 内部服务器错误：

```typescript
{
  code: 500,
  message: 'Internal Server Error'
}
```

## 错误处理层级

### 1. Service 层

统一封装请求错误处理：

```typescript
// features/user/services/index.ts
import { message } from 'antd';

export async function fetchUserList(params: UserListQuery) {
  try {
    const res = await request.get('/api/users', { params });
    return res.data;
  } catch (error: any) {
    // 统一错误提示
    message.error(error.message || '获取用户列表失败');
    throw error;
  }
}
```

### 2. Hook 层

处理业务状态错误：

```typescript
// hooks/useUserList.ts
export function useUserList() {
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserList(query);
      setList(data.list);
    } catch (err) {
      setError(err as Error);
      // 可选择在这里处理或继续抛出
    } finally {
      setLoading(false);
    }
  };

  return { list, error, reload: load };
}
```

### 3. 组件层

处理 UI 交互错误：

```typescript
// pages/UserList/index.tsx
const handleDelete = async (id: number) => {
  try {
    await deleteUser(id);
    message.success('删除成功');
    reload();
  } catch (error) {
    // 错误已在 service 层提示，这里可选择额外处理
    console.error('删除用户失败:', error);
  }
};
```

## 错误处理模式

### 模式一：统一错误处理（推荐）

在 `src/app.ts` 中通过 Umi Max 的 request 配置统一处理：

```typescript
// src/app.ts
import { RequestConfig } from '@umijs/max';
import { message } from 'antd';

// 全局请求配置
export const request: RequestConfig = {
  // 基础配置
  baseURL: '/api',
  timeout: 10000,

  // 请求拦截器
  requestInterceptors: [
    (config) => {
      // 添加 token 等通用请求头
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      const { data } = response;
      const { code, message: msg, data: result } = data;

      // 业务成功
      if (code === 200) {
        return result;
      }

      // 业务错误
      message.error(msg || '操作失败');
      throw new Error(msg);
    },
  ],

  // 错误处理
  errorConfig: {
    errorHandler: (error) => {
      // HTTP 错误
      if (error.response) {
        const { status } = error.response;

        switch (status) {
          case 401:
            message.error('登录已过期，请重新登录');
            // 跳转登录页
            break;
          case 403:
            message.error('没有权限执行此操作');
            break;
          case 404:
            message.error('请求的资源不存在');
            break;
          case 500:
            message.error('服务器内部错误');
            break;
          default:
            message.error('网络请求失败');
        }
      } else if (error.request) {
        message.error('网络连接失败，请检查网络');
      } else {
        message.error('请求配置错误');
      }

      throw error;
    },
  },
};
```

更多配置参考：[Umi Max Request 文档](https://umijs.org/docs/max/request#requestconfig)

### 模式二：局部错误处理

在特定场景下单独处理错误：

```typescript
// 表单提交，需要区分不同错误类型
const handleSubmit = async (values: UserForm) => {
  try {
    await createUser(values);
    message.success('创建成功');
    onSuccess?.();
  } catch (error: any) {
    // 根据错误码处理
    if (error.code === 4001) {
      message.error('用户名已存在');
      // 设置表单错误
      form.setFields([{ name: 'username', errors: ['用户名已存在'] }]);
    } else {
      message.error(error.message || '创建失败');
    }
  }
};
```

### 模式三：错误边界（Error Boundary）

捕获 React 组件渲染错误：

```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // 可上报错误日志
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>出错了，请刷新页面重试</div>;
    }

    return this.props.children;
  }
}
```

使用方式：

```typescript
// App.tsx
<ErrorBoundary>
  <Router />
</ErrorBoundary>
```

## 错误反馈规范

### 1. 错误提示文案

- 用户友好：避免技术术语，使用用户能理解的语言
- actionable：告诉用户下一步可以做什么
- 简洁：避免冗长的错误描述

```typescript
// ❌ 不好的提示
message.error('Error: Network request failed with status code 500');

// ✅ 好的提示
message.error('加载失败，请稍后重试');
```

### 2. 错误码规范

建议后端统一错误码格式：

```typescript
// 错误码格式：模块 + 错误类型
const ErrorCode = {
  // 通用
  SUCCESS: 200,
  PARAM_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,

  // 用户模块 1000 - 1999
  USER_NOT_FOUND: 1001,
  USER_EXISTED: 1002,
  USER_PASSWORD_ERROR: 1003,

  // 订单模块 2000 - 2999
  ORDER_NOT_FOUND: 2001,
  ORDER_STATUS_ERROR: 2002,
} as const;
```

### 3. 表单错误处理

```typescript
// 表单字段级错误
const handleSubmit = async (values: UserForm) => {
  try {
    await createUser(values);
  } catch (error: any) {
    if (error.fieldErrors) {
      // 设置表单字段错误
      form.setFields(
        Object.entries(error.fieldErrors).map(([field, errors]) => ({
          name: field,
          errors: errors as string[],
        })),
      );
    } else {
      message.error(error.message);
    }
  }
};
```

## Loading 与 Error 状态管理

```typescript
// 推荐：同时管理 loading 和 error 状态
function useAsync<T>(asyncFunction: () => Promise<T>) {
  const [state, setState] = useState<{
    data?: T;
    loading: boolean;
    error?: Error;
  }>({
    loading: false,
  });

  const execute = useCallback(async () => {
    setState({ loading: true });
    try {
      const data = await asyncFunction();
      setState({ data, loading: false });
      return data;
    } catch (error) {
      setState({ error: error as Error, loading: false });
      throw error;
    }
  }, [asyncFunction]);

  return { ...state, execute };
}

// 使用
const {
  data,
  loading,
  error,
  execute: fetchUsers,
} = useAsync(() => fetchUserList(query));
```

## Rules

- **分层处理**：不同层级处理不同类型的错误
- **统一提示**：避免重复提示，统一错误提示风格
- **用户友好**：错误提示文案使用用户能理解的语言
- **记录日志**：重要错误记录到日志系统
- **降级处理**：关键错误提供降级方案或重试机制
- **类型安全**：使用 TypeScript 类型确保错误处理完整
