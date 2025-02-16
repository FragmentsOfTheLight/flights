import { Mutator } from '@flights/core/contracts'

export class PriceFormatMutator implements Mutator {
  mutate(digit: any): any {
    digit = digit + ''
    let result = ''
    if (digit.length !== 0) {
      let chars = []
      digit = digit.replace(new RegExp(',', 'g'), '')
      if (digit.includes('.')) {
        let sp = digit.split('.')
        result = '.' + sp[1]
        chars = sp[0]
      } else {
        chars = digit.split('')
      }
      let counter = 0
      for (let i = chars.length - 1; i >= 0; i--) {
        if (counter % 3 == 0 && counter < chars.length && counter > 0) {
          result = ',' + result
        }
        counter++
        result = chars[i] + result
      }
    }
    return result
  }
}
