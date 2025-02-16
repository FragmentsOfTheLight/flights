import { Mutator } from '@flights/core/contracts'

export class NumberDigitUniversalMutator implements Mutator {
  digitDic = {
    '۰': 0,
    '۱': 1,
    '۲': 2,
    '۳': 3,
    '۴': 4,
    '۵': 5,
    '۶': 6,
    '۷': 7,
    '۸': 8,
    '۹': 9,
  }
  mutate(digit: any): any {
    let result = ''
    if (digit !== null && digit !== undefined && digit.length != 0) {
      digit = digit + ''
      let list = (digit + '').split('')
      for (var i = 0; i < list.length; i++) {
        // @ts-ignore
        if (this.digitDic[list[i]] != undefined) {
          // @ts-ignore
          result += this.digitDic[list[i]]
        } else if (list[i] == '.') {
          result += list[i]
        }
      }
    }
    return parseInt(result)
  }
}

export class NumberDigitPersianMutator implements Mutator {
  digitDic = {
    0: '۰',
    1: '۱',
    2: '۲',
    3: '۳',
    4: '۴',
    5: '۵',
    6: '۶',
    7: '۷',
    8: '۸',
    9: '۹',
    ':': ':',
    '-': '/',
  }
  mutate(digit: any): any {
    let result = ''
    if (digit !== null && digit !== undefined) {
      digit = digit + ''
      if (digit.length !== 0 && digit !== '') {
        let list = (digit + '').split('')
        for (var i = 0; i < list.length; i++) {
          // @ts-ignore
          if (this.digitDic[list[i]] === undefined) {
            result += list[i]
          } else {
            // @ts-ignore
            result += this.digitDic[list[i]]
          }
        }
      }
    }
    return result
  }
}

export class NumberNoFloatingPointMutator implements Mutator {
  mutate(digit: any): any {
    let result = digit
    if (digit.includes('.')) {
      result = digit.split('.')[0]
    }
    return result
  }
}
