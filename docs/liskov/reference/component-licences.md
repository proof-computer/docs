---
title: Component licences
description: Which licence each component you run carries, what you may do under it, and what competing use means.
---

# Component licences

You may use, copy, modify, build, and redistribute the components on this page for any purpose, including inside your own products and Marketplace listings, except a Competing Use. This page names the licence for each component and the first version that carries it. The contracts for the Liskov service are separate, on the [legal documents](../legal/index.md) page.

## Which licence applies

| Component | Licence | First version under it |
| --- | --- | --- |
| Runtime helper, liskov-runtime-contact ([`liskov-runtime-cargo`](https://github.com/proof-computer/liskov-runtime-cargo/blob/main/LICENSE)) | [FSL-1.1-Apache-2.0](https://fsl.software) | [`v0.11.0`](https://github.com/proof-computer/liskov-runtime-cargo/releases/tag/v0.11.0). `v0.10.43` and earlier stay [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0). |
| Runtime images ([`liskov-runtime-images`](https://github.com/proof-computer/liskov-runtime-images/blob/main/LICENSE)) | [FSL-1.1-Apache-2.0](https://fsl.software) for repository-authored build code. Operating-system packages keep the upstream licence of each package. | The next promoted revision. |
| Runtime SDK, [`@proof-computer/liskov-runtime`](https://github.com/proof-computer/liskov-runtime-js/blob/main/LICENSE) | [FSL-1.1-Apache-2.0](https://fsl.software) | [`v0.3.34`](https://github.com/proof-computer/liskov-runtime-js/releases/tag/v0.3.34). `v0.3.33` and earlier were declared MIT. |
| Ingress adapter ([`liskov-baran-js`](https://github.com/proof-computer/liskov-baran-js)) | [FSL-1.1-Apache-2.0](https://fsl.software) | From the next release. That release publishes the repository `LICENSE` file. |
| proof CLI and plugins ([`proof-cli-liskov`](https://github.com/proof-computer/proof-cli-liskov/blob/main/LICENSE)) | [FSL-1.1-Apache-2.0](https://fsl.software) | From the next release. Each plugin repository publishes its `LICENSE` file with that release. |
| GitHub actions ([`liskov-github-actions`](https://github.com/proof-computer/liskov-github-actions/blob/main/LICENSE)) | [FSL-1.1-Apache-2.0](https://fsl.software) | [`v2.0.0`](https://github.com/proof-computer/liskov-github-actions/releases/tag/v2.0.0). |
| Self-custody signer ([`liskov-self-custody-signer`](https://github.com/proof-computer/liskov-self-custody-signer/blob/main/LICENSE)) | [FSL-1.1-Apache-2.0](https://fsl.software) | From the next release. `v0.2.0` and earlier stay [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0). |
| Secret broker ([`liskov-secret-broker-js`](https://github.com/proof-computer/liskov-secret-broker-js/blob/main/LICENSE)), agent skills ([`liskov-skills`](https://github.com/proof-computer/liskov-skills/blob/main/LICENSE)), and Marketplace reference offerings ([`liskov-marketplace-offerings`](https://github.com/proof-computer/liskov-marketplace-offerings/blob/main/LICENSE)) | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) | Unchanged. |

The runtime helper is the program inside your image that keeps contact with Liskov. It is separate from the runtime-contact status shown on a deployment.

`FSL-1.1-Apache-2.0` is the Functional Source License, Version 1.1, with Apache-2.0 as the future licence. The licensor is Moose Labs Ltd. Read the licence text at [fsl.software](https://fsl.software).

## What you may do

You may use, copy, modify, build, and redistribute a component for any purpose other than a Competing Use. That includes running it in your own products and Marketplace listings. Publishing a Marketplace item that bundles the runtime helper or the runtime SDK is permitted. It is not a Competing Use.

The licence defines Competing Use in these words:

> A Competing Use means making the Software available to others in a commercial product or service that:
>
> 1. substitutes for the Software;
>
> 2. substitutes for any other product or service we offer using the Software
>    that exists as of the date we make the Software available; or
>
> 3. offers the same or substantially similar functionality as the Software.

Each version becomes available under the Apache License, Version 2.0 two years after it is released. A version released before the move to FSL keeps the licence it shipped with. The two-year period is not shortened or extended.

The published wire contracts stay public. The licence covers the code, not the protocol.
