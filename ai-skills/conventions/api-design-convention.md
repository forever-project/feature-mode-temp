# API Design Convention

本规范定义前后端接口设计的约定，确保接口风格统一、易于理解和维护。

## RESTful API 设计

### HTTP 方法

| 方法     | 用途     | 示例                    |
| -------- | -------- | ----------------------- |
| `GET`    | 获取资源 | `GET /api/users`        |
| `POST`   | 创建资源 | `POST /api/users`       |
| `PUT`    | 全量更新 | `PUT /api/users/123`    |
| `PATCH`  | 部分更新 | `PATCH /api/users/123`  |
| `DELETE` | 删除资源 | `DELETE /api/users/123` |

### URL 设计

```typescript
// ✅ 好的设计
GET / api / users; // 列表
GET / api / users / 123; // 详情
POST / api / users; // 创建
PUT / api / users / 123; // 更新
DELETE / api / users / 123; // 删除

// ✅ 资源嵌套
GET / api / users / 123 / orders; // 用户订单列表
POST / api / users / 123 / orders; // 创建用户订单

// ✅ 动作使用动词
POST / api / users / 123 / enable; // 启用用户
POST / api / users / 123 / disable; // 禁用用户

// ❌ 不好的设计
GET / api / getUsers; // 动词在 URL 中
GET / api / userList; // 驼峰命名
POST / api / users / create; // 多余的动词
```

## 响应格式

### 统一响应结构

```typescript
// 成功响应
{
  code: 200,
  message: 'success',
  data: {
    // 响应数据
  }
}

// 错误响应
{
  code: 4001,
  message: '参数错误',
  data: null
}
```

### 列表响应

```typescript
// 列表数据
{
  code: 200,
  message: 'success',
  data: {
    list: [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' }
    ],
    total: 100,
    pageNo: 1,
    pageSize: 10
  }
}
```

### 分页参数

| 参数                 | 类型   | 说明                     |
| -------------------- | ------ | ------------------------ |
| `page` / `pageNo`    | number | 当前页码，从 1 开始      |
| `pageSize` / `limit` | number | 每页条数                 |
| `sort`               | string | 排序字段                 |
| `order`              | string | 排序方式：`asc` / `desc` |

```typescript
// 请求示例
GET /api/users?pageNo=1&pageSize=10&sort=createdAt&order=desc
```

## 状态码

### HTTP 状态码

| 状态码 | 用途                   |
| ------ | ---------------------- |
| `200`  | 请求成功               |
| `201`  | 创建成功               |
| `204`  | 删除成功（无返回内容） |
| `400`  | 请求参数错误           |
| `401`  | 未登录或登录过期       |
| `403`  | 无权限                 |
| `404`  | 资源不存在             |
| `500`  | 服务器内部错误         |

### 业务状态码

| 状态码          | 说明                       |
| --------------- | -------------------------- |
| `200`           | 成功                       |
| `4000` - `4999` | 客户端错误（参数、权限等） |
| `5000` - `5999` | 服务端错误                 |
| `1000` - `1999` | 用户模块业务错误           |
| `2000` - `2999` | 订单模块业务错误           |

```typescript
// 业务错误码示例
const ErrorCode = {
  // 通用
  PARAM_ERROR: 4000,
  UNAUTHORIZED: 4010,
  FORBIDDEN: 4030,

  // 用户模块
  USER_NOT_FOUND: 1001,
  USER_EXISTED: 1002,
  USER_PASSWORD_ERROR: 1003,

  // 订单模块
  ORDER_NOT_FOUND: 2001,
  ORDER_STATUS_ERROR: 2002,
};
```

## 请求规范

### Content-Type

```typescript
// JSON 数据
Content-Type: application/json

// 表单数据
Content-Type: application/x-www-form-urlencoded

// 文件上传
Content-Type: multipart/form-data
```

### 请求体格式

```typescript
// POST /api/users
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "role": "user"
}

// PUT /api/users/123
{
  "name": "张三（修改）",
  "email": "zhangsan@example.com"
}

// PATCH /api/users/123
{
  "status": 0  // 只更新状态字段
}
```

### 批量操作

```typescript
// 批量删除
POST /api/users/batch-delete
{
  "ids": [1, 2, 3]
}

// 批量更新
POST /api/users/batch-update
{
  "ids": [1, 2, 3],
  "data": {
    "status": 0
  }
}
```

## 查询规范

### 筛选条件

```typescript
// 精确匹配
GET /api/users?status=1

// 模糊匹配（搜索）
GET /api/users?name_like=张

// 范围查询
GET /api/users?createdAt_gte=2024-01-01&createdAt_lte=2024-12-31

// 多选
GET /api/users?status_in=1,2,3

// 排序
GET /api/users?sort=createdAt&order=desc
```

### 查询操作符

| 操作符  | 含义     | 示例            |
| ------- | -------- | --------------- |
| `_eq`   | 等于     | `status_eq=1`   |
| `_ne`   | 不等于   | `status_ne=0`   |
| `_gt`   | 大于     | `age_gt=18`     |
| `_gte`  | 大于等于 | `age_gte=18`    |
| `_lt`   | 小于     | `age_lt=60`     |
| `_lte`  | 小于等于 | `age_lte=60`    |
| `_like` | 模糊匹配 | `name_like=张`  |
| `_in`   | 包含     | `status_in=1,2` |
| `_nin`  | 不包含   | `status_nin=0`  |

## 版本控制

```typescript
// URL 版本号
/api/v1/users
/api/v2/users

// Header 版本号
Accept: application/json; version=v1
API-Version: v1
```

## 错误响应示例

```typescript
// 参数错误
{
  code: 4000,
  message: '请求参数错误',
  data: {
    errors: [
      { field: 'name', message: '用户名不能为空' },
      { field: 'email', message: '邮箱格式不正确' }
    ]
  }
}

// 业务错误
{
  code: 1002,
  message: '用户名已存在',
  data: null
}

// 权限错误
{
  code: 4030,
  message: '没有权限执行此操作',
  data: null
}
```

## 接口文档

推荐使用 Swagger/OpenAPI 自动生成接口文档：

```yaml
# swagger.yaml
openapi: 3.0.0
info:
  title: API 文档
  version: 1.0.0
paths:
  /api/users:
    get:
      summary: 获取用户列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: pageSize
          in: query
          schema:
            type: integer
      responses:
        200:
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                  data:
                    type: object
                    properties:
                      list:
                        type: array
                      total:
                        type: integer
```

## Rules

- **RESTful**：遵循 RESTful 设计原则
- **统一格式**：请求响应使用统一的数据结构
- **语义化**：URL 和状态码具有明确语义
- **版本控制**：API 变更时维护版本兼容性
- **文档化**：使用 Swagger 等工具维护接口文档
