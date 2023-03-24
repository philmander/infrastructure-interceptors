import { MockAgent, setGlobalDispatcher } from 'undici'
import { MockInterceptor } from 'undici/types/mock-interceptor'

const mockAgent = new MockAgent()
setGlobalDispatcher(mockAgent)

export function disableFetch(): void {
  mockAgent.disableNetConnect()
}

export function assertNoPendingFetchInterceptors(): void {
  mockAgent.assertNoPendingInterceptors()
}

type FetchInterceptorArgs = {
  url: string, 
  interceptOpts: MockInterceptor.Options,
  statusCode: number,
  data: string,
  responseHeaders?: Record<string, string>
}

export function addFetchInterceptor(args: FetchInterceptorArgs): void {
  const {
    url, 
    interceptOpts,
    data,
    statusCode = 200,
    responseHeaders = {},
  } = args
  const mockPool = mockAgent.get(url)
  mockPool
    .intercept(interceptOpts)
    .reply(statusCode, data, {
      headers: responseHeaders,
    })
}
