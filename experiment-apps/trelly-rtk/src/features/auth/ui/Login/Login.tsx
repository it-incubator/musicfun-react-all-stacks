import { zodResolver } from "@hookform/resolvers/zod"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router"

import { Logo } from "@/common/components"
import { Path } from "@/common/routing"
import { getErrorMessage } from "@/common/utils"

import { useLoginMutation, useSimpleLoginMutation } from "../../api/authApi.ts"
import { type LoginInputs, loginSchema } from "../../lib/loginSchema.ts"
import { buildOAuthLoginArgs, getOAuthStartUrl, OAUTH_MESSAGE_TYPE, oauthSession } from "../../lib/oauth.ts"

const FEATURES = [
  "Up to 10 boards with custom covers",
  "Drag & drop tasks between statuses",
  "Priorities, deadlines and attachments",
]

const toErrorText = (error: unknown) =>
  (error as FetchBaseQueryError).status === 401
    ? "Invalid login or password"
    : getErrorMessage(error as FetchBaseQueryError)

export const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirect") || Path.MyBoards

  const [simpleLogin, { isLoading: isSimpleLoading }] = useSimpleLoginMutation()
  const [oauthLogin, { isLoading: isOAuthLoading }] = useLoginMutation()

  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "", rememberMe: true },
  })

  // The OAuth popup sends the code back via postMessage
  useEffect(() => {
    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== OAUTH_MESSAGE_TYPE) return
      const { code } = event.data as { code?: string }
      if (!code) return

      try {
        await oauthLogin(buildOAuthLoginArgs(code, getValues("rememberMe"))).unwrap()
        navigate(redirectTo, { replace: true })
      } catch (e) {
        setError(toErrorText(e))
      }
    }

    window.addEventListener("message", receiveMessage)
    return () => window.removeEventListener("message", receiveMessage)
  }, [oauthLogin, navigate, redirectTo, getValues])

  const onSubmit = async (values: LoginInputs) => {
    setError(null)
    try {
      await simpleLogin(values).unwrap()
      navigate(redirectTo, { replace: true })
    } catch (e) {
      setError(toErrorText(e))
    }
  }

  const loginWithApiHub = () => {
    setError(null)
    oauthSession.save(getValues("rememberMe"))
    const popup = window.open(getOAuthStartUrl(), "trellyOAuth", "width=500,height=650")
    // popup blocked → go through the flow in the current tab
    if (!popup) window.location.href = getOAuthStartUrl()
  }

  return (
    <Box sx={{ minHeight: "calc(100vh - 61px)", display: "grid", gridTemplateColumns: { md: "1fr 1fr" } }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          p: 8,
          color: "#fff",
          background:
            "radial-gradient(circle at 20% 20%, #818CF8 0%, transparent 50%), linear-gradient(135deg, #4338CA 0%, #7C3AED 100%)",
        }}
      >
        <Typography variant="h3" sx={{ mb: 2, maxWidth: 460 }}>
          Organize anything, together.
        </Typography>
        <Typography sx={{ opacity: 0.85, mb: 4, maxWidth: 440, fontSize: 18 }}>
          Trelly keeps your boards, tasks and files in one calm place.
        </Typography>
        <Stack spacing={1.5}>
          {FEATURES.map((feature) => (
            <Stack key={feature} direction="row" spacing={1.5} alignItems="center">
              <CheckCircleOutlineIcon fontSize="small" />
              <Typography>{feature}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, sm: 4 } }}>
        <Paper variant="outlined" sx={{ width: "100%", maxWidth: 420, p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Logo size="large" />
          </Box>
          <Typography variant="h5" gutterBottom>
            Welcome back
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in to manage your boards
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} role="alert">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Login"
                autoComplete="username"
                autoFocus
                fullWidth
                error={!!errors.login}
                helperText={errors.login?.message}
                {...register("login")}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                    label="Remember me"
                  />
                )}
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={isSimpleLoading}>
                {isSimpleLoading ? "Signing in…" : "Sign in"}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3, color: "text.secondary", fontSize: 13 }}>or</Divider>

          <Button variant="outlined" size="large" fullWidth onClick={loginWithApiHub} disabled={isOAuthLoading}>
            {isOAuthLoading ? "Signing in…" : "Continue with API Hub"}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
            Just looking around?{" "}
            <Box component={Link} to={Path.Main} sx={{ color: "primary.main", fontWeight: 600 }}>
              Explore public boards
            </Box>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}
