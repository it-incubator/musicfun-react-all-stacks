import * as React from 'react'

export interface IUseObserverInfiniteScroll extends Partial<IntersectionObserverInit> {
  targetElement: React.RefObject<Element | null>
  rootElement?: React.RefObject<Element | null>

  callBack?(): void
}
