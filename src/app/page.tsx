import ActiveVisitorIndicator from './components/ActiveVisitorIndicator'
import TrackVisitorSection from './components/TrackVisitor'

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen text-center text-balance">
      <TrackVisitorSection />
      <ActiveVisitorIndicator />
    </main>
  )
}
