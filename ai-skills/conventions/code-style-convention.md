# Code Style

本规范定义代码风格规则，确保代码整洁、一致、可读。

## 格式化配置

### Prettier 配置

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true
}
```

### ESLint 规则

- 使用 `@umijs/lint` 配置
- 禁止使用 `any` 类型
- 强制使用严格相等 `===`

## 缩进与空格

### 缩进

- 使用 2 个空格（不要使用 Tab）
- 保持一致的缩进层级

```typescript
// ✅ 正确
const useOrderList = () => {
  const [data, setData] = useState({ list: [], total: 0 });
  const [loading, setLoading] = useState(false);
};

// ❌ 错误（前面有多余空格）
const useOrderList = () => {
  const [data, setData] = useState({ list: [], total: 0 });
};
```

### 空格规则

```typescript
// ✅ 正确
const a = 1;
const obj = { a: 1, b: 2 };
if (condition) {
}

// ❌ 错误
const a = 1;
const obj = { a: 1, b: 2 };
if (condition) {
}
```

## 引号

- 字符串使用单引号
- JSX 属性使用双引号

```typescript
// ✅ 正确
import { useState } from 'react';
const name = 'order';

// JSX
<Button type="primary">提交</Button>;
```

## 分号

- 语句末尾使用分号

```typescript
// ✅ 正确
const a = 1;
const b = 2;

// ❌ 错误
const a = 1;
const b = 2;
```

## 行长度

- 单行不超过 100 个字符
- 过长时换行

```typescript
// ✅ 正确
const result = await fetchUserList({
  page: 1,
  pageSize: 10,
  keyword: 'search term',
});

// ❌ 错误
const result = await fetchUserList({
  page: 1,
  pageSize: 10,
  keyword: 'search term',
  status: 1,
  sort: 'createdAt',
});
```

## 空行

### 文件内空行

使用空行分隔不同分组的导入和逻辑块，**不需要**添加分区注释：

```typescript
import { FC } from 'react';

import { Button } from 'antd';

import { UserTable } from '@/components/UserTable';

import styles from './index.less';

const Component = () => {
  const [state, setState] = useState();

  const onClick = () => { };

  return (...);
};
```

## 注释风格

- 使用单行注释 `//`
- 注释与代码之间空一格
- 注释内容使用中文

```typescript
// ✅ 正确
// 获取用户列表
const fetchUserList = async () => {};

// ❌ 错误
//获取用户列表
const fetchUserList = async () => {};
```

## 禁用规则

以下代码风格禁止：

```typescript
// ❌ 禁止使用 var
var a = 1;

// ❌ 禁止使用 console（生产代码）
console.log('debug');

// ❌ 禁止使用 eval
eval('code');

// ❌ 禁止使用 ==
if (a == b) {
}

// ❌ 禁止使用 with
with (obj) {
}
```
