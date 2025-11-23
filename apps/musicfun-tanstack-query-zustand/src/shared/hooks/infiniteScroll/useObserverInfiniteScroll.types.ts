import * as React from 'react'

export interface IUseObserverInfiniteScroll<T extends HTMLElement = HTMLElement>
  extends Partial<IntersectionObserverInit> {
  triggerRef: React.RefObject<T | null>
  wrapperRef?: React.RefObject<T | null>

  callBack?(): Promise<void> | void
}
