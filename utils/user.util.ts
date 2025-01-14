export function getUserRole(val: string): string {
  switch (val) {
    case 'super_admin':
      return 'Super Admin'
    case 'admin':
      return 'Admin'
    case 'planner':
      return 'Planner'
    case 'inventory':
      return 'Inventory'
    case 'purchasing':
      return 'Purchasing'
    case 'warehouse':
      return 'Warehouse'
    default:
      return ''
  }
}

export class UserRules {
  validateRequired(val: string): boolean | string {
    if (!val) return 'Field is required'

    return true
  }

  validateEmail(val: string): boolean | string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!val) {
      return 'Email is required'
    } else if (!emailRegex.test(val)) {
      return 'Invalid email address'
    }

    return true
  }

  validatePassword(val: string): boolean | string {
    if (!val) {
      return 'Field is required'
    }

    if (val.length < 8) {
      return 'Password must be at least 8 characters long'
    }

    if (!/\d/.test(val)) {
      return 'Password must contain at least one numeric character'
    }

    return true
  }
}
