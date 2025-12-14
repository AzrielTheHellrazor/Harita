// Console hatalarını suppress et (development için)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    // Coinbase Analytics ve ad blocker hatalarını ignore et
    const message = args[0]?.toString() || "";
    if (
      message.includes("Analytics SDK") ||
      message.includes("Failed to fetch") ||
      message.includes("ERR_BLOCKED_BY_CLIENT") ||
      message.includes("cca-lite.coinbase.com")
    ) {
      return; // Bu hataları gösterme
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    // Coinbase Analytics uyarılarını ignore et
    const message = args[0]?.toString() || "";
    if (
      message.includes("Analytics SDK") ||
      message.includes("cca-lite.coinbase.com")
    ) {
      return; // Bu uyarıları gösterme
    }
    originalWarn.apply(console, args);
  };
}


