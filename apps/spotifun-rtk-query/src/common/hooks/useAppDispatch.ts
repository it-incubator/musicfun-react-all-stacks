import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/app/model/store.ts"

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
