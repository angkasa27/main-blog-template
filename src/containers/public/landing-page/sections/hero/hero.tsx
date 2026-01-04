export function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-16 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl md:text-6xl">
            Welcome to Our Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400 sm:text-xl">
            Discover insightful articles about web development, design, and technology.
            Stay updated with the latest trends and best practices.
          </p>
        </div>
      </div>
    </section>
  );
}
