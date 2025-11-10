import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard title="Web Applications">High-performance React and Next.js apps with server-side rendering and hybrid architectures.</ServiceCard>
        <ServiceCard title="API & Backend">REST/GraphQL APIs, authentication, database design, and cloud deployment.</ServiceCard>
        <ServiceCard title="DevOps & Scale">CI/CD, observability, scaling strategies and cost optimization for production systems.</ServiceCard>
      </section>
    </div>
  )
}
