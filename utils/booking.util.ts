export class BookingRules {
  validateRequired(val: string): boolean | string {
    if (!val) return 'Field is required'

    return true
  }

  validateItems(val: number[]): boolean | string {
    if (!val || val.length === 0) return 'Field is required'

    return true
  }
}
