function Footer() {
  return (
    <footer
      className="px-4 text-center flex justify-center items-center min-h-[10vh] py-4 bg-black text-white"
      data-landmark-index="3"
    >
      <p className="text-xs">
        Project made with 💙<span className="sr-only">a lot of love</span> by{' '}
        <a
          className="underline hover:opacity-70"
          href="https://www.manuelsanchezdev.com"
        >
          Manuel Sánchez
        </a>
        .{' '}
        <a
          className="underline hover:opacity-70"
          href="https://github.com/manuelsanchez2/next-edge-visitors-tracker"
        >
          Github Repo
        </a>
      </p>
    </footer>
  )
}
export default Footer
