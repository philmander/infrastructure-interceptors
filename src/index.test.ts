import { beforeAll, describe, it } from 'vitest'
import { printFileContents, printHttpResponse } from './index'
import { join as joinPaths } from 'path'
import { addReadFileInterceptor, assertNoPendingReadFileInterceptors, disableFS } from './infra/fs'
import { addConsoleInterceptor, assertNoPendingLogInterceptors, disableConsole} from './infra/console'
import { addFetchInterceptor, assertNoPendingFetchInterceptors, disableFetch } from './infra/fetch'

describe('Infrastructure Interceptor Examples', () => {

  beforeAll(() => {
    // if subsequent interceptors fail, the undelying infra will still be disabled
    disableFS()
    disableConsole()
    disableFetch()
  })

  it('prints a file\'s content to the console', async () => {
    // calls to fs.readFile for foo.txt will be intercepted
    addReadFileInterceptor({ 
      pathEnd: 'foo.txt', 
      content: 'I am the file content'
    })

    // calls to console.log will be intercepted
    addConsoleInterceptor({ 
      messageIncludes: 'I am the file content'
    })

    // this function uses the filesystem and the console
    await printFileContents(joinPaths(process.cwd(), 'foo.txt'))

    // if the interceptors worked, the following statements will not throw
    assertNoPendingReadFileInterceptors()
    assertNoPendingLogInterceptors()
  })

  it('prints an http response to the console', async () => {
    // requests to "https://catfact.ninja/fact" (via fetch api) will be intercepted
    addFetchInterceptor({ 
      url: 'https://catfact.ninja',
      interceptOpts: {
        path: '/fact',
      },
      statusCode: 200,
      data: JSON.stringify({
        fact: "Ailurophile is the word cat lovers are officially called.",
        length: 57   
      })
    })

     // calls to console.log will be intercepted
    addConsoleInterceptor({ 
      messageIncludes: 'Ailurophile'
    })

     // this function makes an http request and uses the console
    await printHttpResponse()

    // if the interceptors worked, the following statements will not throw
    assertNoPendingFetchInterceptors()
    assertNoPendingLogInterceptors()
  })
})