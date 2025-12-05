export type Strict<T, U extends T> = U & Record<Exclude<keyof U, keyof T>, never>
