import { Shield, AlertTriangle, Scale, FileText, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { useTheme } from "../context/ThemeContext"

const sections = [
  {
    id: "disclaimer",
    icon: AlertTriangle,
    title: "Legal Disclaimer",
    content: [
      {
        heading: "General Information",
        text: 'StreamHub ("the Application") is an open-source IPTV dashboard provided free of charge for informational and personal entertainment purposes. The Application is provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
      },
      {
        heading: "No Guarantee of Accuracy",
        text: "The information, including but not limited to channel listings, stream URLs, sports schedules, match data, and third-party content presented through StreamHub, is sourced from publicly available APIs and community-maintained repositories. While we strive to keep information current and accurate, we make no representation or warranty of any kind about the completeness, accuracy, reliability, suitability, or availability of the Application or the information, products, services, or related graphics contained on the Application for any purpose.",
      },
      {
        heading: "Third-Party Content",
        text: "StreamHub aggregates and displays content from third-party sources, including but not limited to iptv-org/iptv (community IPTV playlists) and SportSRC API (sports match data and stream embeds). StreamHub does not own, control, host, generate, or distribute any of the streamed content. All stream URLs and embedded players are sourced directly from these third-party services. The availability, quality, legality, and copyright status of any stream may vary by jurisdiction and is the sole responsibility of the originating source.",
      },
      {
        heading: "No Endorsement",
        text: "The inclusion of any third-party content, stream sources, channel listings, or links within StreamHub does not imply endorsement, recommendation, or affiliation by or with the respective content owners, broadcasters, or rights holders. StreamHub is an aggregator and viewer tool only.",
      },
      {
        heading: "Professional Advice",
        text: "The Application does not constitute legal, financial, professional, or any other type of advice. You should not rely on any information obtained through StreamHub as a substitute for professional advice. Always consult with qualified professionals for decisions related to your specific circumstances.",
      },
    ],
  },
  {
    id: "terms",
    icon: Scale,
    title: "Terms and Conditions",
    content: [
      {
        heading: "Acceptance of Terms",
        text: 'By accessing or using StreamHub, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of the Application immediately.',
      },
      {
        heading: "Eligibility",
        text: "You must be at least 18 years of age, or the age of majority in your jurisdiction, to use StreamHub. By using the Application, you represent and warrant that you meet the minimum age requirement and have the legal capacity to enter into these Terms.",
      },
      {
        heading: "License to Use",
        text: 'StreamHub is released under the MIT License. Subject to the terms of the MIT License, you are granted a limited, non-exclusive, non-transferable, revocable license to use the Application for personal, non-commercial purposes. You may not modify, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, or sell any information, software, products, or services obtained from the Application without prior written consent.',
      },
      {
        heading: "Prohibited Conduct",
        text: "When using StreamHub, you agree not to: (a) use the Application for any unlawful purpose or in violation of any applicable local, state, national, or international law; (b) attempt to gain unauthorized access to any portion of the Application, other user accounts, or any systems or networks connected to the Application; (c) use automated systems, bots, scrapers, or similar tools to access or interact with the Application; (d) interfere with or disrupt the Application, servers, or networks; (e) reverse engineer, decompile, or disassemble any aspect of the Application; (f) use the Application to redistribute, re-broadcast, or commercially exploit any third-party content accessed through the Application; (g) remove, alter, or obscure any copyright, trademark, or other proprietary rights notices.",
      },
      {
        heading: "User Responsibilities",
        text: "You are solely responsible for your use of StreamHub and any consequences arising from such use. You acknowledge that stream availability, quality, and content are determined by third-party sources and may change without notice. It is your responsibility to ensure that your use of the Application complies with all applicable laws and regulations in your jurisdiction.",
      },
      {
        heading: "Intellectual Property",
        text: "StreamHub and its original content, features, functionality, design, and code are owned by the StreamHub developers and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. The MIT License governs the use of the Application's source code.",
      },
      {
        heading: "Modifications and Termination",
        text: "We reserve the right to modify, suspend, or discontinue StreamHub (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Application. We may also revise these Terms at any time by updating this page. Continued use of the Application after any changes constitutes acceptance of the revised Terms.",
      },
    ],
  },
  {
    id: "liability",
    icon: Shield,
    title: "Limitation of Liability",
    content: [
      {
        heading: "Disclaimer of Warranties",
        text: 'To the maximum extent permitted by applicable law, StreamHub is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, implied, statutory, or otherwise, including without limitation warranties of title, merchantability, fitness for a particular purpose, non-infringement, and any warranties arising from course of performance, course of dealing, or usage of trade. We do not warrant that the Application will be uninterrupted, timely, secure, error-free, or free of viruses or other harmful components.',
      },
      {
        heading: "Limitation of Damages",
        text: "In no event shall StreamHub, its developers, contributors, affiliates, or any third-party service providers be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to damages for loss of profits, goodwill, data, or other intangible losses, arising out of or relating to: (a) your use of or inability to use the Application; (b) any content obtained from the Application; (c) unauthorized access to or alteration of your data or transmissions; or (d) any conduct of any third party on or related to the Application, even if advised of the possibility of such damages.",
      },
      {
        heading: "Total Liability Cap",
        text: "To the fullest extent permitted by applicable law, in no event shall the aggregate liability of StreamHub exceed the amount you paid, if any, to StreamHub during the twelve (12) months preceding the claim. Since StreamHub is provided free of charge, this liability cap is zero dollars ($0.00 USD).",
      },
      {
        heading: "Jurisdictional Limitations",
        text: "Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for certain types of damages. Therefore, some of the above limitations may not apply to you. In such jurisdictions, our liability is limited to the maximum extent permitted by applicable law.",
      },
    ],
  },
  {
    id: "copyright",
    icon: FileText,
    title: "Copyright & DMCA",
    content: [
      {
        heading: "Copyright Policy",
        text: "StreamHub respects the intellectual property rights of others and expects users of the Application to do the same. StreamHub does not host, store, or distribute any copyrighted media content. All streams and embedded content are served directly from third-party sources. StreamHub acts solely as a viewer interface to publicly accessible streams.",
      },
      {
        heading: "DMCA Compliance",
        text: "If you believe that content accessible through StreamHub infringes your copyright, please contact the original content host or the third-party service providing the stream directly. StreamHub does not have the ability to remove or modify third-party content. For DMCA-related inquiries, you should contact the respective IPTV providers, hosting services, or the relevant rights holders.",
      },
      {
        heading: "Content Sources",
        text: "The IPTV catalog data is sourced from iptv-org/iptv, a community-maintained repository licensed under MIT. Sports match data and stream embeds are provided by the SportSRC API. StreamHub does not claim ownership of any third-party content displayed within the Application.",
      },
      {
        heading: "Counter-Notification",
        text: "If you are a content owner and believe a stream listed in StreamHub should be removed, please contact the hosting provider of that stream directly, as StreamHub does not control or host any streaming content.",
      },
    ],
  },
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy Policy",
    content: [
      {
        heading: "Data Collection",
        text: "StreamHub is designed with privacy in mind. The Application does not collect, store, or transmit any personal data. No user accounts, registration, login, or personally identifiable information (PII) is required or collected. StreamHub does not use cookies, tracking pixels, analytics services, or any third-party tracking technologies.",
      },
      {
        heading: "Local Storage",
        text: "The Application stores a single preference locally on your device: your theme selection (dark or light mode). This data is stored exclusively in your browser's localStorage and is never transmitted to any server. It can be cleared at any time through your browser settings.",
      },
      {
        heading: "Third-Party Requests",
        text: "When you use StreamHub, your browser may make direct requests to third-party APIs (iptv-org, SportSRC, stream CDN servers) to fetch channel lists, match data, and stream content. These requests are made directly from your browser and are not routed through or logged by StreamHub. Third-party services may collect standard HTTP request data (IP address, user agent, referrer) in accordance with their own privacy policies.",
      },
      {
        heading: "Children's Privacy",
        text: "StreamHub does not knowingly collect any personal information from children under the age of 13. If you are a parent or guardian and believe your child has provided personal information through the Application, please contact us immediately so that we can take appropriate action.",
      },
      {
        heading: "Changes to This Policy",
        text: "We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated effective date. Your continued use of StreamHub after any changes constitutes acceptance of the revised policy.",
      },
    ],
  },
  {
    id: "external",
    icon: ExternalLink,
    title: "External Links & Services",
    content: [
      {
        heading: "Third-Party Links",
        text: "StreamHub may contain links to third-party websites, APIs, or services that are not owned or controlled by StreamHub. These include, but are not limited to: iptv-org/iptv, SportSRC API, embed.st, and various CDN/streaming servers. StreamHub has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
      },
      {
        heading: "No Responsibility",
        text: "We strongly advise you to read the terms and conditions and privacy policies of any third-party website or service that you visit or interact with through StreamHub. StreamHub shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any third-party content, goods, or services available on or through any third-party site or service.",
      },
      {
        heading: "Embed Player Disclaimer",
        text: "Sports streams are displayed via embedded iframe players provided by embed.st. The quality, availability, and legality of these streams are determined by the embedding service and the originating sources. StreamHub does not control the content of embedded players.",
      },
    ],
  },
  {
    id: "governing",
    icon: Scale,
    title: "Governing Law & Disputes",
    content: [
      {
        heading: "Governing Law",
        text: "These Terms and Conditions shall be governed by and construed in accordance with applicable international laws, without regard to conflict of law principles. Any disputes arising out of or relating to these Terms or the use of StreamHub shall be resolved in the appropriate courts of the relevant jurisdiction.",
      },
      {
        heading: "Severability",
        text: "If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect. The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent.",
      },
      {
        heading: "Entire Agreement",
        text: "These Terms and Conditions, together with the Privacy Policy and any other legal notices or policies published by StreamHub, constitute the entire agreement between you and StreamHub regarding the use of the Application and supersede all prior agreements and understandings, whether written or oral.",
      },
      {
        heading: "Waiver",
        text: "The failure of StreamHub to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by StreamHub.",
      },
      {
        heading: "Contact",
        text: "If you have any questions about these Terms and Conditions, the Legal Disclaimer, or the Privacy Policy, please open an issue on the StreamHub GitHub repository or contact the development team through the project's official channels.",
      },
    ],
  },
]

function AccordionSection({
  section,
  isDark,
  defaultOpen = false,
}: {
  section: (typeof sections)[0]
  isDark: boolean
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const Icon = section.icon

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDark ? "bg-dark-300/30 border-white/[0.06]" : "bg-white border-slate-200"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left transition-colors ${
          isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isDark ? "bg-white/5" : "bg-slate-100"
          }`}
        >
          <Icon className={`w-4 h-4 ${isDark ? "text-accent-light" : "text-accent"}`} />
        </div>
        <h2
          className={`flex-1 text-base sm:text-lg font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {section.title}
        </h2>
        {isOpen ? (
          <ChevronUp className={`w-5 h-5 shrink-0 ${isDark ? "text-dark-100" : "text-slate-400"}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 shrink-0 ${isDark ? "text-dark-100" : "text-slate-400"}`} />
        )}
      </button>

      {isOpen && (
        <div className={`px-4 sm:px-5 pb-5 space-y-5 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
          {section.content.map((item, idx) => (
            <div key={idx} className="pt-4">
              <h3
                className={`text-sm font-semibold mb-2 ${
                  isDark ? "text-dark-100" : "text-slate-600"
                }`}
              >
                {item.heading}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-dark-100/80" : "text-slate-500"
                }`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LegalDisclaimer() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const mutedText = isDark ? "text-dark-100" : "text-slate-500"
  const strongText = isDark ? "text-white" : "text-slate-900"

  return (
    <div className="flex flex-col gap-5 sm:gap-6 xl:h-full">
      {/* Header */}
      <section
        className={`rounded-2xl border p-4 sm:p-5 ${
          isDark ? "bg-dark-300/30 border-white/[0.06]" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className={`text-2xl sm:text-3xl font-extrabold ${strongText}`}>
              Legal & Terms
            </h1>
            <p className={`mt-1 max-w-2xl text-sm sm:text-base ${mutedText}`}>
              Legal disclaimer, terms and conditions, privacy policy, and liability
              information for StreamHub.
            </p>
            <p className={`mt-2 text-xs ${mutedText}`}>
              Effective Date: June 15, 2026 &nbsp;|&nbsp; Last Updated: June 15, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section
        className={`rounded-2xl border p-4 sm:p-5 ${
          isDark ? "bg-dark-300/30 border-white/[0.06]" : "bg-white border-slate-200"
        }`}
      >
        <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${mutedText}`}>
          Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Open Source", desc: "MIT Licensed", color: "text-sport-green" },
            { label: "No Data Collection", desc: "Privacy-first design", color: "text-accent-light" },
            { label: "Third-Party Content", desc: "Not hosted by StreamHub", color: "text-sport-yellow" },
            { label: "No Warranty", desc: 'Provided "as is"', color: "text-sport-red" },
            { label: "Free to Use", desc: "No charges or fees", color: "text-sport-green" },
            { label: "Your Responsibility", desc: "Comply with local laws", color: "text-accent-light" },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl px-3 py-2.5 ${
                isDark ? "bg-white/5" : "bg-slate-50"
              }`}
            >
              <p className={`text-sm font-bold ${item.color}`}>{item.label}</p>
              <p className={`text-xs mt-0.5 ${mutedText}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="space-y-3">
        {sections.map((section, idx) => (
          <AccordionSection
            key={section.id}
            section={section}
            isDark={isDark}
            defaultOpen={idx === 0}
          />
        ))}
      </section>

      {/* Footer */}
      <section
        className={`rounded-2xl border p-4 sm:p-5 ${
          isDark ? "bg-dark-300/30 border-white/[0.06]" : "bg-white border-slate-200"
        }`}
      >
        <p className={`text-xs leading-relaxed ${mutedText}`}>
          By using StreamHub, you confirm that you have read, understood, and agree to be bound
          by these Legal Disclaimers and Terms and Conditions. If you do not agree, you must not
          use the Application. This document was last updated on June 15, 2026. StreamHub reserves
          the right to update these terms at any time without prior notice. The current version of
          these terms will always be available within the Application.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${
              isDark ? "bg-white/5 text-dark-100" : "bg-slate-100 text-slate-500"
            }`}
          >
            MIT License
          </span>
          <span
            className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${
              isDark ? "bg-white/5 text-dark-100" : "bg-slate-100 text-slate-500"
            }`}
          >
            Open Source
          </span>
          <span
            className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${
              isDark ? "bg-white/5 text-dark-100" : "bg-slate-100 text-slate-500"
            }`}
          >
            No Data Collection
          </span>
        </div>
      </section>
    </div>
  )
}
