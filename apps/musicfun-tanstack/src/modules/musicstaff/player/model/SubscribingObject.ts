export type SubscriberType = (data?: any) => void

export class SubscribingObject<T extends string> {
  //subscribers: any = {}
  subscribers: { [key in T]?: Array<SubscriberType> } = {}

  addSubscriber(eventName: T, subscriber: SubscriberType): () => void {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = []
    }

    this.subscribers[eventName]?.push(subscriber)

    return () => {
      this.unsubscribe(eventName, subscriber)
    }
  }

  removeSubscriber(eventName: T, subscriber: SubscriberType): void {
    if (this.subscribers[eventName]) {
      this.unsubscribe(eventName, subscriber)
    }
  }

  private unsubscribe(eventName: T, subscriber: SubscriberType) {
    this.subscribers[eventName] = this.subscribers[eventName]?.filter((s: SubscriberType) => s !== subscriber)
  }

  triggerEvent(eventName: T, data?: object | null) {
    const subscribers = this.subscribers[eventName]
    if (!subscribers) return
    subscribers.forEach((s: SubscriberType) => s(data))
  }
}
