export const metadata = {
  title: 'Blachere CRM',
  description: 'Blachere CRM by Jonathan Lauxen Romano',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div lang="en">
      <div>src/app/contacts/layout.tsx</div>
        {children}
    </div>
  )
}
