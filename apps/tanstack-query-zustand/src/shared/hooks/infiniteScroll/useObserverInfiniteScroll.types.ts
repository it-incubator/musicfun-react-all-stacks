import * as React from 'react'

export interface IUseObserverInfiniteScroll extends Partial<IntersectionObserverInit> {
  targetRef: React.RefObject<HTMLDivElement | null>
  rootRef?: React.RefObject<HTMLDivElement | null>

  callBack(): void
}
