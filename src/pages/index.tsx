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
      <div>
        <span className={styles.productStatus}>{status}</span>
        <Heading as="h2" className={styles.cardTitle}>
          {name}
        </Heading>
      </div>
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
      description="Documentation for PROOF products, starting with Switchboard">
      <main>
        <section className={styles.headerBand}>
          <div className={styles.headerInner}>
            <div className={styles.headerCopy}>
              <span className={styles.eyebrow}>PROOF documentation</span>
              <Heading as="h1" className={styles.title}>
                Switchboard user documentation
              </Heading>
              <p className={styles.subtitle}>
                Public docs for production HTTPS ingress on supported
                long-running Acurast jobs.
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
            <img
              className={styles.routeImage}
              src="/img/switchboard-route.svg"
              alt="Switchboard route flow from public client through PROOF gateway to an Acurast job"
            />
          </div>
        </section>

        <section className={styles.contentBand} aria-labelledby="products-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <Heading as="h2" id="products-heading">
                Product areas
              </Heading>
              <p>
                Switchboard is live in the docs now. Future products stay off
                the main navigation until their public surfaces are ready.
              </p>
            </div>
            <div className={styles.productGrid}>
              <ProductCard
                name="Switchboard"
                status="Available now"
                label="Read the docs"
                href="/switchboard"
                description="HTTPS ingress, job-owned TLS, Hub quote funding, route validation, and CLI workflows for Acurast webserver jobs."
              />
              {futureProducts.map((name) => (
                <ProductCard
                  key={name}
                  name={name}
                  status="Reserved"
                  label="Docs coming later"
                  description="This product area is reserved for a future public documentation release."
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.contentBandAlt} aria-labelledby="switchboard-heading">
          <div className={styles.contentInner}>
            <div className={styles.sectionHeader}>
              <Heading as="h2" id="switchboard-heading">
                Switchboard docs map
              </Heading>
              <p>
                The first content pass is organized around the path a private
                beta developer or operator takes from install to diagnosis.
              </p>
            </div>
            <div className={styles.docsGrid}>
              <Link to="/switchboard/quickstart">Quickstart</Link>
              <Link to="/switchboard/guides">Guides</Link>
              <Link to="/switchboard/concepts">Concepts</Link>
              <Link to="/switchboard/sdk-adapters">SDK & Adapters</Link>
              <Link to="/switchboard/operator-preview">Operator Preview</Link>
              <Link to="/switchboard/reference">Reference</Link>
              <Link to="/switchboard/troubleshooting">Troubleshooting</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
