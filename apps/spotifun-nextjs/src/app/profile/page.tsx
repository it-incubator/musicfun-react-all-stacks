import {authApi} from "@/shared/api/auth-api";
import {redirectAfterOauthUri} from "@/shared/api/base";
import {cookies} from "next/headers";

export default async function ProfilePage() {

    const meData = await authApi.getMe();

    return <div>login: {meData.login}, userId: {meData.userId}</div>
}
