
export const ApiToken = () => {
  const cookies = document.cookie.split(/[;]/gm).filter(Boolean).reduce((a,b) => {const [k, v] = b.split('='); a[String(k).trim()] = String(v).trim(); return a;} ,{} as {[key: string]: string})
  return cookies.access_token
} 