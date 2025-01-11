export class ItemRules {
  validateRequired(val: string): boolean | string {
    if (!val) return 'Field is required'

    return true
  }

  validateStockCode(val: string): boolean | string {
    if (!val) return 'Field is required'

    if (isNaN(Number(val)) && Number(val) < 0) {
      return 'Stock Code must be a positive number'
    }

    return true
  }
}
