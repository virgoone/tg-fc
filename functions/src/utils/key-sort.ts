export interface KeySortParams {
  [key: string]: string | number | boolean
}

export const keySort = (params: KeySortParams): KeySortParams => {
  return Object.keys(params)
    .sort()
    .reduce((accumulator, currentValue) => {
      // @ts-ignore
      accumulator[currentValue] = params[currentValue]
      return accumulator
    }, {})
}
