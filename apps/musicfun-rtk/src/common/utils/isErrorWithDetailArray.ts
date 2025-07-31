export function isErrorWithDetailArray(error: unknown): error is { errors: { detail: string }[] } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as any).errors) &&
    (error as any).errors.length > 0 &&
    typeof (error as any).errors[0].detail === 'string'
  )
}
