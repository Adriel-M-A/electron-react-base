import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Outlet } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@ui/sheet'
import { Button } from '@ui/button'
import { Menu, NotebookPen } from 'lucide-react'

function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-full w-full overflow-hidden text-foreground">
      <Sidebar className="hidden lg:flex" collapsed={false} />
      <Sidebar className="hidden md:flex lg:hidden" collapsed />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-sidebar text-sidebar-foreground shrink-0">
          <div className="flex items-center gap-2 font-bold text-lg">
            <NotebookPen className="h-5 w-5" />
            <span>Control</span>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-70 border-r-0 [&>button]:hidden">
              <SheetTitle className="sr-only">Menú Principal</SheetTitle>

              <Sidebar
                className="w-full h-full border-none"
                collapsed={false}
                onMobileClick={() => setIsMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 overflow-hidden bg-background p-2 md:p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
