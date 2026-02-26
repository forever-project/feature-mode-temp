# Testing Convention

本规范定义项目中测试代码的编写规则，确保测试覆盖全面、易于维护。

## 测试文件组织

### 文件位置

```
src/
├── features/
│   └── user/
│       ├── components/
│       │   ├── UserTable/
│       │   │   ├── index.tsx
│       │   │   └── index.test.tsx    # 组件测试
│       ├── hooks/
│       │   ├── useUserList.ts
│       │   └── useUserList.test.ts   # Hook 测试
│       └── utils/
│           ├── format.ts
│           └── format.test.ts        # 工具函数测试
```

### 命名规范

| 类型     | 命名                       | 示例                 |
| -------- | -------------------------- | -------------------- |
| 单元测试 | `*.test.ts` / `*.test.tsx` | `UserTable.test.tsx` |
| E2E 测试 | `*.spec.ts`                | `user.spec.ts`       |
| 测试工具 | `test-utils.ts`            | `test-utils.tsx`     |

## 测试工具

推荐使用以下测试工具：

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.x",
    "@testing-library/react-hooks": "^8.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "jest": "^29.x",
    "vitest": "^1.x"
  }
}
```

## 组件测试

### 基本结构

```typescript
// UserTable.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserTable } from './index';

const mockUsers = [
  { id: 1, name: '张三', status: 1 },
  { id: 2, name: '李四', status: 0 },
];

describe('UserTable', () => {
  // 渲染测试
  it('should render user list correctly', () => {
    render(<UserTable data={mockUsers} loading={false} />);

    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
  });

  // 交互测试
  it('should call onEdit when edit button clicked', async () => {
    const onEdit = jest.fn();
    render(<UserTable data={mockUsers} onEdit={onEdit} />);

    const editButton = screen.getAllByText('编辑')[0];
    await userEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  // 加载状态测试
  it('should show loading state', () => {
    render(<UserTable data={[]} loading={true} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // 空数据测试
  it('should show empty state when no data', () => {
    render(<UserTable data={[]} loading={false} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});
```

### 异步组件测试

```typescript
// UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from './index';
import * as userService from '@/features/user/services';

jest.mock('@/features/user/services');

describe('UserList', () => {
  it('should fetch and display user list', async () => {
    const mockFetchUserList = jest
      .spyOn(userService, 'fetchUserList')
      .mockResolvedValue({
        list: [{ id: 1, name: '张三' }],
        total: 1,
      });

    render(<UserList />);

    // 等待加载完成
    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument();
    });

    expect(mockFetchUserList).toHaveBeenCalled();
  });
});
```

## Hook 测试

```typescript
// useUserList.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserList } from './useUserList';
import * as userService from '../services';

jest.mock('../services');

describe('useUserList', () => {
  it('should fetch user list on mount', async () => {
    jest.spyOn(userService, 'fetchUserList').mockResolvedValue({
      list: [{ id: 1, name: '张三' }],
      total: 1,
    });

    const { result } = renderHook(() => useUserList());

    // 初始状态
    expect(result.current.loading).toBe(true);

    // 等待请求完成
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.list).toHaveLength(1);
    expect(result.current.list[0].name).toBe('张三');
  });

  it('should handle search', async () => {
    const mockFetch = jest
      .spyOn(userService, 'fetchUserList')
      .mockResolvedValue({ list: [], total: 0 });

    const { result } = renderHook(() => useUserList());

    act(() => {
      result.current.search({ name: '张三' });
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({ name: '张三', page: 1 }),
      );
    });
  });

  it('should handle pagination change', async () => {
    const mockFetch = jest
      .spyOn(userService, 'fetchUserList')
      .mockResolvedValue({ list: [], total: 0 });

    const { result } = renderHook(() => useUserList());

    act(() => {
      result.current.changePage(2, 20);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({ pageNo: 2, pageSize: 20 }),
      );
    });
  });
});
```

## 工具函数测试

```typescript
// utils.test.ts
import { formatDate, formatCurrency, debounce } from './utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = '2024-01-15';
    expect(formatDate(date)).toBe('2024年01月15日');
  });

  it('should handle invalid date', () => {
    expect(formatDate('invalid')).toBe('-');
  });
});

describe('formatCurrency', () => {
  it('should format currency with default options', () => {
    expect(formatCurrency(1234567.89)).toBe('¥1,234,567.89');
  });

  it('should format currency with custom currency', () => {
    expect(formatCurrency(100, { currency: 'USD' })).toBe('$100.00');
  });
});

describe('debounce', () => {
  jest.useFakeTimers();

  it('should delay function execution', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 500);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

## Service 测试

```typescript
// services/index.test.ts
import { fetchUserList, createUser } from './';
import request from '@/utils/request';

jest.mock('@/utils/request');

describe('user services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUserList', () => {
    it('should fetch user list successfully', async () => {
      const mockData = {
        list: [{ id: 1, name: '张三' }],
        total: 1,
      };

      (request.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await fetchUserList({ pageNo: 1, pageSize: 10 });

      expect(result).toEqual(mockData);
      expect(request.get).toHaveBeenCalledWith('/api/users', {
        params: { page: 1, pageSize: 10 },
      });
    });

    it('should handle error', async () => {
      const error = new Error('Network Error');
      (request.get as jest.Mock).mockRejectedValue(error);

      await expect(fetchUserList({ pageNo: 1 })).rejects.toThrow(
        'Network Error',
      );
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = { name: '张三', email: 'zhangsan@example.com' };
      const mockResponse = { id: 1, ...userData };

      (request.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await createUser(userData);

      expect(result).toEqual(mockResponse);
      expect(request.post).toHaveBeenCalledWith('/api/users', userData);
    });
  });
});
```

## E2E 测试

```typescript
// user.spec.ts
import { test, expect } from '@playwright/test';

test.describe('用户管理', () => {
  test.beforeEach(async ({ pageNo }) => {
    await page.goto('/user/list');
  });

  test('应该显示用户列表', async ({ pageNo }) => {
    await expect(page.getByText('用户列表')).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('应该能搜索用户', async ({ pageNo }) => {
    const searchInput = page.getByPlaceholder('请输入用户名');
    await searchInput.fill('张三');
    await page.getByRole('button', { name: '查询' }).click();

    await expect(page.getByText('张三')).toBeVisible();
  });

  test('应该能创建用户', async ({ page }) => {
    await page.getByRole('button', { name: '新增' }).click();

    await page.getByLabel('用户名').fill('新用户');
    await page.getByLabel('邮箱').fill('new@example.com');
    await page.getByRole('button', { name: '确定' }).click();

    await expect(page.getByText('创建成功')).toBeVisible();
  });
});
```

## 测试覆盖率

推荐配置：

```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/index.ts",
      "!src/**/*.test.{ts,tsx}"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 测试最佳实践

### 1. 测试独立性

```typescript
// ✅ 每个测试独立
it('test A', () => {
  const result = add(1, 2);
  expect(result).toBe(3);
});

it('test B', () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});

// ❌ 避免测试间依赖
let shared = 0;
it('test A', () => {
  shared = add(1, 2);
  expect(shared).toBe(3);
});
it('test B', () => {
  // 依赖 test A 的结果
  expect(shared + 2).toBe(5);
});
```

### 2. 使用 beforeEach 重置状态

```typescript
describe('UserList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 测试用例...
});
```

### 3. 有意义的测试描述

```typescript
// ✅ 好的描述
describe('UserTable', () => {
  it('should render user name in the table', () => {});
  it('should call onEdit when edit button is clicked', () => {});
  it('should display empty state when no users', () => {});
});

// ❌ 不好的描述
describe('UserTable', () => {
  it('test 1', () => {});
  it('works correctly', () => {});
});
```

## Rules

- **全覆盖**：核心逻辑必须 100% 覆盖
- **独立性**：测试之间相互独立，不依赖执行顺序
- **可维护**：测试代码和产品代码同等重要，保持整洁
- **快速执行**：单元测试应该快速执行，避免真实网络请求
- **有意义**：测试描述清晰，易于理解测试目的
