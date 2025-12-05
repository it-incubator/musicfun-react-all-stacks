export interface IUseObserverInfiniteScroll extends Partial<IntersectionObserverInit> {
  targetElement: HTMLElement | null
  rootElement?: HTMLElement | null

  callBack?(entry: IntersectionObserverEntry): Promise<void> | void
}
