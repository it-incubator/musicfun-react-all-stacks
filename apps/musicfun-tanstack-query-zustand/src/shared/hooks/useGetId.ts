import { useId } from 'react'

/*
 * Custom hook to get an ID.
 * If an ID is passed from component props, it returns that ID.
 * Otherwise, it generates and returns a new unique ID.
 *
 * @param {string} [idFromComponentProps] - An optional ID passed from ComponentProps.
 * @returns {string} The ID from component props or a generated unique ID.
 */
export const useGetId = (idFromComponentProps?: string) => {
  const generatedId = useId()

  return idFromComponentProps || generatedId
}
