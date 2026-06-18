import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const futureProducts = ['Blackbox', 'Lockbox'];

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
  href?: string;
  status: string;
}) {
  const content = (
    <article className={clsx(styles.productCard, !href && styles.productCardMuted)}>
      <span className={styles.productStatus}>{status}</span>
      <Heading as="h2" className={styles.cardTitle}>
        {name}
        <span>.</span>
      </Heading>
      <p>{description}</p>
      <span className={styles.cardAction}>{label}</span>
    </article>
  );

  if (!href) {
    return (
      <article className={clsx(styles.productCard, styles.productCardMuted)}>
        <span className={styles.productStatus}>{status}</span>
        <Heading as="h2" className={styles.cardTitle}>
          {name}
        </Heading>
        <p>{description}</p>
        <span className={styles.cardAction}>{label}</span>
      </article>
    );
  }

  return (
    <Link className={styles.cardLink} to={href}>
      {content}
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
                Run confidential compute that people can actually reach.
                Deploy a service into a TEE on a real Acurast phone with{' '}
                <strong>Liskov</strong>, and give it a stable public HTTPS
                route with <strong>Baran</strong>.
              </p>
              <div className={styles.headerActions}>
                <Link className="button button--primary" to="/liskov">
                  Open Liskov docs
                </Link>
                <Link className="button button--secondary" to="/baran">
                  Open Baran docs
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.contentBand} aria-labelledby="products-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>Available now</span>
              <Heading as="h2" id="products-heading">
                Two products, one confidential-compute stack.
              </Heading>
              <p>
                Liskov deploys and keeps your service running. Baran puts a
                public HTTPS front door on it. Use either on its own, or both
                together.
              </p>
            </div>
            <div className={styles.productGrid}>
              <ProductCard
                name="Liskov"
                status="Early access"
                label="Read the docs"
                href="/liskov"
                description="Deploy a long-running Node.js service into a TEE on a real Acurast phone from one policy in your repo — with sealed secrets, encrypted logs, schedules, and USDC budgets."
              />
              <ProductCard
                name="Baran"
                status="Available now"
                label="Read the docs"
                href="/baran"
                description="Put a long-running Acurast Node.js service behind a stable HTTPS endpoint with job-owned TLS, route validation, and CLI diagnostics."
              />
            </div>
          </div>
        </section>

        <section className={styles.contentBand} aria-labelledby="next-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>What comes next</span>
              <Heading as="h2" id="next-heading">
                More of the PROOF stack is on the way.
              </Heading>
              <p>
                Sealed-secret delivery and encrypted logging already ship
                inside Liskov. Their standalone products are still being built.
              </p>
            </div>
            <div className={styles.productGrid}>
              {futureProducts.map((name) => (
                <ProductCard
                  key={name}
                  name={name}
                  status="In development"
                  label="Not public yet"
                  description="We're still building this."
                />
              ))}
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
              <Link to="/liskov/quickstart">Quickstart</Link>
              <Link to="/liskov/concepts">Concepts</Link>
              <Link to="/liskov/guides">Guides</Link>
              <Link to="/liskov/reference">Reference</Link>
              <Link to="/liskov/troubleshooting">Troubleshooting</Link>
            </div>
          </div>
        </section>

        <section className={styles.docsBand} aria-labelledby="baran-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>Baran docs</span>
              <Heading as="h2" id="baran-heading">
                Give your Acurast job a public HTTPS route.
              </Heading>
            </div>
            <div className={styles.docsGrid}>
              <Link to="/baran/quickstart">Quickstart</Link>
              <Link to="/baran/guides">Guides</Link>
              <Link to="/baran/concepts">Concepts</Link>
              <Link to="/baran/sdk-adapters">SDK and adapters</Link>
              <Link to="/baran/operator-preview">Gateway preview</Link>
              <Link to="/baran/reference">Reference</Link>
              <Link to="/baran/troubleshooting">Troubleshooting</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
