---
name: page-imports
description: 规范页面和组件文件的代码组织方式，包括导入顺序、类型声明位置、变量声明顺序等排版规则。
license: MIT
metadata:
  author: frontend-team
  version: '1.0.0'
---

# Page Imports Skill

本 Skill 定义**页面和组件文件的代码组织方式**。所有实现必须遵守 `ai-skills/SKILL.md`、`conventions/*.md`。

## When to Apply

- 创建新的页面或组件文件时
- 重构已有文件，统一代码排版风格
- 需要保持代码可读性和可维护性

## Output Structure

文件中的代码按以下顺序组织（生成代码时**不添加注释分隔符**）：

```
1. React 导入
2. 第三方 npm 包导入（antd、umi、moment 等）
3. 组件导入（业务组件、基础组件）
4. 其他导入（接口、常量、util 方法等）
5. 样式导入
6. 组件 Props 类型声明
7. 组件实现
   - props 解构
   - state 声明
   - hooks 使用
   - 方法定义
   - JSX 返回
```

**注意**：生成的代码中**不需要**包含 `// 1. React`、`// 2. 第三方包` 等分区注释，上述顺序仅作为组织逻辑参考。

## Code Template

```tsx
import { FC, useState, useEffect } from 'react';

import { Button, Card, Space, Table, Form, Input, message } from 'antd';
import { history, useSearchParams } from 'umi';
import { PageContainer } from '@ant-design/pro-components';

import { DomainTable } from '@/features/{domain}/components/DomainTable';
import { DomainSearchForm } from '@/features/{domain}/components/DomainSearchForm';
import { DomainEditModal } from '@/features/{domain}/components/DomainEditModal';

import { fetchDomainDetail } from '@/features/{domain}/services';
import { Domain, DomainListQuery } from '@/features/{domain}/types';
import { formatDate } from '@/utils/date';

// 如需要样式，取消下面注释
// import styles from './index.less';

interface DomainListPageProps {}

const DomainListPage: FC<DomainListPageProps> = (props) => {
  const { initialData } = props;

  const [list, setList] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  const memoizedData = useMemo(() => {
    return list.filter((item) => item.status === 1);
  }, [list]);

  useEffect(() => {
    loadDomainList();
  }, [queryParams]);

  useEffect(() => {}, []);

  function loadDomainList() {}

  const onSearch = (values: DomainListQuery) => {
    setQueryParams((prev) => ({ ...prev, pageNo: 1, filters: values }));
  };

  const onPageChange = (pageNo: number, pageSize: number) => {
    setQueryParams((prev) => ({ ...prev, pageNo, pageSize }));
  };

  const onEdit = (record: Domain) => {};

  const onDetail = (record: Domain) => {
    history.push(`/{domain}/detail?id=${record.id}`);
  };

  return (
    <PageContainer>
      <Card>
        <DomainSearchForm onSearch={onSearch} />
      </Card>
      <Card title="列表">
        <DomainTable
          data={list}
          pagination={{
            // 优先根据上下文（如 API 定义）决定使用 pageNo 还是 page
            current: queryParams.pageNo || queryParams.page,
            pageSize: queryParams.pageSize,
          }}
          onPageChange={onPageChange}
          onEdit={onEdit}
          onDetail={onDetail}
        />
      </Card>
    </PageContainer>
  );
};

export default DomainListPage;
```

## Rules

- **按顺序输出**
  - 严格按照 1-7 的顺序组织代码
  - 不同类别的内容之间空一行
- **导入分组**
  - React 导入放第一组
  - 第三方包放第二组
  - 组件放第三组（按从抽象到具体排序）
  - 其他放第四组
  - 样式放最后
- **类型声明**
  - 每个组件只保留一个基础的 props 声明
  - 名称为 `ComponentName + Props`
  - 其余类型放到 `types.ts` 文件中
- **变量声明顺序**
  - 先解构 props
  - 再声明 state
  - 再使用 hooks
  - 最后定义方法
- **方法声明**
  - 如果 hooks (如 `useEffect`) 里面调用了组件内部声明的方法，**必须**使用 `function` 关键字声明，且该方法定义应放在调用它的 hook 之后（利用 function 提升特性）。
  - 其他不涉及提升的普通事件处理方法（如 `onSearch`, `onEdit`）建议使用 `const` 声明箭头函数。
- **空行分隔**
  - 不同类别的导入之间空一行
  - 不同类别的声明之间空一行
- **文件大小限制**
  - **TSX/JSX 文件代码行数不超过 300 行**
  - 超过 300 行的文件应该拆分为多个子组件或抽离逻辑到 hooks
  - 私有子组件使用 `_` 前缀命名（如 `_SubComponent.tsx`）
- **分页字段命名**
  - 优先遵循上下文（API 文档、现有 TS 类型）定义的字段名
  - 如果上下文中没有定义，默认使用 `pageNo` 和 `pageSize`

## Usage Scenarios

- 创建新的页面或组件时遵循此排版规范
- 重构代码时统一导入顺序和代码组织
- 代码审查时检查是否符合此规范
