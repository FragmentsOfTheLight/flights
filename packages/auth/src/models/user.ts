import { Permission } from './permission'
import { Role } from './role'

export class User {
  id: string
  name: string
  score: number
  balance: string
  roles?: Role[]
  permissions?: Permission[]

  constructor(
    id: string,
    name: string,
    roles?: { id: string; name: string }[],
    permissions?: { id: string; name: string }[],
    score = 0,
    balance = '0',
  ) {
    this.id = id
    this.name = name
    this.score = score
    this.balance = balance
    this.roles = []
    this.permissions = []
    if (roles) {
      roles.forEach(role => {
        this.roles?.push(new Role(role.id, role.name))
      })
    }
    if (permissions) {
      permissions.forEach(permission => {
        this.permissions?.push(new Permission(permission.id, permission.name))
      })
    }
  }
}
