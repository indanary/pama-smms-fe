export class AuthRules {
  validateEmail(val: string): boolean | string {
    if (!val) return 'Field is required'

    return true
  }

  validatePassword(val: string): boolean | string {
    if (!val) return 'Field is required'

    return true
  }
}
