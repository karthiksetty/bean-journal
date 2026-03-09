export const metadata = {
  title: "Bean Journal",
  description: "A personal coffee bean database",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#FAF7F2" }}>
        {children}
      </body>
    </html>
  );
}
