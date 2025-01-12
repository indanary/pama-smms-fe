export class ItemRules {
  validateRequired(val: string): boolean | string {
    if (!val) return 'Field is required'

    return true
  }

  validateFileRequired(val: object | null): boolean | string {
    return val !== null || 'Field is required'
  }

  validateStockCode(val: string): boolean | string {
    if (!val) return 'Field is required'

    if (isNaN(Number(val))) {
      return 'Stock Code must be a positive number'
    }

    if (Number(val) < 1) {
      return 'Stock Code must be a positive number'
    }

    return true
  }

  validateQty(val: string): boolean | string {
    if (!val) return 'Field is required'

    if (isNaN(Number(val))) {
      return 'Qty must be a positive number'
    }

    if (Number(val) < 1) {
      return 'Qty must be a positive number'
    }

    return true
  }
}
