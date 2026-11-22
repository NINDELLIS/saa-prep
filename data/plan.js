// 4-Wochen-Plan SAA-C03. Zieltermin wird in der App gesetzt (Default 19.12.2026).
window.PLAN = [
  { week: 1, title: "Fundament & Security (Domain 1, 30 %)", from: "2026-11-23", to: "2026-11-29", days: [
    { date: "2026-11-23", tasks: [
      ["p-00", "ADMIN: ESL +30 beantragen, Voucher holen, Skill Builder einschreiben (NICHT buchen)"],
      ["p-01", "Exam Guide SAA-C03 lesen (Domänen, Out-of-Scope-Liste)"],
      ["p-02", "Podcast Folge 01: Prüfungsstrategie & Well-Architected"],
      ["p-03", "Baseline: Official Practice Question Set (Skill Builder, 20 Fragen) – Ergebnis notieren"] ] },
    { date: "2026-11-24", tasks: [
      ["p-04", "Podcast Folge 02: IAM, Organizations, SCPs"],
      ["p-05", "App-Quiz Domain 1: 20 Fragen"],
      ["p-06", "Karteikarten: 20 neue"] ] },
    { date: "2026-11-25", tasks: [
      ["p-07", "Podcast Folge 03: VPC Deep Dive"],
      ["p-08", "Hands-on: VPC mit Public/Private Subnet + NAT + Gateway Endpoint (Console)"],
      ["p-09", "App-Quiz Domain 1: 20 Fragen"] ] },
    { date: "2026-11-26", tasks: [
      ["p-10", "Podcast Folge 04: KMS & Security-Services"],
      ["p-11", "App-Quiz Domain 1: Rest + alle Fehler wiederholen"],
      ["p-12", "Karteikarten: fällige + 20 neue"] ] },
    { date: "2026-11-28", tasks: [
      ["p-13", "Wochen-Review: Schwachstellen-Tab durcharbeiten"],
      ["p-14", "Mini-Prüfung 30 Fragen (gemischt), Ziel ≥ 65 %"] ] } ] },
  { week: 2, title: "Storage, Compute, Datenbanken (Domain 2 + 3)", from: "2026-11-30", to: "2026-12-06", days: [
    { date: "2026-11-30", tasks: [
      ["p-15", "Podcast Folge 05: S3 komplett"],
      ["p-16", "Hands-on: S3 Lifecycle + Replication + Bucket Policy"],
      ["p-17", "App-Quiz Thema S3 / Storage"] ] },
    { date: "2026-12-01", tasks: [
      ["p-18", "Podcast Folge 06: EC2, Kaufoptionen, ASG, ELB"],
      ["p-19", "App-Quiz Domain 2: 20 Fragen"] ] },
    { date: "2026-12-02", tasks: [
      ["p-20", "Podcast Folge 07: EBS, EFS, FSx, Hybrid-Storage"],
      ["p-21", "App-Quiz Domain 3: 20 Fragen"],
      ["p-22", "Karteikarten: fällige + 20 neue"] ] },
    { date: "2026-12-03", tasks: [
      ["p-23", "Podcast Folge 08: Datenbanken"],
      ["p-24", "App-Quiz Domain 2 + 3: je 15 Fragen"] ] },
    { date: "2026-12-05", tasks: [
      ["p-25", "Wochen-Review: Schwachstellen"],
      ["p-26", "Mini-Prüfung 40 Fragen, Ziel ≥ 70 %"],
      ["p-26b", "GO/NO-GO: ≥ 65 % → Prüfung 19.12. buchen (Voucher-Code, ESL +30 prüfen); < 65 % → 09.01. buchen"] ] } ] },
  { week: 3, title: "Serverless, Resilienz, Performance + 1. Vollprüfung", from: "2026-12-07", to: "2026-12-13", days: [
    { date: "2026-12-07", tasks: [
      ["p-27", "Podcast Folge 09: Entkopplung & Serverless"],
      ["p-28", "App-Quiz Domain 2: Rest"] ] },
    { date: "2026-12-08", tasks: [
      ["p-29", "Podcast Folge 10: Resilienz & DR (RPO/RTO)"],
      ["p-30", "Karteikarten: alle fälligen"] ] },
    { date: "2026-12-09", tasks: [
      ["p-31", "Podcast Folge 11: Performance & Analytics"],
      ["p-32", "App-Quiz Domain 3: Rest"] ] },
    { date: "2026-12-10", tasks: [
      ["p-33", "Official Practice Exam (Skill Builder) ODER App-Prüfungsmodus 65/130 min"],
      ["p-34", "Jede falsche Antwort nacharbeiten (Erklärung + Doku)"] ] },
    { date: "2026-12-12", tasks: [
      ["p-35", "App-Prüfungsmodus #1 (65 Fragen, 130 min), Ziel ≥ 72 %"],
      ["p-36", "Schwachstellen-Tab leer arbeiten"] ] } ] },
  { week: 4, title: "Kosten (Domain 4), Prüfungssimulation, Prüfung", from: "2026-12-14", to: "2026-12-19", days: [
    { date: "2026-12-14", tasks: [
      ["p-37", "Podcast Folge 12: Kosten + 25 Prüfungsfallen"],
      ["p-38", "App-Quiz Domain 4: komplett"] ] },
    { date: "2026-12-15", tasks: [
      ["p-39", "App-Prüfungsmodus #2, Ziel ≥ 78 %"],
      ["p-40", "Fehler nacharbeiten"] ] },
    { date: "2026-12-16", tasks: [
      ["p-41", "Karteikarten: alle fälligen + schwache Themen"],
      ["p-42", "Podcast Folgen 03 + 10 nochmal (unterwegs)"] ] },
    { date: "2026-12-17", tasks: [
      ["p-43", "App-Prüfungsmodus #3, Ziel ≥ 80 % → Go"],
      ["p-44", "Online-Proctoring-Systemcheck (Pearson OnVUE) bzw. Anfahrt Testcenter prüfen"] ] },
    { date: "2026-12-18", tasks: [
      ["p-45", "Nur leicht: Folge 12 hören, Karteikarten, früh schlafen"],
      ["p-46", "Ausweis bereitlegen, Raum/Schreibtisch leer (OnVUE)"] ] },
    { date: "2026-12-19", tasks: [
      ["p-47", "PRÜFUNG – 30 min vorher einchecken, Flag-&-Review-Strategie"] ] } ] }
];
window.RESOURCES = [
  ["Exam-Seite AWS", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"],
  ["Exam Guide SAA-C03 (PDF)", "https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf"],
  ["Skill Builder: Exam Prep Plan SAA-C03", "https://skillbuilder.aws/"],
  ["Pearson VUE – Termin buchen", "https://www.aws.training/Certification"],
  ["Well-Architected Framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"]
];
