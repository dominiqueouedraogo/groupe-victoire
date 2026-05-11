import { Switch, Route, Router as WouterRouter } from "wouter"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/contexts/AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Landing from "@/pages/Landing"
import Login from "@/pages/auth/Login"
import CandidateSignup from "@/pages/auth/CandidateSignup"
import InstructorSignup from "@/pages/auth/InstructorSignup"
import CandidateDashboard from "@/pages/dashboard/CandidateDashboard"
import ResourceDetail from "@/pages/dashboard/ResourceDetail"
import InstructorDashboard from "@/pages/instructor/InstructorDashboard"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import PremiumPage from "@/pages/PremiumPage"
import NotFound from "@/pages/not-found"
import WhatsAppButton from "@/components/WhatsAppButton"

const queryClient = new QueryClient()

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup/candidate" component={CandidateSignup} />
      <Route path="/auth/signup/instructor" component={InstructorSignup} />
      <Route path="/dashboard" component={CandidateDashboard} />
      <Route path="/dashboard/resource/:id" component={ResourceDetail} />
      <Route path="/instructor" component={InstructorDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/premium" component={PremiumPage} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
              <WhatsAppButton />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
