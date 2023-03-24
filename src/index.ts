import { readFile } from './infra/fs'
import console from './infra/console'

export async function printFileContents(path: string) {
  const contents = await readFile(path, 'utf-8')
  console.log(contents)
}

export async function printHttpResponse() {
  const res = await fetch('https://catfact.ninja/fact')
  if (res.ok) {
    const data = await res.json();
    console.log(data.fact);
  }
}