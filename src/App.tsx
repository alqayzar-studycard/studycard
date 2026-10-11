import { AppRoutes } from "@/routes"
import { StudyDataProvider } from "@/contexts/StudyDataContext"

function App() {
  return <StudyDataProvider><AppRoutes /></StudyDataProvider>
}

export default App
