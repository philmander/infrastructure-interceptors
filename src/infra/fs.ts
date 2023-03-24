import { PathLike } from 'fs'
import { FileHandle } from 'fs/promises'
import { readFile as readFileReal } from 'fs/promises'
import GeneralInterceptor from '../interceptor/general-interceptor'

let disabled = false

const readFileInterceptor = new GeneralInterceptor('fs.readFile')

export function addReadFileInterceptor(interceptorAgs: { pathEnd: string, content: string }): void {
  const {
    pathEnd,
    content,
  } = interceptorAgs

  readFileInterceptor.intercept({
    matchingFn: (path) => path.endsWith(pathEnd),
    reply: content,
  })
}

export function assertNoPendingReadFileInterceptors(): void {
  return readFileInterceptor.assertNoPendingInterceptors()
}

export function disableFS(): void {
  disabled = true
}

export async function readFile(path: PathLike | FileHandle, ...args: any) {
  // look for matching, pending interceptor first
  const foundInterceptor = readFileInterceptor.findPending(path)
  if (foundInterceptor) {
    return foundInterceptor.reply
  }
  // bomb if disabled
  if (disabled) {
    throw new Error('Filesystem is disabled')
  }

  // finally, use the real infrastructure
  return await readFileReal(path, ...args)
}