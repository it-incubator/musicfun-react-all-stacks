import { selectError } from "@/app/model/appSlice"
import { useAppSelector } from "@/common/hooks"
import { useEffect } from "react"
import { toast, ToastContainer } from "react-toastify/unstyled"

export const ErrorToaster = () => {
  const selectedError = useAppSelector(selectError)

  useEffect(() => {
    if (selectedError) {
      toast.error(selectedError)
    }
  }, [selectedError])

  return <ToastContainer newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss pauseOnHover />
}
