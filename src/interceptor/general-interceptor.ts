export type MatchingFn = (...args: any) => boolean

type InterceptArgs = {
  matchingFn: MatchingFn,
  reply?: any,
}

/**
 * This class helps to generalize common parts of add interceptors to infrastructure wrappers
 */
export default class GeneralInterceptor {
  
  #name: string
  #interceptors: InterceptArgs[] = []

  constructor(name: string) {
    this.#name = name
  }

  intercept(interceptor: InterceptArgs): void {
    this.#interceptors.push(interceptor)
  }

  findPending(...args: any): InterceptArgs | undefined {
    const foundIndex = this.#interceptors.findLastIndex(inter => inter.matchingFn(...args))

    if (foundIndex > -1) {
      const interceptor = this.#interceptors[foundIndex]
      this.#interceptors.splice(foundIndex, 1)
      return interceptor
    }
  }

  assertNoPendingInterceptors(): void {
    const numInterceptors = this.#interceptors.length
    if (numInterceptors > 0) {
      throw new Error(`${numInterceptors} ${this.#name} interceptor${numInterceptors === 1 ? ' is' : 's are'} pending.`)
    }
  }

  clearPendingInterceptors(): void {
    this.#interceptors = []
  }
}