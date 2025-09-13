import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "@/lib/TaskContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tasker - Task Management App",
  description: "A comprehensive task management application with timers, Kanban board, and AI enhancements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TaskProvider>
              {children}
            </TaskProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
