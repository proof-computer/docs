import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function ProductCard({
  name,
  label,
  description,
  href,
  status,
}: {
  name: string;
  label: string;
  description: string;
  href: string;
  status: string;
}) {
  return (
    <Link className={styles.cardLink} to={href}>
      <article className={styles.productCard}>
        <span className={styles.productStatus}>{status}</span>
        <Heading as="h2" className={styles.cardTitle}>
          {name}
          <span>.</span>
        </Heading>
        <p>{description}</p>
        <span className={styles.cardAction}>{label}</span>
      </article>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout
      title="PROOF Docs"
      description="PROOF documentation for running services on confidential compute">
      <main className={styles.page}>
        <section className={styles.heroBand}>
          <svg className={styles.heroCable} viewBox="0 0 720 480" aria-hidden="true">
            <path
              d="M60 380 Q360 -120 660 380"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="36"
              fill="none"
            />
            <circle cx="60" cy="380" r="56" fill="currentColor" />
            <circle cx="660" cy="380" r="56" fill="currentColor" />
          </svg>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>PROOF documentation</span>
              <Heading as="h1" className={styles.title}>
                PROOF<span>.</span>
              </Heading>
              <p className={styles.subtitle}>
                Deploy and operate services in trusted hardware on real
                Acurast phones with <strong>Liskov</strong> — managed releases,
                secrets, logs, lifecycle, and proof in one place.
              </p>
              <div className={styles.headerActions}>
                <Link className="button button--primary" to="/liskov">
                  Open Liskov docs
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.contentBand} aria-labelledby="products-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>Product documentation</span>
              <Heading as="h2" id="products-heading">
                Deploy like it's a cloud. Prove it isn't.
              </Heading>
              <p>
                Liskov turns an authored application into bounded deployments
                on attested Acurast compute and keeps the evidence visible.
              </p>
            </div>
            <div className={styles.productGrid}>
              <ProductCard
                name="Liskov"
                status="Version 1"
                label="Read the docs"
                href="/liskov"
                description="Deploy and operate a long-running Node.js service on decentralized Acurast compute — with managed secrets, private logs, schedules, placement controls, and bounded USD Service Credit spend."
              />
            </div>
          </div>
        </section>

        <section className={styles.docsBand} aria-labelledby="liskov-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>Liskov docs</span>
              <Heading as="h2" id="liskov-heading">
                Deploy like it's a cloud. Prove it isn't.
              </Heading>
            </div>
            <div className={styles.docsGrid}>
              <Link to="/liskov/get-started">Get started</Link>
              <Link to="/liskov/build">Build</Link>
              <Link to="/liskov/operate">Operate</Link>
              <Link to="/liskov/concepts">Concepts</Link>
              <Link to="/liskov/reference">Reference</Link>
              <Link to="/liskov/troubleshooting">Troubleshooting</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
