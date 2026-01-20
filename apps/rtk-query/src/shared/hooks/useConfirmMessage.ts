import {useTranslation} from "react-i18next";
import type {EntityType} from "@/shared/components/Modal/ConfirmationDialog.tsx";

type GetConfirmMessageParams = {
  entityType: EntityType
  entityName: string
}

export const useConfirmMessage = () => {
  const {t} = useTranslation();

  const getConfirmMessage = ({entityName,entityType}:GetConfirmMessageParams) => {
    return t(`confirm.delete${entityType === 'playlist' ? 'Playlist' : 'Track'}`, {
      name: entityName
    })
  }

  return { getConfirmMessage }
}