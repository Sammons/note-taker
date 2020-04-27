
const bouncers = {} as {[key: string]: NodeJS.Timeout}

type ExtractSingleArityFunctionParam<T> = T extends (arg: infer Arg) => any ? Arg : never

export const DebouncedEventHandler = <T extends Function>(key: string, fun: T) => {
  const contingentError = new Error(`Failed to run debounced method: ${key}`);
  let val = bouncers[key];
  if (val) {
    window.clearTimeout(val);
  }
  bouncers[key] = setTimeout(async() => {
    try {
      await fun(event)
    } catch (e) {
      console.log('unexpected asynchronous failure', e, contingentError)
    }
  }, 0)
}