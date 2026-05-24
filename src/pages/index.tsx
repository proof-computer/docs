import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const futureProducts = ['Slipway', 'Blackbox', 'Lockbox'];

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
        {name === 'Switchboard' ? <span>.</span> : null}
      </Heading>
      <p>{description}</p>
      <span className={styles.cardAction}>{label}</span>
    </article>
  );

  if (!href) {
    return content;
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
                Run confidential compute services that people can actually
                reach. Start by putting your Acurast web job behind a stable
                HTTPS route with Switchboard.
              </p>
              <div className={styles.headerActions}>
                <Link className="button button--primary" to="/switchboard">
                  Open Switchboard docs
                </Link>
                <Link className="button button--secondary" to="/switchboard/quickstart">
                  Quickstart
                </Link>
              </div>
            </div>
            <div className={styles.switchboardLockup} aria-label="Switchboard, a PROOF project">
              <img
                className={styles.switchboardMark}
                src="/img/switchboard-mark.svg"
                alt=""
                aria-hidden="true"
              />
              <div>
                <span className={styles.switchboardWordmark}>
                  Switchboard<span>.</span>
                </span>
                <span className={styles.projectTag}>
                  <span aria-hidden="true" />
                  A PROOF project
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.routeBand} aria-labelledby="route-heading">
          <div className={styles.contentInner}>
            <div className={styles.routeLayout}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionKicker}>Available now</span>
                <Heading as="h2" id="route-heading">
                  Give your Acurast job a public HTTPS route.
                </Heading>
                <p>
                  Install the CLI, launch the Express demo, deploy a supported
                  Node.js service, attach a hostname, and diagnose the route
                  from your terminal.
                </p>
              </div>
              <img
                className={styles.routeImage}
                src="/img/switchboard-route.svg"
                alt="Switchboard route flow from public client through PROOF gateway to an Acurast job"
              />
            </div>
          </div>
        </section>

        <section className={styles.contentBand} aria-labelledby="products-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>What comes next</span>
              <Heading as="h2" id="products-heading">
                Secure ingress today. More tools next.
              </Heading>
              <p>
                Use Switchboard now for secure HTTP ingress. We're still
                building the rest of the PROOF stack.
              </p>
            </div>
            <div className={styles.productGrid}>
              <ProductCard
                name="Switchboard"
                status="Available now"
                label="Read the docs"
                href="/switchboard"
                description="Put a long-running Acurast Node.js service behind a stable HTTPS endpoint with job-owned TLS, route validation, and CLI diagnostics."
              />
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

        <section className={styles.docsBand} aria-labelledby="switchboard-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>Switchboard docs</span>
              <Heading as="h2" id="switchboard-heading">
                Pick the doc that matches your next step.
              </Heading>
            </div>
            <div className={styles.docsGrid}>
              <Link to="/switchboard/quickstart">Quickstart</Link>
              <Link to="/switchboard/guides">Guides</Link>
              <Link to="/switchboard/concepts">Concepts</Link>
              <Link to="/switchboard/sdk-adapters">SDK and adapters</Link>
              <Link to="/switchboard/operator-preview">Gateway preview</Link>
              <Link to="/switchboard/reference">Reference</Link>
              <Link to="/switchboard/troubleshooting">Troubleshooting</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
