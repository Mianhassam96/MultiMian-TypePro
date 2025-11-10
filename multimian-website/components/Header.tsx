import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-semibold">MultiMian</Link>
        <nav className="space-x-4">
          <Link href="/about" className="text-sm">About</Link>
          <Link href="/services" className="text-sm">Services</Link>
          <Link href="/contact" className="text-sm">Contact</Link>
          <Link href="/ocr" className="text-sm">OCR</Link>
        </nav>
      </div>
    </header>
  )
}
