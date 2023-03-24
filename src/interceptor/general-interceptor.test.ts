import { describe, it, expect } from 'vitest'
import GeneralInterceptor  from './general-interceptor'

describe('A general Infrastructure Interceptor', () => {
  it('intercepts a matching infra call and removes the interceptor afterwards', () => {
    const inter = new GeneralInterceptor('test')

    inter.intercept({ 
      matchingFn: val => val === 'foo', 
      reply: 'hello world'
    })

    const found = inter.findPending('foo')
    expect(found).toBeDefined()
    if(found) {
      expect(found.reply).toBe('hello world')
    }

    inter.assertNoPendingInterceptors()
  })

  it('does not intercept a matching infra call and does not remove the interceptor afterwards', () => {
    const inter = new GeneralInterceptor('test')

    inter.intercept({ 
      matchingFn: val => val === 'foo', 
      reply: 'hello world'
    })

    const found = inter.findPending('bar')
    expect(found).toBeUndefined()

    expect(() => {
      inter.assertNoPendingInterceptors()
    }).toThrow()
  })

  it('intercepts the last added interceptor first if mutiple match', () => {
    const inter = new GeneralInterceptor('test')

    inter.intercept({ 
      matchingFn: val => val === 'foo', 
      reply: 'hello first'
    })
    inter.intercept({ 
      matchingFn: val => val === 'foo', 
      reply: 'hello last'
    })

    const found1 = inter.findPending('foo')
    expect(found1).toBeDefined()
    if(found1) {
      expect(found1.reply).toBe('hello last')
    }
   

    const found2 = inter.findPending('foo')
    expect(found2).toBeDefined()
    if(found2) {
      expect(found2.reply).toBe('hello first')
    }

    inter.assertNoPendingInterceptors()
  })
})