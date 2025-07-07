import { PageTitle } from '@/common/components'
import { ProfileLibrary } from './ProfileLibrary/ProfileLibrary.tsx'
import { ProfileInfo } from './ProfileInfo/ProfileInfo.tsx'

export const ProfilePage = () => {
  return (
    <>
      <PageTitle>Профиль</PageTitle>
      <ProfileInfo />
      <ProfileLibrary />
    </>
  )
}
