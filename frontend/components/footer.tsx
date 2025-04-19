import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-medium">
          IBDB
        </Link>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} IBDB
        </p>
      </div>
    </footer>
  )
}
