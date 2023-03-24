Infrastructure Interceptors
============================

An experimental approach to testing without mocks

Inspired by: 
 - James Shore's [Testing Without Mocks](http://www.jamesshore.com/v2/projects/nullables/testing-without-mocks) work
 - Undici's [Request Mocking](https://undici.nodejs.org/#/docs/best-practices/mocking-request)

## Preres

You need Node 18 for these examples (do `nvm use`).

## Run

`npm ci`
`npm test`

## What's happening

Read `src/index.test.ts` 

### Infrastructure Wrappers

`src/infra/` contains *infrastructure wrappers* for `console.log`, `fs.readFile` and `fetch`. 

Each wrapper follows a simiar pattern and implements the following:

- `addXXXInterceptor` – Take context specific arguments to match calls to the infra and provide a stubbed reply
- `disableXXX` – Disables the underlying infrastructure, so missed interceptors don't result in real infra being used
- `assertNoPendingXXXInterceptors` – Throws if a declared interceptor was missed.
- Finally, wrap/decorate the underlying infra api to defer the call to any pending interceptors

\* The `fetch` example just wraps the underlying Undici interceptor API for consistency.

### General Interceptor

`src/interceptor/general-interceptor.ts` simply generalizes common code used to implemment infrastrcuture interceptos in `console`, `readFile` etc.