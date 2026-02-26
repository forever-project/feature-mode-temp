import { message } from 'antd';
import type { RequestConfig } from 'umi';

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

const whitePath = [
  '/oa/getOaData',
  '/fuxiapi/building/saveOrUpdateSiteDetailById',
];

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function isWhitePath(pathname: string) {
  return whitePath.some((item) => pathname.startsWith(item));
}

export const request: RequestConfig = {
  timeout: 10000,
  credentials: 'include',
  errorConfig: {
    errorHandler(error: any) {
      const { response } = error;
      if (!response) {
        message.error('您的网络发生异常，无法连接服务器');
        return;
      }
      const { status } = response;
      const errorText = codeMessage[status] || response.statusText;
      message.error(errorText);
    },
  },
  requestInterceptors: [],
  responseInterceptors: [
    [
      // 响应拦截器
      async (response: Response) => {
        const contentType = response.headers.get('content-type') || '';
        // 非 json 响应，直接放过
        if (!contentType.includes('application/json')) {
          return response;
        }
        let data: any;
        try {
          data = await response.clone().json();
        } catch {
          return response;
        }
        // 业务失败
        if (data?.code !== 200 && data?.code !== 0 && data?.status !== 'ok') {
          const { pathname } = new URL(response.url);
          if (!isWhitePath(pathname)) {
            message.error(data?.msg || data?.message || '请求失败');
          }
        }
        return response;
      },
    ],
  ],
};
