export class BookingRules {
  validateRequired(val: string): boolean | string {
    if (!val) return 'Field is required'

    return true
  }

  validateItems(val: number[]): boolean | string {
    if (!val || val.length === 0) return 'Field is required'

    return true
  }

  validatePoTotal(val: number, max: number): boolean | string {
    if (!val || val === 0) return 'Field is required'

    if (val > max) return "Total received items can't be more than total qty items"

    return true
  }
}
