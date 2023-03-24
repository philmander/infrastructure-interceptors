import { Console } from 'console'
import GeneralInterceptor from '../interceptor/general-interceptor'

let disabled = false

const consoleInterceptor = new GeneralInterceptor('console')

export function addConsoleInterceptor(consoleArgs: { messageIncludes: string }) {
  const { messageIncludes } = consoleArgs
  consoleInterceptor.intercept({
    matchingFn: (message) => new RegExp(messageIncludes).test(message)
  })
}

export function disableConsole(): void {
  disabled = true
}

export function assertNoPendingLogInterceptors(): void {
  return consoleInterceptor.assertNoPendingInterceptors()
}

const aConsole = new Console({ stdout: process.stdout, stderr: process.stderr });
const realLog = aConsole.log

aConsole.log = function(...args: any) {
  // look for matching, pending interceptor first
  const interceptor = consoleInterceptor.findPending(args[0])
  if (interceptor) {
    return interceptor.reply
  }
  // bomb if disabled
  if (disabled) {
    throw new Error('console.log is disabled')
  }

  // finally, use the real infrastructure
  return realLog.call(aConsole, ...args)
}

export default aConsole