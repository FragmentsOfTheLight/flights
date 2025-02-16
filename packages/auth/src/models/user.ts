import { Role } from './role'

export class User {
  id: number
  name: string
  score: number
  balance: string
  roles?: Role[]

  constructor(
    id: number,
    name: string,
    roles?: { id: number; name: string }[],
    score = 0,
    balance = '0',
  ) {
    this.id = id
    this.name = name
    this.score = score
    this.balance = balance
    this.roles = []
    if (roles) {
      roles.forEach(role => {
        this.roles?.push(new Role(role.id, role.name))
      })
    }
  }
}
