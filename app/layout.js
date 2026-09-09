export const metadata = { title: '1·3·1', description: 'Three Models. One Output. No Overthinking.' }
export default function RootLayout({ children }) {
 return (
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    </head>
    <body>{children}</body>
  </html>
)
