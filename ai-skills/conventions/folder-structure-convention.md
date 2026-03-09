# Folder Structure

本规范定义项目的目录结构标准。

## 根目录结构

```
my-app/
├── config/                 # 配置文件
│   └── config.ts          # Umi 配置
├── mock/                  # Mock 数据
├── src/                   # 源代码
├── .eslintrc.js
├── .prettierrc
├── .umirc.ts             # Umi 配置入口
├── package.json
└── tsconfig.json
```

## src 目录结构

```
src/
├── .umi/                  # Umi 临时文件（自动生成，勿编辑）
├── access.ts              # 权限配置
├── app.ts                 # 运行时配置（request、layout 等）
├── routes.ts              # 路由配置
├── components/            # 基础组件（纯 UI）
│   ├── Button/
│   └── Modal/
├── features/              # 业务核心层
│   ├── order/
│   ├── user/
│   └── shared/           # 共享业务能力
├── hooks/                 # 通用 Hooks
│   └── useDebounce.ts
├── models/                # 全局状态（Umi）
│   └── global.ts
├── pages/                 # 页面层
│   ├── order/
│   └── user/
├── services/              # 全局服务
│   └── common.ts
├── utils/                 # 工具函数
│   ├── format.ts
│   └── validate.ts
└── typings.d.ts           # 全局类型声明
```

## features 目录结构

每个业务域的标准结构：

```
features/{domain}/
├── components/            # 业务组件
│   ├── {Domain}Table/
│   │   ├── index.tsx
│   │   └── _columns.tsx
│   ├── {Domain}SearchForm/
│   │   └── index.tsx
│   └── {Domain}EditModal/
│       └── index.tsx
├── hooks/                 # 业务 Hooks
│   └── use{Domain}List.ts
├── services/              # 业务接口
│   └── index.ts
└── types.ts               # 业务类型
```

## pages 目录结构

```
pages/{domain}/{PageName}/
└── index.tsx              # 页面组件
```

**注意**：

- 不在 pages 下创建 types.ts
- 不在 pages 下创建 service.ts
- Props 类型直接在页面文件中定义

## components 目录结构

基础组件的标准结构：

```
components/{ComponentName}/
├── index.tsx              # 组件出口
├── {ComponentName}.tsx    # 主组件（可选）
├── index.less             # 样式
└── interface.ts           # 类型定义（可选）
```

## 命名规范

### 目录命名

| 类型   | 命名       | 示例                      |
| ------ | ---------- | ------------------------- |
| 业务域 | camelCase  | `order`, `user`, `shared` |
| 页面   | PascalCase | `OrderList`, `UserDetail` |
| 组件   | PascalCase | `OrderTable`, `UserForm`  |
| hooks  | camelCase  | `useOrderList`            |

### 文件命名

| 类型         | 命名           | 示例                   |
| ------------ | -------------- | ---------------------- |
| 页面文件     | index.tsx      | `OrderList/index.tsx`  |
| 组件文件     | PascalCase.tsx | `OrderTable/index.tsx` |
| hook 文件    | camelCase.ts   | `useOrderList.ts`      |
| service 文件 | index.ts       | `index.ts`             |
| 类型文件     | types.ts       | `types.ts`             |
| 私有文件     | \_前缀.ts      | `_columns.tsx`         |

## 导入顺序

文件内的导入顺序：

1. React
2. 第三方库
3. 组件
4. 工具、常量、类型
5. 样式

```typescript
import { FC, useState } from 'react';

import { Button } from 'antd';

import { UserTable } from '@/features/user/components/UserTable';

import { formatDate } from '@/utils/format';

// 如需要样式，取消下面注释
// import styles from './index.less';
```

## 路径别名

```typescript
// ✅ 使用别名
import { UserTable } from '@/features/user/components/UserTable';

// ❌ 不使用相对路径
import { UserTable } from '../../../features/user/components/UserTable';
```

别名配置：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
