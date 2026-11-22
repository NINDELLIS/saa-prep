// SAA-C03 practice question bank - Domain 1 (Design Secure Architectures) + Domain 2 (Design Resilient Architectures)
// Original questions. Question/options in English, explanations in German.
window.QB = (window.QB || []).concat([

// ===================== DOMAIN 1: DESIGN SECURE ARCHITECTURES =====================
{id:"d1-001", domain:1, topic:"IAM", multi:false,
 q:"A logistics company runs a reporting application on Amazon EC2 instances that must read and write objects in a single Amazon S3 bucket. The security team has discovered long-term access keys stored in the application's configuration file and wants to eliminate them. What is the MOST secure solution?",
 options:[
  "Create an IAM user with a policy scoped to the bucket and rotate its access keys every 30 days using AWS Lambda.",
  "Store the existing access keys in AWS Secrets Manager and have the application retrieve them at startup.",
  "Create an IAM role with a policy scoped to the bucket, attach it to the EC2 instances through an instance profile, and remove the keys from the configuration.",
  "Add a bucket policy that allows access from the public IP addresses of the EC2 instances and remove the keys."],
 answer:[2],
 explain:"Eine IAM Role per Instance Profile liefert automatisch rotierende temporäre Credentials über den Instance Metadata Service – keine langlebigen Keys mehr. Rotierte IAM-User-Keys oder Keys in Secrets Manager bleiben langlebige Credentials, die leaken können. Eine Bucket Policy auf öffentliche IPs ist fragil (IPs ändern sich) und keine Identitätsprüfung. Exam-Tip: 'EC2 braucht Zugriff auf AWS-Service' = fast immer IAM Role."},

{id:"d1-002", domain:1, topic:"IAM Cross-Account", multi:false,
 q:"A media company has a production account (Account A) that hosts an Amazon DynamoDB table. Analysts in a separate analytics account (Account B) need read-only access to the table. The company wants to avoid creating IAM users in Account A. Which solution meets these requirements?",
 options:[
  "Create an IAM role in Account A with a read-only DynamoDB policy and a trust policy that trusts Account B; grant analysts in Account B permission to call sts:AssumeRole on that role.",
  "Create a resource-based policy on the DynamoDB table in Account A that grants the analysts' IAM users full access.",
  "Use AWS Resource Access Manager (AWS RAM) to share the IAM users of Account B with Account A.",
  "Create an SCP in AWS Organizations that allows Account B to read DynamoDB tables in Account A."],
 answer:[0],
 explain:"Der Standardweg für Cross-Account-Zugriff ist eine Role im Ziel-Account mit Trust Policy auf den Quell-Account; die Nutzer in B erhalten sts:AssumeRole und bekommen temporäre Credentials. DynamoDB unterstützt zwar inzwischen resource-based policies, aber 'full access' verletzt das Least-Privilege-Prinzip. AWS RAM teilt Ressourcen wie Subnets oder Transit Gateways, keine IAM-User. SCPs gewähren niemals Berechtigungen, sie begrenzen nur."},

{id:"d1-003", domain:1, topic:"IAM Permission Boundaries", multi:false,
 q:"A company allows its developers to create IAM roles for their AWS Lambda functions. The security team must ensure that any role a developer creates can never have more permissions than a defined set of services (Amazon S3, Amazon DynamoDB, and Amazon CloudWatch Logs), even if a developer attaches the AdministratorAccess policy to it. What should a solutions architect do?",
 options:[
  "Attach an SCP to the developers' account that denies iam:CreateRole.",
  "Create a permissions boundary policy limited to the allowed services and grant developers iam:CreateRole only with a condition that requires that permissions boundary to be attached.",
  "Enable AWS Config rules that delete any role that has the AdministratorAccess policy attached.",
  "Use IAM Access Analyzer to block the creation of roles with excessive permissions."],
 answer:[1],
 explain:"Ein Permissions Boundary legt die maximal möglichen Berechtigungen einer Identität fest; mit der Condition iam:PermissionsBoundary in der Developer-Policy wird erzwungen, dass jede neue Role diese Grenze trägt. Die effektiven Rechte sind die Schnittmenge aus Identity Policy und Boundary, daher bringt auch AdministratorAccess nichts darüber hinaus. Ein Deny auf CreateRole verhindert den gewünschten Self-Service. AWS Config reagiert nur nachträglich, Access Analyzer analysiert und blockiert nichts."},

{id:"d1-004", domain:1, topic:"AWS Organizations SCP", multi:false,
 q:"A European financial services company uses AWS Organizations with dozens of member accounts. Due to data residency rules, workloads may only be deployed in the eu-central-1 and eu-west-1 Regions. Global services such as IAM and Amazon Route 53 must continue to work. What is the MOST operationally efficient way to enforce this across all current and future accounts?",
 options:[
  "Create an IAM policy in every account that denies actions outside the two Regions and attach it to all users and roles.",
  "Enable AWS CloudTrail in all Regions and use Amazon EventBridge to terminate resources created in other Regions.",
  "Use AWS Config conformance packs to mark resources outside the allowed Regions as noncompliant.",
  "Attach an SCP to the organization root that denies all actions when aws:RequestedRegion is not eu-central-1 or eu-west-1, excluding global services by using NotAction."],
 answer:[3],
 explain:"Eine SCP am Root wirkt automatisch auf alle bestehenden und neuen Member-Accounts und ist präventiv; global services werden über NotAction ausgenommen, weil deren API-Calls über us-east-1 laufen. IAM-Policies pro Account sind aufwendig und können lokal verändert werden. CloudTrail/EventBridge und AWS Config sind detektiv bzw. reaktiv, nicht präventiv. Tipp: AWS Control Tower bietet dafür einen fertigen Region-Deny-Control."},

{id:"d1-005", domain:1, topic:"AWS Organizations SCP", multi:false,
 q:"A member account in AWS Organizations has an SCP attached that allows s3:* and ec2:*. A new IAM user in that account has no IAM policies attached. The user reports that every attempt to list S3 buckets fails with an AccessDenied error. What is the cause?",
 options:[
  "SCPs only take effect after the account is moved to a new OU.",
  "The SCP must also allow iam:* for S3 actions to succeed.",
  "SCPs define the maximum available permissions but do not grant permissions; the user still needs an identity-based policy that allows the S3 actions.",
  "The management account must approve each S3 API call made by member accounts."],
 answer:[2],
 explain:"SCPs sind Guardrails: Sie begrenzen, was in einem Account maximal erlaubt sein kann, gewähren aber selbst nichts. Effektive Berechtigung = Schnittmenge aus SCP und Identity- bzw. Resource-Policy, daher braucht der User zusätzlich eine IAM-Policy. Eine SCP wirkt sofort, ein OU-Wechsel ist nicht nötig, und iam:* hat mit S3-Rechten nichts zu tun. Der Management Account genehmigt keine einzelnen API-Calls."},

{id:"d1-006", domain:1, topic:"AWS Organizations SCP", multi:false,
 q:"A security engineer attached an SCP that denies ec2:RunInstances for instance types larger than m5.xlarge to the root of the organization. Engineers in member accounts are blocked as expected, but an administrator in the management account can still launch m5.4xlarge instances. Why?",
 options:[
  "SCPs do not affect users or roles in the management account.",
  "The administrator is using the root user, and SCPs never apply to root users in any account.",
  "SCPs are only evaluated for requests made through the AWS Management Console.",
  "The SCP needs to be attached directly to each account instead of the root."],
 answer:[0],
 explain:"SCPs gelten nie für den Management Account – deshalb sollen dort keine Workloads laufen. In Member-Accounts gelten SCPs hingegen auch für den Root-User des Accounts, daher ist Option 2 falsch. SCPs werden für alle Requests ausgewertet (Console, CLI, SDK). Eine Anhängung am Root vererbt sich bereits an alle Accounts."},

{id:"d1-007", domain:1, topic:"IAM Identity Center", multi:false,
 q:"A retail company has 40 AWS accounts in AWS Organizations. Employees authenticate with the corporate Microsoft Entra ID directory. The company wants employees to sign in once and access the accounts they are entitled to with role-based permissions, and wants users to be provisioned automatically when they join. Which solution requires the LEAST operational overhead?",
 options:[
  "Create IAM users in every account and synchronize passwords with a custom script.",
  "Configure a separate SAML 2.0 identity provider in each of the 40 accounts and create IAM roles in each account manually.",
  "Deploy Amazon Cognito user pools federated with Entra ID and grant access to the accounts through identity pools.",
  "Enable AWS IAM Identity Center, connect Entra ID as an external identity provider with SCIM provisioning, and assign permission sets to groups for the relevant accounts."],
 answer:[3],
 explain:"IAM Identity Center ist der zentrale Workforce-SSO-Dienst für Multi-Account-Umgebungen: externes IdP per SAML 2.0, automatische Provisionierung per SCIM und Permission Sets, die als Roles in die Accounts ausgerollt werden. IAM-User pro Account und SAML-Federation pro Account skalieren schlecht. Cognito ist für Kunden-/App-Nutzer (Customer Identity), nicht für Mitarbeiterzugriff auf AWS-Accounts."},

{id:"d1-008", domain:1, topic:"Cognito", multi:true,
 q:"A startup is building a mobile photo-sharing app. Users must be able to sign up with email or sign in with Google. After sign-in, the app must upload photos directly to a private Amazon S3 prefix that belongs to the user, using temporary AWS credentials. Which TWO components should a solutions architect use? (Choose TWO.)",
 options:[
  "An Amazon Cognito user pool with Google configured as a social identity provider",
  "IAM users created for each app user with access keys embedded in the app",
  "An Amazon Cognito identity pool that exchanges user pool tokens for temporary credentials of an IAM role scoped to the user's prefix",
  "AWS IAM Identity Center with permission sets for each app user",
  "An S3 bucket policy that allows public write access to the uploads prefix"],
 answer:[0,2],
 explain:"Der User Pool übernimmt Registrierung, Login und Social Federation (Google) und liefert JWTs; der Identity Pool tauscht diese gegen temporäre AWS-Credentials einer IAM Role, die per Policy-Variable (cognito-identity.amazonaws.com:sub) auf den eigenen Prefix begrenzt werden kann. Eingebettete IAM-Keys sind ein Sicherheitsrisiko. Identity Center ist für Workforce, nicht für Endkunden. Öffentliche Schreibrechte widersprechen der Anforderung 'private'."},

{id:"d1-009", domain:1, topic:"Cognito", multi:false,
 q:"A company hosts an internal web application on EC2 instances behind an Application Load Balancer. The developers want to add user authentication without changing the application code. Users are managed in an Amazon Cognito user pool. What should the solutions architect do?",
 options:[
  "Configure an HTTPS listener rule on the ALB with an authenticate-cognito action that references the user pool, followed by the forward action.",
  "Place Amazon API Gateway with a Cognito authorizer in front of the EC2 instances instead of the ALB.",
  "Attach an AWS WAF web ACL to the ALB that validates Cognito tokens.",
  "Configure a security group on the ALB that only allows users who are members of the user pool."],
 answer:[0],
 explain:"Das ALB unterstützt native Authentifizierung (authenticate-cognito oder authenticate-oidc) auf HTTPS-Listenern; der ALB übernimmt den Login-Flow und reicht Claims als Header weiter, ohne Code-Änderung. API Gateway wäre eine größere Architekturänderung und unterstützt EC2-Backends nicht so direkt wie das ALB. WAF prüft Requests auf Muster, nicht Cognito-Sessions. Security Groups arbeiten auf IP/Port-Ebene und kennen keine Benutzer."},

{id:"d1-010", domain:1, topic:"KMS", multi:false,
 q:"A healthcare company must encrypt data in Amazon EBS, Amazon S3, and Amazon RDS. Compliance requires that the company controls who can use the keys through its own key policies, that every use of a key is auditable in AWS CloudTrail, and that the key material is rotated automatically. Which solution meets these requirements with the LEAST operational effort?",
 options:[
  "Use AWS managed keys (aws/ebs, aws/s3, aws/rds) for each service.",
  "Use AWS KMS customer managed keys with automatic key rotation enabled and define access in the key policies.",
  "Generate keys on premises and import them into AWS KMS, then rotate them manually each year.",
  "Use SSE-S3 for S3 and the default encryption options for EBS and RDS."],
 answer:[1],
 explain:"Customer managed keys erlauben eigene Key Policies, jede Nutzung wird in CloudTrail geloggt und automatische Rotation lässt sich aktivieren (Rotationsperiode konfigurierbar). AWS managed keys rotieren zwar automatisch, ihre Key Policy kann man aber nicht selbst verwalten. Importiertes Key Material unterstützt keine automatische Rotation und erhöht den Aufwand. SSE-S3 nutzt von S3 verwaltete Keys ohne eigene Key Policy."},

{id:"d1-011", domain:1, topic:"CloudHSM", multi:false,
 q:"A payment processor is migrating an application that uses the PKCS#11 interface to perform cryptographic operations. Regulators require that keys are stored in single-tenant hardware security modules that the company exclusively controls, and AWS must have no access to the key material. Which service should the solutions architect choose?",
 options:[
  "AWS KMS with customer managed keys",
  "AWS Secrets Manager with a customer managed KMS key",
  "AWS CloudHSM",
  "AWS Certificate Manager Private Certificate Authority"],
 answer:[2],
 explain:"CloudHSM bietet dedizierte Single-Tenant-HSMs in der eigenen VPC, der Kunde verwaltet Benutzer und Keys exklusiv, und es unterstützt Standard-APIs wie PKCS#11, JCE und OpenSSL. AWS KMS ist ein Multi-Tenant-Managed-Service, bei dem AWS die HSM-Flotte betreibt. Secrets Manager speichert Secrets, keine HSM-Keys für Krypto-Operationen. Private CA stellt Zertifikate aus. Exam-Tip: 'single-tenant', 'exclusive control', 'PKCS#11' = CloudHSM."},

{id:"d1-012", domain:1, topic:"KMS", multi:false,
 q:"A company needs to share an encrypted Amazon RDS DB snapshot with a partner's AWS account. The snapshot is currently encrypted with the default AWS managed key (aws/rds). The share attempt fails. What should the solutions architect do?",
 options:[
  "Make the snapshot public so the partner can copy it.",
  "Add the partner's account ID to the key policy of the aws/rds AWS managed key.",
  "Ask the partner to create a cross-account IAM role that has the kms:Decrypt permission on any key.",
  "Copy the snapshot and re-encrypt it with a customer managed KMS key, grant the partner account access in that key's policy, and share the copied snapshot."],
 answer:[3],
 explain:"Snapshots, die mit einem AWS managed key verschlüsselt sind, können nicht geteilt werden, weil die Key Policy dieser Keys nicht änderbar ist. Lösung: Kopie mit einem customer managed key erstellen, dem Partner-Account in der Key Policy Zugriff geben und dann teilen. Verschlüsselte Snapshots können nicht öffentlich gemacht werden. Eine IAM-Role im Partner-Account hilft nicht, solange die Key Policy den Zugriff nicht erlaubt."},

{id:"d1-013", domain:1, topic:"Secrets Manager", multi:false,
 q:"An application on AWS Lambda connects to an Amazon Aurora PostgreSQL database. The security policy requires that the database password is rotated every 30 days automatically without application downtime and without any custom rotation code to maintain. Where should the credentials be stored?",
 options:[
  "AWS Secrets Manager with managed rotation enabled for the Aurora secret",
  "AWS Systems Manager Parameter Store as a SecureString parameter",
  "Lambda environment variables encrypted with a customer managed KMS key",
  "An encrypted object in Amazon S3 that the function reads on each invocation"],
 answer:[0],
 explain:"Secrets Manager bietet native, geplante Rotation für RDS/Aurora (managed rotation bzw. von AWS bereitgestellte Rotation-Lambdas); Clients lesen immer die aktuelle Version des Secrets. Parameter Store SecureString kann verschlüsseln, hat aber keine eingebaute Rotation. Environment Variables und S3-Objekte müssten manuell bzw. mit eigenem Code rotiert werden. Exam-Tip: 'automatic rotation' = Secrets Manager."},

{id:"d1-014", domain:1, topic:"Parameter Store", multi:false,
 q:"A development team needs to store about 300 configuration values for several microservices, such as feature flags, endpoint URLs, and a few API keys that must be encrypted. No rotation is required, values are smaller than 4 KB, and the company wants the LOWEST cost. Which solution should be used?",
 options:[
  "AWS Secrets Manager secrets for all values",
  "Amazon DynamoDB table with encryption at rest enabled",
  "AWS AppConfig hosted configuration with a dedicated Amazon S3 bucket for each value",
  "AWS Systems Manager Parameter Store standard parameters, using SecureString for the API keys"],
 answer:[3],
 explain:"Standard Parameters in Parameter Store sind kostenlos (bis 10.000 Parameter, 4 KB) und SecureString verschlüsselt sensible Werte mit KMS. Secrets Manager kostet pro Secret und Monat und lohnt sich vor allem bei Rotationsbedarf. DynamoDB und ein S3-Bucket pro Wert sind unnötig komplex und teurer für reine Konfigurationswerte."},

{id:"d1-015", domain:1, topic:"S3 Security", multi:false,
 q:"After an incident in which a developer accidentally made a bucket containing customer invoices public, the CISO requires that no bucket in the account can ever be made public through ACLs or bucket policies, including buckets created in the future. What should the solutions architect do?",
 options:[
  "Enable Amazon Macie to alert on public buckets.",
  "Enable S3 Block Public Access at the account level with all four settings turned on, and use an SCP to deny s3:PutAccountPublicAccessBlock.",
  "Enable default encryption with SSE-KMS on all buckets.",
  "Add a bucket policy to every existing bucket that denies s3:GetObject to anonymous principals."],
 answer:[1],
 explain:"Account-weites Block Public Access überschreibt öffentliche ACLs und Policies für alle bestehenden und künftigen Buckets; mit einer SCP verhindert man, dass jemand die Einstellung wieder ausschaltet. Macie erkennt nur, verhindert nicht. Verschlüsselung schützt nicht vor öffentlichem Zugriff, da S3 für berechtigte bzw. anonyme Leser transparent entschlüsselt (bei SSE-S3). Bucket Policies pro Bucket decken keine künftigen Buckets ab."},

{id:"d1-016", domain:1, topic:"S3 Encryption", multi:true,
 q:"A company stores confidential contracts in an Amazon S3 bucket. The compliance team requires that all requests use encryption in transit and that every new object is encrypted at rest with a specific customer managed AWS KMS key, even if the uploading client does not specify encryption headers. Which TWO actions meet these requirements? (Choose TWO.)",
 options:[
  "Add a bucket policy statement that denies all s3:* actions when the condition aws:SecureTransport is false.",
  "Enable S3 Versioning and MFA Delete on the bucket.",
  "Configure default bucket encryption to SSE-KMS with the specified customer managed key.",
  "Enable S3 Transfer Acceleration on the bucket.",
  "Configure an S3 Lifecycle rule that transitions objects to S3 Glacier Flexible Retrieval."],
 answer:[0,2],
 explain:"Eine Deny-Regel mit aws:SecureTransport=false erzwingt HTTPS für alle Zugriffe. Default Encryption mit SSE-KMS und dem gewünschten Key verschlüsselt jedes neue Objekt automatisch, auch ohne Header im Request. Versioning/MFA Delete schützt vor Löschen, nicht vor Klartext. Transfer Acceleration beschleunigt nur Uploads, und Lifecycle-Transitions haben nichts mit Verschlüsselung zu tun."},

{id:"d1-017", domain:1, topic:"S3 Encryption", multi:false,
 q:"An auditing firm stores reports in Amazon S3. Auditors require a record of who used which encryption key and when, and the firm must be able to revoke decryption permissions for a specific team without changing bucket policies. Which encryption option should the solutions architect recommend?",
 options:[
  "SSE-S3 (Amazon S3 managed keys)",
  "SSE-C (customer-provided keys)",
  "SSE-KMS with a customer managed key whose key policy controls which roles can decrypt",
  "No server-side encryption; rely on HTTPS only"],
 answer:[2],
 explain:"SSE-KMS protokolliert jede Key-Nutzung in CloudTrail und erlaubt über die Key Policy eine zusätzliche, vom Bucket unabhängige Berechtigungsebene (wer kein kms:Decrypt hat, kann trotz S3-Rechten nicht lesen). SSE-S3 bietet weder eigene Key-Berechtigungen noch Key-Audit. Bei SSE-C verwaltet der Kunde die Keys selbst und AWS hat keine Key-Policy-Steuerung. HTTPS allein schützt nur in transit."},

{id:"d1-018", domain:1, topic:"S3 Encryption", multi:false,
 q:"A defense contractor's policy states that plaintext data must never be sent to or processed by any AWS service, and that the encryption keys must remain exclusively in the company's on-premises key management system. The company wants to use Amazon S3 for storage. Which approach satisfies the policy?",
 options:[
  "Use SSE-S3 with bucket keys enabled.",
  "Use SSE-KMS with imported key material from the on-premises system.",
  "Use SSE-C and send the on-premises key with each request.",
  "Use client-side encryption with keys from the on-premises key management system before uploading the objects."],
 answer:[3],
 explain:"Nur bei Client-Side Encryption verlässt die Daten das Unternehmen bereits verschlüsselt, AWS sieht nie Klartext und nie den Key. Bei SSE-C wird zwar der eigene Key genutzt, aber Daten und Key werden an S3 gesendet und dort verschlüsselt. Bei SSE-KMS mit importiertem Key Material liegt der Key in AWS KMS. SSE-S3 nutzt vollständig von AWS verwaltete Keys."},

{id:"d1-019", domain:1, topic:"S3 Presigned URLs", multi:false,
 q:"An e-learning platform stores course videos in a private Amazon S3 bucket. After purchase, a customer must be able to download a video for 2 hours without having AWS credentials. The bucket must remain private. What should the application do?",
 options:[
  "Generate an S3 presigned URL for the object with an expiration of 2 hours, signed by an IAM role that has s3:GetObject permission.",
  "Temporarily disable S3 Block Public Access and make the object public for 2 hours.",
  "Create an IAM user for every customer and delete it after 2 hours.",
  "Enable S3 static website hosting on the bucket and share the website endpoint."],
 answer:[0],
 explain:"Ein Presigned URL gewährt zeitlich begrenzten Zugriff auf ein privates Objekt mit den Rechten des Signierers; der Bucket bleibt privat. Achtung: Die Gültigkeit endet spätestens mit den signierenden Credentials (bei Role-Credentials also mit der Session). Objekte öffentlich zu machen widerspricht der Anforderung. IAM-User pro Kunde skalieren nicht, und Website-Hosting erfordert öffentlichen Zugriff."},

{id:"d1-020", domain:1, topic:"S3 Object Lock", multi:false,
 q:"A brokerage firm must store trade records in Amazon S3 in a WORM (write once, read many) format for 7 years to satisfy SEC Rule 17a-4. No user, including the AWS account root user, may delete or overwrite the records during that period. Which configuration meets this requirement?",
 options:[
  "S3 Object Lock in governance mode with a 7-year retention period",
  "S3 Versioning with MFA Delete enabled",
  "S3 Object Lock in compliance mode with a 7-year retention period",
  "An S3 Lifecycle rule that moves objects to S3 Glacier Deep Archive after 1 day"],
 answer:[2],
 explain:"Im Compliance Mode kann niemand – auch nicht der Root-User – geschützte Objektversionen vor Ablauf der Retention löschen oder die Retention verkürzen. Im Governance Mode können Benutzer mit s3:BypassGovernanceRetention die Sperre umgehen. MFA Delete erschwert Löschen nur, bietet aber keine garantierte Aufbewahrung. Glacier Deep Archive ist eine Storage Class, kein WORM-Schutz."},

{id:"d1-021", domain:1, topic:"VPC Endpoints", multi:false,
 q:"EC2 instances in private subnets download several terabytes per day from Amazon S3 in the same Region. Today this traffic goes through a NAT gateway, and NAT data processing charges are high. The company wants to keep the traffic on the AWS network and reduce cost. What should the solutions architect do?",
 options:[
  "Create an interface VPC endpoint for Amazon S3 in each private subnet.",
  "Replace the NAT gateway with a NAT instance on a larger instance type.",
  "Create a gateway VPC endpoint for Amazon S3 and add it to the route tables of the private subnets.",
  "Enable S3 Transfer Acceleration and point the instances to the accelerated endpoint."],
 answer:[2],
 explain:"Gateway Endpoints (nur für S3 und DynamoDB) werden als Route in die Route Tables eingetragen und verursachen keine Stunden- oder Datenverarbeitungsgebühren – ideal zur Kostensenkung. Interface Endpoints funktionieren auch, kosten aber pro Stunde und pro GB. Eine NAT-Instance ist ein Single Point of Failure mit Verwaltungsaufwand. Transfer Acceleration läuft über Edge Locations und das Internet und kostet extra."},

{id:"d1-022", domain:1, topic:"VPC Endpoints", multi:true,
 q:"A company wants to ensure that an Amazon S3 bucket containing sensitive research data can be accessed ONLY from applications running in a specific VPC, and that the traffic never traverses the internet. Which TWO steps should the solutions architect take? (Choose TWO.)",
 options:[
  "Create a gateway VPC endpoint for Amazon S3 in the VPC and update the route tables.",
  "Attach an internet gateway to the VPC and allow only HTTPS in the security groups.",
  "Add a bucket policy that denies all access unless the request comes through the VPC endpoint, using the aws:SourceVpce condition key.",
  "Enable S3 Cross-Region Replication to a bucket in the VPC's Region.",
  "Configure a network ACL on the private subnets that denies traffic to the S3 public IP ranges."],
 answer:[0,2],
 explain:"Der Gateway Endpoint hält den Traffic im AWS-Netz, und die Bucket Policy mit Deny bei aws:SourceVpce ungleich der Endpoint-ID stellt sicher, dass Zugriffe von außerhalb abgewiesen werden. Ein Internet Gateway führt den Traffic gerade über öffentliche Endpunkte. Replication hat mit Zugriffskontrolle nichts zu tun. Ein NACL-Deny würde den Zugriff auf S3 sogar unterbrechen, ohne andere Zugriffswege auf den Bucket zu sperren."},

{id:"d1-023", domain:1, topic:"VPC Security", multi:false,
 q:"A security analyst detects malicious traffic from a specific IP address range (203.0.113.0/24) hitting web servers in a public subnet. The company wants to block this range for the entire subnet immediately while keeping all other traffic unchanged. What should the solutions architect do?",
 options:[
  "Add a deny rule for 203.0.113.0/24 to the security group of the web servers.",
  "Remove the internet gateway from the VPC.",
  "Add an inbound deny rule for 203.0.113.0/24 to the subnet's network ACL with a rule number lower than the existing allow rules.",
  "Configure AWS Shield Standard to block the IP range."],
 answer:[2],
 explain:"Network ACLs unterstützen explizite Deny-Regeln und werden in Reihenfolge der Rule Numbers ausgewertet, daher muss die Deny-Regel eine niedrigere Nummer als die Allow-Regeln haben. Security Groups kennen nur Allow-Regeln. Das Entfernen des IGW stoppt den gesamten Traffic. Shield Standard schützt automatisch gegen Layer-3/4-DDoS, bietet aber keine IP-Blocklisten (dafür AWS WAF IP sets)."},

{id:"d1-024", domain:1, topic:"VPC Security", multi:false,
 q:"A team configured a custom network ACL for a public subnet with an inbound rule that allows TCP 443 from 0.0.0.0/0 and an outbound rule that allows TCP 443 to 0.0.0.0/0. Clients on the internet now cannot complete HTTPS connections to the web servers, although the security groups allow inbound 443. What is the MOST likely fix?",
 options:[
  "Add an outbound NACL rule that allows TCP ports 1024-65535 to 0.0.0.0/0.",
  "Add an outbound security group rule that allows TCP 443 to 0.0.0.0/0.",
  "Add an inbound NACL rule that allows ICMP from 0.0.0.0/0.",
  "Associate an Elastic IP address with each web server."],
 answer:[0],
 explain:"NACLs sind stateless: Antworten des Servers gehen an die Ephemeral Ports des Clients (typisch 1024-65535) und müssen outbound explizit erlaubt werden. Security Groups sind stateful, Antworten auf erlaubte eingehende Verbindungen sind automatisch zugelassen. ICMP ist für HTTPS nicht nötig, und Elastic IPs ändern nichts an der NACL-Filterung."},

{id:"d1-025", domain:1, topic:"VPC Security", multi:false,
 q:"A three-tier application has a web tier and an application tier in separate Auto Scaling groups. Instances in both tiers are frequently replaced and receive new private IP addresses. The application tier must accept traffic on port 8080 only from the web tier. What is the MOST maintainable way to configure this?",
 options:[
  "Add the private IP addresses of the web instances to the application tier's security group and update them with a Lambda function.",
  "In the application tier's security group, add an inbound rule for port 8080 with the web tier's security group ID as the source.",
  "Allow port 8080 from the VPC CIDR in a network ACL on the application subnet.",
  "Place both tiers in the same subnet and allow all traffic within the subnet."],
 answer:[1],
 explain:"Security Groups können andere Security Groups als Quelle referenzieren; damit ist jede Instance mit der Web-SG automatisch erlaubt, unabhängig von wechselnden IPs. IP-Listen per Lambda zu pflegen ist fehleranfällig. Die VPC-CIDR ist zu breit und verletzt Least Privilege. Gleiche Subnets ohne Filter heben die Tier-Trennung auf."},

{id:"d1-026", domain:1, topic:"NAT Gateway", multi:true,
 q:"EC2 instances in private subnets across three Availability Zones need outbound internet access to download OS patches. Currently a single NAT gateway in one AZ is used, and an AZ outage recently cut off patching for all instances. Which TWO changes make outbound access highly available? (Choose TWO.)",
 options:[
  "Create a NAT gateway in a public subnet in each of the three Availability Zones.",
  "Assign public IP addresses to all instances in the private subnets.",
  "Configure each private subnet's route table to send 0.0.0.0/0 to the NAT gateway in the same Availability Zone.",
  "Replace the NAT gateway with an egress-only internet gateway.",
  "Add a second internet gateway to the VPC."],
 answer:[0,2],
 explain:"Ein NAT Gateway ist nur innerhalb seiner AZ redundant; für AZ-Ausfallsicherheit braucht man eins pro AZ und AZ-spezifische Route Tables, damit Instances nicht vom NAT einer anderen AZ abhängen. Öffentliche IPs machen die Subnets faktisch öffentlich. Egress-only IGWs funktionieren nur für IPv6. Pro VPC kann nur ein Internet Gateway angehängt werden."},

{id:"d1-027", domain:1, topic:"VPC Endpoints", multi:false,
 q:"Applications in an isolated VPC without internet access or NAT need to retrieve secrets from AWS Secrets Manager and send messages to Amazon SQS. The applications use the default public service endpoints in the AWS SDK. What should the solutions architect configure so that the applications work without code changes?",
 options:[
  "Gateway VPC endpoints for Secrets Manager and Amazon SQS",
  "Interface VPC endpoints (AWS PrivateLink) for Secrets Manager and Amazon SQS with private DNS enabled",
  "A VPC peering connection to a VPC that has a NAT gateway",
  "A Site-to-Site VPN connection to the AWS public endpoints"],
 answer:[1],
 explain:"Interface Endpoints legen ENIs mit privaten IPs in die Subnets; mit Private DNS lösen die Standard-Service-Hostnamen auf diese IPs auf, daher sind keine Code-Änderungen nötig. Gateway Endpoints existieren nur für S3 und DynamoDB. VPC Peering ist nicht transitiv, eine NAT im Peer-VPC kann nicht mitgenutzt werden. Ein VPN zu öffentlichen AWS-Endpunkten ist nicht der vorgesehene Weg."},

{id:"d1-028", domain:1, topic:"PrivateLink", multi:false,
 q:"A SaaS provider wants to offer its API, which runs on EC2 instances in its own VPC, to hundreds of customer VPCs in different AWS accounts. Many customers use overlapping CIDR ranges, and the provider must not expose the service to the internet or gain access to customer networks. Which solution should the solutions architect recommend?",
 options:[
  "Create VPC peering connections with each customer VPC.",
  "Attach all customer VPCs to a shared AWS Transit Gateway.",
  "Place the service behind a Network Load Balancer, create a VPC endpoint service (AWS PrivateLink), and let customers create interface endpoints.",
  "Expose the service through a public Application Load Balancer restricted by security groups to customer IP ranges."],
 answer:[2],
 explain:"PrivateLink stellt einen einzelnen Service unidirektional bereit: Kunden erhalten ein Interface Endpoint in ihrer eigenen VPC, überlappende CIDRs sind kein Problem und es entsteht kein Netzwerkzugriff in beide Richtungen. VPC Peering und Transit Gateway erfordern nicht-überlappende CIDRs und verbinden ganze Netze. Ein öffentliches ALB widerspricht der Anforderung, nicht ins Internet zu exponieren."},

{id:"d1-029", domain:1, topic:"AWS WAF", multi:false,
 q:"An online travel agency's web application runs behind an Application Load Balancer. Security scans show attempts at SQL injection and cross-site scripting (XSS) in query strings. The company wants a managed solution that blocks these attacks with minimal effort. What should the solutions architect do?",
 options:[
  "Enable Amazon GuardDuty and configure automatic remediation.",
  "Enable AWS Shield Advanced on the ALB.",
  "Configure network ACLs to block requests that contain SQL keywords.",
  "Associate an AWS WAF web ACL with the ALB that uses AWS Managed Rules such as the SQL database and core rule sets."],
 answer:[3],
 explain:"AWS WAF arbeitet auf Layer 7 und erkennt SQLi/XSS-Muster; AWS Managed Rule Groups liefern fertige, gepflegte Regeln und lassen sich an ALB, CloudFront, API Gateway, AppSync oder Cognito anhängen. GuardDuty ist Threat Detection, keine Inline-Filterung. Shield Advanced zielt auf DDoS. NACLs filtern nur IP/Port und können keine Request-Inhalte prüfen."},

{id:"d1-030", domain:1, topic:"AWS WAF", multi:false,
 q:"A ticketing website on Amazon CloudFront is being hit by bots that send thousands of requests per minute from individual IP addresses during ticket sales, degrading performance for real users. What is the MOST effective way to mitigate this?",
 options:[
  "Add an AWS WAF rate-based rule to the web ACL associated with the CloudFront distribution to block IPs that exceed a request threshold.",
  "Increase the minimum capacity of the origin's Auto Scaling group.",
  "Configure a security group on the CloudFront distribution to limit connections.",
  "Enable Amazon Inspector on the origin servers."],
 answer:[0],
 explain:"Rate-based Rules in AWS WAF zählen Requests pro Quell-IP (oder anderem Aggregationsschlüssel) innerhalb eines Zeitfensters und blockieren bei Überschreitung automatisch. Mehr Kapazität bekämpft nur das Symptom und kostet. CloudFront hat keine Security Groups im klassischen Sinn für Rate Limiting. Inspector scannt Schwachstellen, blockt keinen Traffic. Ergänzend: AWS WAF Bot Control."},

{id:"d1-031", domain:1, topic:"AWS Shield", multi:false,
 q:"A gaming company experienced a large DDoS attack that caused Auto Scaling to launch many instances, resulting in a large bill. The company wants 24/7 access to AWS DDoS experts during attacks and protection against scaling charges caused by DDoS attacks. Which service should the company use?",
 options:[
  "AWS Shield Standard",
  "AWS Shield Advanced",
  "Amazon GuardDuty",
  "AWS Firewall Manager"],
 answer:[1],
 explain:"Shield Advanced bietet Zugang zum Shield Response Team (SRT, mit Business- oder Enterprise-Support), DDoS Cost Protection für skalierungsbedingte Mehrkosten sowie erweiterte Erkennung und Visibility. Shield Standard ist kostenlos und automatisch aktiv, enthält aber weder SRT noch Kostenschutz. GuardDuty erkennt Bedrohungen, mitigiert keine DDoS. Firewall Manager verwaltet Regeln zentral, ersetzt aber Shield Advanced nicht."},

{id:"d1-032", domain:1, topic:"GuardDuty", multi:false,
 q:"A company wants to be alerted when an EC2 instance communicates with IP addresses known for cryptocurrency mining, or when IAM credentials are used from unusual locations. The solution must require no agents and analyze AWS CloudTrail events, VPC Flow Logs, and DNS logs. Which service meets these requirements?",
 options:[
  "Amazon Inspector",
  "Amazon Macie",
  "AWS Config",
  "Amazon GuardDuty"],
 answer:[3],
 explain:"GuardDuty ist ein Threat-Detection-Service, der ohne Agenten CloudTrail Management Events, VPC Flow Logs und DNS Logs mit Threat Intelligence und ML auswertet (z. B. CryptoCurrency- oder UnauthorizedAccess-Findings). Inspector sucht Software-Schwachstellen. Macie findet sensible Daten in S3. AWS Config bewertet Konfigurations-Compliance."},

{id:"d1-033", domain:1, topic:"Macie", multi:false,
 q:"A retailer has hundreds of Amazon S3 buckets created by different teams over several years. Before a GDPR audit, the company must identify which buckets contain personally identifiable information such as names, addresses, and credit card numbers. Which service should be used?",
 options:[
  "Amazon Macie",
  "AWS Security Hub",
  "Amazon Detective",
  "Amazon GuardDuty S3 Protection"],
 answer:[0],
 explain:"Macie nutzt ML und Pattern Matching, um sensible Daten (PII, Finanzdaten, Credentials) in S3 zu entdecken und zu klassifizieren, inklusive automatisierter Sensitive Data Discovery über viele Buckets. Security Hub aggregiert Findings, scannt aber keine Objektinhalte. Detective untersucht Ursachen von Sicherheitsvorfällen. GuardDuty S3 Protection erkennt verdächtige Zugriffsmuster, keine PII in Objekten."},

{id:"d1-034", domain:1, topic:"Inspector", multi:false,
 q:"A company runs workloads on Amazon EC2, stores container images in Amazon ECR, and uses AWS Lambda functions. The security team wants continuous, automated scanning for software vulnerabilities (CVEs) and unintended network exposure across all three, with findings prioritized by risk. Which service should be enabled?",
 options:[
  "AWS Trusted Advisor",
  "Amazon GuardDuty",
  "Amazon Inspector",
  "AWS Audit Manager"],
 answer:[2],
 explain:"Amazon Inspector scannt kontinuierlich EC2-Instances (über SSM Agent oder agentless), ECR-Images und Lambda-Funktionen auf CVEs sowie EC2 auf Network Reachability und priorisiert per Risk Score. Trusted Advisor gibt Best-Practice-Empfehlungen auf Account-Ebene. GuardDuty erkennt aktive Bedrohungen, keine Paket-Schwachstellen. Audit Manager sammelt Nachweise für Audits."},

{id:"d1-035", domain:1, topic:"Security Hub", multi:false,
 q:"A company with 25 AWS accounts uses GuardDuty, Macie, and Inspector. The security team wants a single place to view and prioritize findings from all accounts and Regions, and to continuously check resources against the AWS Foundational Security Best Practices and CIS benchmarks. Which service should be used?",
 options:[
  "Amazon CloudWatch dashboards in the management account",
  "AWS Security Hub with a delegated administrator account and cross-Region aggregation",
  "AWS CloudTrail organization trail",
  "Amazon Detective"],
 answer:[1],
 explain:"Security Hub aggregiert Findings aus GuardDuty, Macie, Inspector und Partnertools im AWS Security Finding Format, unterstützt Delegated Admin über Organizations sowie Region-Aggregation und führt Security-Standard-Checks (FSBP, CIS) aus – diese CSPM-Funktion heißt inzwischen 'Security Hub CSPM'. CloudWatch-Dashboards bieten keine Findings-Normalisierung oder Standards. CloudTrail protokolliert API-Calls. Detective dient der Ursachenanalyse."},

{id:"d1-036", domain:1, topic:"Security Services", multi:true,
 q:"A fintech company wants to (1) automatically detect if any Amazon S3 bucket contains unencrypted credit card numbers and (2) be alerted when an EC2 instance starts communicating with a known command-and-control server. Which TWO services should the solutions architect enable? (Choose TWO.)",
 options:[
  "Amazon Inspector",
  "Amazon Macie",
  "AWS Shield Advanced",
  "Amazon GuardDuty",
  "AWS Artifact"],
 answer:[1,3],
 explain:"Macie erkennt sensible Daten wie Kreditkartennummern in S3-Objekten; GuardDuty meldet Kommunikation mit bekannten C&C-Servern (Backdoor/Trojan-Findings) auf Basis von Flow- und DNS-Logs. Inspector findet Schwachstellen, keine aktive Kommunikation oder Daten in S3. Shield Advanced zielt auf DDoS. AWS Artifact stellt Compliance-Berichte von AWS bereit."},

{id:"d1-037", domain:1, topic:"ACM", multi:false,
 q:"A company serves its website www.example.com through Amazon CloudFront with an Application Load Balancer origin in eu-west-1. The company wants to use a free public TLS certificate from AWS Certificate Manager on the CloudFront distribution. In which Region must the certificate be requested or imported?",
 options:[
  "eu-west-1, the Region of the origin ALB",
  "Any Region, because ACM certificates are global",
  "The Region closest to the majority of users",
  "us-east-1 (N. Virginia)"],
 answer:[3],
 explain:"CloudFront kann nur ACM-Zertifikate aus us-east-1 verwenden, da es ein globaler Service ist. Für das ALB selbst braucht man ein separates Zertifikat in dessen Region (eu-west-1). ACM-Zertifikate sind regionale Ressourcen, nicht global. Die Nutzer-Nähe spielt für die Zertifikatsregion keine Rolle."},

{id:"d1-038", domain:1, topic:"ACM", multi:false,
 q:"A company hosts three web applications (shop.example.com, blog.example.com, and api.example.net) on the same Application Load Balancer. Each application must be served over HTTPS with its own certificate, and the company wants AWS to renew the certificates automatically. What should the solutions architect do?",
 options:[
  "Create three ALBs, each with one certificate, because an HTTPS listener supports only one certificate.",
  "Request ACM certificates for the domains and add them to the ALB's HTTPS listener certificate list; the ALB uses SNI to select the correct certificate.",
  "Install the certificates on each EC2 instance and use a TCP listener on port 443.",
  "Use a single self-signed wildcard certificate for *.example.com on the ALB."],
 answer:[1],
 explain:"ALB-HTTPS-Listener unterstützen mehrere Zertifikate und wählen per Server Name Indication (SNI) das passende aus; ACM-Zertifikate mit DNS-Validierung werden automatisch erneuert. Drei ALBs sind unnötig teuer. Zertifikate auf Instances erfordern manuelle Erneuerung und verlieren Layer-7-Funktionen. Eine Wildcard für example.com deckt api.example.net nicht ab, und self-signed ist für Kunden ungeeignet."},

{id:"d1-039", domain:1, topic:"CloudFront + S3", multi:true,
 q:"A company serves static assets from an Amazon S3 bucket through Amazon CloudFront. Users have been bypassing CloudFront by accessing the S3 object URLs directly. The company wants the bucket to be accessible ONLY through the CloudFront distribution and wants to keep S3 Block Public Access enabled. Which TWO steps should be taken? (Choose TWO.)",
 options:[
  "Create an origin access control (OAC) and associate it with the S3 origin in the distribution.",
  "Enable S3 static website hosting and use the website endpoint as the origin.",
  "Update the bucket policy to allow s3:GetObject for the cloudfront.amazonaws.com service principal with a condition on AWS:SourceArn matching the distribution ARN.",
  "Make the objects public-read and restrict access with a CloudFront geo restriction.",
  "Configure signed cookies for all users."],
 answer:[0,2],
 explain:"Mit OAC signiert CloudFront die Requests an S3, und die Bucket Policy erlaubt nur dem CloudFront-Service-Principal mit genau dieser Distribution-ARN den Lesezugriff – der Bucket bleibt privat. Der Website-Endpoint unterstützt kein OAC und erfordert öffentlichen Zugriff. Public-read umgeht die Anforderung. Signed Cookies regeln, welche Endnutzer zugreifen dürfen, verhindern aber nicht den Direktzugriff auf S3."},

{id:"d1-040", domain:1, topic:"RDS Encryption", multi:false,
 q:"During a security review, a company discovers that its production Amazon RDS for MySQL DB instance was created without encryption at rest. The company must encrypt the database. What should the solutions architect do?",
 options:[
  "Modify the DB instance and enable encryption with a KMS key; the change applies during the next maintenance window.",
  "Create an encrypted read replica of the unencrypted instance and promote it.",
  "Enable default EBS encryption in the Region; the RDS storage will be encrypted automatically.",
  "Take a snapshot of the DB instance, copy the snapshot with encryption enabled using a KMS key, and restore a new DB instance from the encrypted copy."],
 answer:[3],
 explain:"Verschlüsselung kann bei einer bestehenden RDS-Instance nicht nachträglich aktiviert werden; der Weg ist Snapshot → verschlüsselte Kopie → Restore und Umstellung der Anwendung auf den neuen Endpoint. Ein verschlüsseltes Read Replica einer unverschlüsselten Instance ist nicht möglich. Die EBS-Default-Encryption gilt nicht rückwirkend und nicht für bestehende RDS-Storage."},

{id:"d1-041", domain:1, topic:"IAM Policy Evaluation", multi:false,
 q:"An IAM user is in a group with a policy that allows s3:* on all resources. The user also has an inline policy that denies s3:DeleteObject on arn:aws:s3:::finance-archive/*. The bucket policy of finance-archive allows the user s3:DeleteObject. What happens when the user tries to delete an object in finance-archive?",
 options:[
  "The request is denied because an explicit deny always overrides any allow.",
  "The request succeeds because the bucket policy explicitly allows the action.",
  "The request succeeds because group policies take precedence over inline policies.",
  "The request is denied only if the bucket has S3 Object Lock enabled."],
 answer:[0],
 explain:"Bei der IAM-Policy-Auswertung gilt: explizites Deny schlägt jedes Allow, egal ob aus Identity-, Resource-, Group- oder Inline-Policy. Es gibt keine Rangfolge zwischen Group- und Inline-Policies. Ein Allow in der Bucket Policy kann ein Deny nicht aufheben. Object Lock ist für diese Auswertung irrelevant."},

{id:"d1-042", domain:1, topic:"S3 Cross-Account", multi:true,
 q:"An S3 bucket in Account A stores shared marketing assets. An IAM role in Account B must be able to read objects from this bucket. Objects are encrypted with SSE-S3. Which TWO configurations are required? (Choose TWO.)",
 options:[
  "A bucket policy in Account A that allows s3:GetObject for the IAM role ARN from Account B",
  "An S3 Access Point in Account B that points to the bucket",
  "An identity-based policy attached to the role in Account B that allows s3:GetObject on the bucket's objects",
  "An SCP in Account A that allows Account B to access S3",
  "A VPC peering connection between the VPCs of the two accounts"],
 answer:[0,2],
 explain:"Bei Cross-Account-Zugriff mit Resource-based Policy müssen beide Seiten zustimmen: Die Bucket Policy in A erlaubt den Principal aus B, und die Identity Policy in B erlaubt der Role den Zugriff. Da SSE-S3 genutzt wird, sind keine KMS-Key-Rechte nötig (bei SSE-KMS bräuchte es zusätzlich die Key Policy). Access Points gehören zum Account des Buckets. SCPs gewähren nichts, und S3-Zugriff ist kein VPC-Peering-Thema."},

{id:"d1-043", domain:1, topic:"ECS IAM", multi:false,
 q:"A company runs a containerized order service on Amazon ECS with AWS Fargate. The application code inside the container must write items to an Amazon DynamoDB table. Container images are pulled from a private Amazon ECR repository. Where should the DynamoDB permissions be granted?",
 options:[
  "In the task execution role",
  "In the IAM role of the underlying EC2 container instances",
  "In the task role referenced in the task definition",
  "In the ECR repository policy"],
 answer:[2],
 explain:"Die Task Role liefert die Credentials, mit denen der Anwendungscode im Container AWS-APIs aufruft (z. B. DynamoDB). Die Task Execution Role nutzt der ECS-Agent für Image-Pulls aus ECR, CloudWatch Logs und Secrets-Abruf beim Start – nicht für den App-Code. Bei Fargate gibt es keine vom Kunden verwalteten Container-Instances. Die ECR-Repository-Policy regelt nur den Image-Zugriff."},

{id:"d1-044", domain:1, topic:"Lambda VPC", multi:false,
 q:"A Lambda function was attached to private subnets of a VPC so it can query an Amazon RDS database. After the change, the function times out when retrieving database credentials from AWS Secrets Manager. The VPC has no NAT gateway, and the company does not want to allow internet egress. What should the solutions architect do?",
 options:[
  "Assign a public IP address to the Lambda function's network interfaces.",
  "Create an interface VPC endpoint for Secrets Manager in the private subnets and allow HTTPS from the function's security group.",
  "Move the RDS database to a public subnet.",
  "Create a gateway VPC endpoint for Secrets Manager."],
 answer:[1],
 explain:"Eine VPC-gebundene Lambda hat keinen Internetzugang; ohne NAT erreicht sie öffentliche Service-Endpunkte nur über ein Interface Endpoint (PrivateLink), dessen Security Group Port 443 von der Lambda-SG erlauben muss. Lambda-ENIs bekommen keine öffentlichen IPs. Die Datenbank öffentlich zu machen ist unsicher und löst das Problem nicht. Gateway Endpoints gibt es nur für S3 und DynamoDB."},

{id:"d1-045", domain:1, topic:"EBS Encryption", multi:false,
 q:"A company's security policy requires that every new Amazon EBS volume and snapshot created in its production account is encrypted, regardless of who creates it or which tool is used. What is the SIMPLEST way to meet this requirement?",
 options:[
  "Enable EBS encryption by default in each Region used by the account, optionally with a customer managed KMS key as the default key.",
  "Create an AWS Config rule that deletes unencrypted volumes after they are created.",
  "Use only encrypted AMIs and instruct engineers to select encryption when creating volumes.",
  "Configure AWS Backup to encrypt all volumes nightly."],
 answer:[0],
 explain:"EBS Encryption by Default ist eine Einstellung pro Account und Region; danach wird jedes neue Volume und jeder daraus erstellte Snapshot automatisch verschlüsselt. Eine Config-Rule wirkt nur reaktiv und zerstört Daten. Anweisungen an Menschen sind keine Durchsetzung. AWS Backup verschlüsselt Backups im Vault, aber nicht die Quell-Volumes."},

// ===================== DOMAIN 2: DESIGN RESILIENT ARCHITECTURES =====================
{id:"d2-001", domain:2, topic:"RDS Multi-AZ", multi:false,
 q:"An insurance company runs its policy management database on a single-AZ Amazon RDS for PostgreSQL DB instance. Management requires that the database automatically survives the failure of an Availability Zone with no data loss for committed transactions and without changing the application's connection string. What should the solutions architect do?",
 options:[
  "Create a read replica in another Availability Zone and configure the application to switch to it manually.",
  "Convert the DB instance to a Multi-AZ deployment.",
  "Take automated snapshots every 5 minutes and restore them in another AZ if needed.",
  "Migrate the database to Amazon DynamoDB."],
 answer:[1],
 explain:"Multi-AZ repliziert synchron in eine Standby-Instance in einer anderen AZ; bei Ausfall erfolgt automatisches Failover, und der DNS-Endpoint bleibt gleich. Read Replicas replizieren asynchron (mögliche Datenverluste) und erfordern Promotion sowie neuen Endpoint. Snapshots haben ein RPO in Minuten und lange Restore-Zeiten. DynamoDB wäre eine aufwendige Re-Architektur."},

{id:"d2-002", domain:2, topic:"RDS Read Replicas", multi:false,
 q:"An e-commerce company's Amazon RDS for MySQL Multi-AZ DB instance deployment is overloaded during business hours because analysts run heavy read-only reports against it. The company wants to reduce the load on the primary without changing the write path. What should the solutions architect recommend?",
 options:[
  "Point the reporting tools to the standby instance of the Multi-AZ deployment.",
  "Increase the allocated storage of the DB instance to gain more IOPS.",
  "Enable RDS Performance Insights.",
  "Create one or more RDS read replicas and direct the reporting queries to the read replica endpoints."],
 answer:[3],
 explain:"Read Replicas dienen der Skalierung von Lesezugriffen und entlasten den Primary. Bei einer Multi-AZ DB Instance Deployment ist der Standby nicht lesbar und dient nur dem Failover (anders als beim Multi-AZ DB Cluster mit zwei lesbaren Standbys). Mehr Storage löst das CPU-/Query-Problem nicht zuverlässig. Performance Insights analysiert nur, entlastet aber nicht."},

{id:"d2-003", domain:2, topic:"Aurora Global Database", multi:false,
 q:"A global bank runs a critical application on Amazon Aurora MySQL in us-east-1. The bank requires a disaster recovery solution in eu-west-1 with an RPO of about 1 second and an RTO of under 1 minute for a Regional outage. Users in Europe should also get low-latency reads. Which solution meets these requirements?",
 options:[
  "Configure Aurora Global Database with a secondary cluster in eu-west-1.",
  "Create cross-Region automated backups and restore them in eu-west-1 during a disaster.",
  "Use AWS Database Migration Service for continuous replication to an RDS instance in eu-west-1.",
  "Enable Multi-AZ on the Aurora cluster in us-east-1."],
 answer:[0],
 explain:"Aurora Global Database repliziert storage-basiert mit typischer Latenz unter 1 Sekunde in bis zu mehrere sekundäre Regionen; ein Secondary kann in rund einer Minute zum Primary gemacht werden und bedient lokal Lesezugriffe. Backup-Restore hat RTO/RPO im Stundenbereich. DMS ist für Migrationen gedacht und bietet keine vergleichbaren RTO-Garantien. Multi-AZ schützt nur gegen AZ-, nicht gegen Region-Ausfälle."},

{id:"d2-004", domain:2, topic:"DynamoDB Global Tables", multi:false,
 q:"A mobile gaming company stores player profiles in Amazon DynamoDB. Players in North America, Europe, and Asia must be able to read and write their profiles with single-digit millisecond latency in their nearest Region, and the application must continue operating if an entire Region becomes unavailable. Which solution should be used?",
 options:[
  "A DynamoDB table in one Region with DynamoDB Accelerator (DAX) clusters in each Region",
  "DynamoDB Streams with Lambda functions that copy items to tables in other Regions",
  "DynamoDB global tables with replicas in the three Regions",
  "A single DynamoDB table with on-demand capacity behind Amazon CloudFront"],
 answer:[2],
 explain:"Global Tables sind eine vollständig verwaltete Multi-Region-, Multi-Active-Lösung: Jede Replica akzeptiert Reads und Writes lokal, die Replikation erfolgt automatisch. DAX ist ein regionaler Cache für Reads und hilft nicht bei Writes oder Regionsausfällen. Eine Eigenbau-Replikation per Streams/Lambda ist aufwendig und konfliktanfällig. CloudFront cached keine DynamoDB-Writes."},

{id:"d2-005", domain:2, topic:"RDS Proxy", multi:false,
 q:"A serverless application uses hundreds of concurrent AWS Lambda functions that connect to an Amazon RDS for MySQL Multi-AZ database. During traffic spikes the database runs out of connections, and during a recent failover the application experienced extended errors while connections were re-established. What should the solutions architect do to improve resilience?",
 options:[
  "Increase the max_connections parameter and the Lambda timeout.",
  "Replace Multi-AZ with a read replica in another AZ.",
  "Set Lambda reserved concurrency to 1.",
  "Place Amazon RDS Proxy between the Lambda functions and the database and connect through the proxy endpoint."],
 answer:[3],
 explain:"RDS Proxy poolt und teilt Datenbankverbindungen, schützt so vor Connection-Erschöpfung und verkürzt Failover-Zeiten, weil die Clients mit dem Proxy verbunden bleiben, während er zum neuen Primary umschaltet. Mehr max_connections verschiebt nur das Problem und kostet Speicher. Read Replicas bieten kein automatisches Failover. Reserved Concurrency 1 würde die Anwendung massiv drosseln."},

{id:"d2-006", domain:2, topic:"Auto Scaling + ELB", multi:false,
 q:"A web application runs on EC2 instances in an Auto Scaling group behind an Application Load Balancer. Occasionally the application process hangs and returns HTTP 500 errors, but the instance keeps passing EC2 status checks, so the Auto Scaling group does not replace it. How can the solutions architect ensure that such instances are replaced automatically?",
 options:[
  "Enable detailed CloudWatch monitoring on the instances.",
  "Configure the Auto Scaling group to use Elastic Load Balancing health checks in addition to EC2 status checks.",
  "Increase the health check grace period of the Auto Scaling group.",
  "Attach a second target group to the Auto Scaling group."],
 answer:[1],
 explain:"Standardmäßig nutzt eine ASG nur EC2-Status-Checks; aktiviert man ELB Health Checks, ersetzt die ASG auch Instances, die der Load Balancer als unhealthy meldet (z. B. wegen HTTP 500 auf dem Health-Check-Pfad). Detailed Monitoring liefert nur feinere Metriken. Eine längere Grace Period verzögert den Austausch eher. Ein zweiter Target Group ändert nichts am Health-Check-Typ der ASG."},

{id:"d2-007", domain:2, topic:"ALB", multi:false,
 q:"A company is splitting a monolith into microservices. Requests to /orders/* must go to the order service, /inventory/* to the inventory service, and all services run as separate target groups. The company wants a single entry point with HTTPS termination. Which load balancer should be used?",
 options:[
  "Network Load Balancer with TCP listeners on port 443",
  "Gateway Load Balancer",
  "Application Load Balancer with path-based routing rules",
  "Classic Load Balancer with sticky sessions"],
 answer:[2],
 explain:"Das ALB arbeitet auf Layer 7 und kann per Listener Rules nach Pfad, Host-Header, HTTP-Header oder Query-String auf verschiedene Target Groups routen sowie TLS terminieren. Ein NLB arbeitet auf Layer 4 und sieht keine URL-Pfade. Der GWLB ist für Netzwerk-Appliances. Der Classic Load Balancer ist veraltet und unterstützt kein Path-based Routing."},

{id:"d2-008", domain:2, topic:"NLB", multi:false,
 q:"A financial trading platform receives millions of requests per second over a custom TCP protocol and a UDP-based market data feed. Partner firewalls require that the platform be reachable via a fixed set of static IP addresses, one per Availability Zone. Which solution should the solutions architect use?",
 options:[
  "A Network Load Balancer with an Elastic IP address assigned in each Availability Zone",
  "An Application Load Balancer with fixed IP addresses",
  "Amazon CloudFront in front of an Application Load Balancer",
  "An Auto Scaling group with an Elastic IP address attached to each instance"],
 answer:[0],
 explain:"Das NLB unterstützt TCP, UDP und TLS, skaliert auf Millionen Requests pro Sekunde mit sehr niedriger Latenz und bietet pro AZ eine statische IP, die auch eine Elastic IP sein kann. Ein ALB unterstützt kein UDP und hat keine festen IPs (dafür bräuchte man Global Accelerator oder ein NLB davor). CloudFront ist für HTTP(S). EIPs pro Instance sind bei Scaling schwer zu verwalten und bieten kein Load Balancing."},

{id:"d2-009", domain:2, topic:"GWLB", multi:false,
 q:"A company must inspect all traffic entering and leaving its VPCs using a fleet of third-party next-generation firewall appliances from the AWS Marketplace. The appliance fleet must scale horizontally and be highly available, and traffic must be routed transparently to the appliances. Which solution should be used?",
 options:[
  "An Application Load Balancer in front of the firewall appliances",
  "A Gateway Load Balancer with the appliances as targets and Gateway Load Balancer endpoints in the route tables",
  "AWS WAF attached to every VPC",
  "Security groups configured to forward traffic to the appliances"],
 answer:[1],
 explain:"Der Gateway Load Balancer ist für virtuelle Netzwerk-Appliances gebaut: Er verteilt Traffic transparent (GENEVE, Port 6081) auf eine skalierbare Appliance-Flotte mit Health Checks, und GWLB-Endpoints dienen als Next Hop in Route Tables. Ein ALB terminiert HTTP-Verbindungen und ist nicht transparent. WAF wird nicht an VPCs angehängt. Security Groups können keinen Traffic weiterleiten."},

{id:"d2-010", domain:2, topic:"Route 53", multi:false,
 q:"A company runs its website on an ALB in eu-central-1. If the primary site becomes unavailable, users should automatically be sent to a static maintenance page hosted in an Amazon S3 bucket in another Region. Which Route 53 configuration achieves this?",
 options:[
  "Weighted routing with a weight of 100 for the ALB and 0 for the S3 website",
  "Latency-based routing between the ALB and the S3 website",
  "Failover routing with the ALB as the primary record (with health evaluation) and the S3 website as the secondary record",
  "Geolocation routing with a default record that points to the S3 website"],
 answer:[2],
 explain:"Failover Routing ist für Active-Passive gedacht: Solange der Primary laut Health Check (bzw. Evaluate Target Health beim Alias) gesund ist, wird er beantwortet, sonst der Secondary. Weighted Routing mit 0 ist kein gezieltes Failover-Konstrukt. Latency- und Geolocation-Routing würden Nutzer auch im Normalbetrieb auf die Wartungsseite schicken."},

{id:"d2-011", domain:2, topic:"Route 53", multi:false,
 q:"A SaaS company deploys identical application stacks in us-east-1, eu-west-1, and ap-southeast-1. It wants each user to be routed to the Region that provides the best network performance for that user, and unhealthy Regions should be skipped automatically. Which routing policy should be used?",
 options:[
  "Latency-based routing with health checks",
  "Geolocation routing",
  "Simple routing with multiple IP addresses",
  "Weighted routing with equal weights"],
 answer:[0],
 explain:"Latency-based Routing beantwortet DNS-Anfragen mit der Region, die die geringste gemessene Netzwerklatenz für den Nutzer hat; mit Health Checks werden ungesunde Regionen übersprungen. Geolocation richtet sich nach dem Standort des Nutzers, nicht nach Performance. Simple Routing unterstützt keine Health Checks. Gleiche Gewichte verteilen zufällig."},

{id:"d2-012", domain:2, topic:"Route 53", multi:false,
 q:"A development team wants to release a new version of its API gradually. Initially only 10% of DNS queries should resolve to the new environment, and the rest should resolve to the existing environment. The percentage will be increased over time. Which Route 53 routing policy should be used?",
 options:[
  "Failover routing",
  "Multivalue answer routing",
  "Geoproximity routing with a bias",
  "Weighted routing"],
 answer:[3],
 explain:"Weighted Routing verteilt Anfragen proportional zu den vergebenen Gewichten (z. B. 10/90) und eignet sich für Canary- oder Blue/Green-Umstellungen. Failover kennt nur Primary/Secondary. Multivalue gibt bis zu acht gesunde Einträge zufällig zurück, ohne Prozentsteuerung. Geoproximity verschiebt Traffic geografisch, nicht prozentual."},

{id:"d2-013", domain:2, topic:"Route 53", multi:false,
 q:"Due to licensing agreements, a streaming company must serve users in Germany from a content stack in eu-central-1 and users in France from a separate stack in eu-west-3, regardless of network latency. All other users should go to a default stack. Which routing policy meets this requirement?",
 options:[
  "Latency-based routing",
  "Geolocation routing with records for Germany and France plus a default record",
  "Weighted routing",
  "Multivalue answer routing"],
 answer:[1],
 explain:"Geolocation Routing entscheidet nach dem Standort des Nutzers (Kontinent, Land, US-Bundesstaat) und eignet sich für Lizenz- und Lokalisierungsanforderungen; ein Default-Record fängt alle übrigen Standorte ab. Latency Routing könnte einen deutschen Nutzer nach Paris schicken. Weighted und Multivalue berücksichtigen den Standort gar nicht."},

{id:"d2-014", domain:2, topic:"Route 53", multi:false,
 q:"A company runs a small fleet of web servers, each with its own public IP address, without a load balancer. It wants DNS to return several IP addresses per query and to stop returning the IP address of any server that fails a health check. Which Route 53 routing policy is the MOST suitable?",
 options:[
  "Simple routing with all IP addresses in one record",
  "Failover routing",
  "Multivalue answer routing with a health check for each record",
  "Latency-based routing"],
 answer:[2],
 explain:"Multivalue Answer Routing liefert bis zu acht gesunde Records pro Anfrage und entfernt ungesunde automatisch; es ist eine einfache Form der clientseitigen Lastverteilung, aber kein Ersatz für einen Load Balancer. Simple Routing mit mehreren Werten unterstützt keine Health Checks. Failover liefert nur einen Primary oder Secondary. Latency Routing passt nicht zu Servern in einer Region."},

{id:"d2-015", domain:2, topic:"SQS Decoupling", multi:true,
 q:"An online retailer's web tier sends orders synchronously to an order-processing tier on EC2. During flash sales, the processing tier is overwhelmed and orders are lost. The company wants to absorb spikes without losing orders and scale processing capacity with demand. Which TWO actions should the solutions architect take? (Choose TWO.)",
 options:[
  "Have the web tier send orders to an Amazon SQS queue that the processing tier polls.",
  "Increase the instance size of the processing tier to handle the peak load.",
  "Configure the processing tier's Auto Scaling group to scale on the SQS backlog per instance (derived from ApproximateNumberOfMessagesVisible).",
  "Use an Amazon SNS topic with HTTP subscriptions to the processing instances.",
  "Place the processing tier in a cluster placement group."],
 answer:[0,2],
 explain:"Eine SQS-Queue entkoppelt die Tiers und puffert Lastspitzen dauerhaft, sodass keine Bestellungen verloren gehen. Skaliert die ASG nach Backlog pro Instance, wächst die Verarbeitungskapazität mit der Queue-Länge. Größere Instances sind teuer und bleiben bei unerwarteten Spitzen begrenzt. SNS ist Push-basiert und puffert nicht wie eine Queue. Placement Groups beeinflussen nur die Netzwerk-Topologie."},

{id:"d2-016", domain:2, topic:"SQS FIFO", multi:false,
 q:"A banking application sends account transactions to a queue. Transactions for the same account must be processed strictly in the order they were sent, and a transaction must never be processed twice. Transactions for different accounts can be processed in parallel. Which solution meets these requirements?",
 options:[
  "An Amazon SQS standard queue with long polling",
  "An Amazon SNS standard topic with multiple SQS subscriptions",
  "An Amazon Kinesis Data Firehose delivery stream",
  "An Amazon SQS FIFO queue with the account ID as the message group ID and deduplication enabled"],
 answer:[3],
 explain:"FIFO Queues garantieren die Reihenfolge innerhalb einer Message Group und Exactly-once Processing per Deduplication; mit der Account-ID als Message Group ID laufen verschiedene Accounts parallel. Standard Queues bieten nur Best-Effort-Ordering und At-least-once Delivery. Ein Standard-SNS-Topic garantiert keine Reihenfolge. Firehose liefert Daten an Ziele wie S3, ist aber keine Verarbeitungsqueue."},

{id:"d2-017", domain:2, topic:"SNS Fan-out", multi:false,
 q:"When a customer places an order, three independent systems (billing, shipping, and analytics) must each receive a copy of the order event and process it at their own pace. If one system is down for an hour, it must not lose any events. Which architecture should the solutions architect recommend?",
 options:[
  "Publish the event to an Amazon SNS topic that has three Amazon SQS queues subscribed, one per system.",
  "Send the event to a single SQS queue that all three systems poll.",
  "Have the order service call each system's API directly and retry on failure.",
  "Write the event to an Amazon S3 bucket and have each system list the bucket every minute."],
 answer:[0],
 explain:"Das SNS-zu-SQS-Fan-out stellt jede Nachricht in jede abonnierte Queue zu; jede Queue puffert für ihren Konsumenten (Standard-Retention 4 Tage, bis 14 Tage), sodass ein ausgefallenes System nichts verliert. Bei einer einzigen Queue erhält nur ein Konsument die Nachricht. Direkte API-Aufrufe koppeln die Systeme eng. S3-Polling ist ineffizient und fehleranfällig."},

{id:"d2-018", domain:2, topic:"EventBridge", multi:false,
 q:"A company uses a third-party SaaS help-desk application that integrates natively with AWS. The company wants to route specific ticket events (for example, only priority 'high' tickets) to an AWS Lambda function and all billing-related events to an AWS Step Functions workflow, with minimal custom code. Which service should be used?",
 options:[
  "Amazon SQS with message filtering in the consumers",
  "Amazon EventBridge with a partner event source and rules with event patterns for each target",
  "Amazon Kinesis Data Streams with multiple consumers",
  "Amazon MQ with topic-based routing"],
 answer:[1],
 explain:"EventBridge bietet Partner Event Sources für SaaS-Anbieter und Rules mit inhaltsbasierten Event Patterns, die Events gezielt an Ziele wie Lambda oder Step Functions weiterleiten. SQS würde Filterlogik im Konsumenten erfordern. Kinesis ist für Streaming mit hohem Durchsatz und hat keine native SaaS-Integration oder Content-Routing. Amazon MQ ist für Migrationen bestehender Broker-Protokolle (AMQP, MQTT)."},

{id:"d2-019", domain:2, topic:"SQS DLQ", multi:false,
 q:"A worker fleet processes messages from an Amazon SQS standard queue. A small number of malformed messages repeatedly cause the workers to fail, and these messages keep returning to the queue, consuming resources indefinitely. What should the solutions architect do?",
 options:[
  "Decrease the message retention period to 1 minute.",
  "Switch to an SQS FIFO queue.",
  "Configure a dead-letter queue with a redrive policy and an appropriate maxReceiveCount.",
  "Enable long polling with a 20-second wait time."],
 answer:[2],
 explain:"Mit einer Dead-Letter Queue und maxReceiveCount werden Nachrichten nach zu vielen fehlgeschlagenen Empfängen automatisch aussortiert und können später analysiert und per Redrive zurückgeführt werden. Eine sehr kurze Retention würde auch gültige Nachrichten löschen. FIFO löst das Poison-Message-Problem nicht (blockiert sogar die Message Group). Long Polling reduziert nur leere Empfänge."},

{id:"d2-020", domain:2, topic:"SQS Visibility Timeout", multi:false,
 q:"An application processes video transcoding jobs from an Amazon SQS queue. Each job takes about 4 minutes. The queue uses the default visibility timeout. The team notices that many jobs are processed two or three times by different workers. What is the MOST likely cause and fix?",
 options:[
  "The queue's retention period is too short; increase it to 14 days.",
  "Long polling is disabled; enable it on the queue.",
  "The workers use too small an instance type; increase the instance size.",
  "The visibility timeout (30 seconds) is shorter than the processing time; increase it above the job duration or extend it with ChangeMessageVisibility."],
 answer:[3],
 explain:"Der Default Visibility Timeout beträgt 30 Sekunden; dauert die Verarbeitung länger, wird die Nachricht wieder sichtbar und ein anderer Worker holt sie erneut ab. Lösung: Timeout über die Verarbeitungsdauer setzen oder per ChangeMessageVisibility verlängern. Retention und Long Polling haben keinen Einfluss auf Mehrfachverarbeitung. Größere Instances verkürzen die Zeit vielleicht, lösen das Grundproblem aber nicht zuverlässig."},

{id:"d2-021", domain:2, topic:"Step Functions", multi:false,
 q:"An insurance claims process consists of several steps: validate the claim with a Lambda function, run a fraud check, wait for a human adjuster to approve claims over $10,000 (which can take several days), and then issue the payment. Each step needs retries with exponential backoff. Which service is MOST suitable to orchestrate this workflow?",
 options:[
  "AWS Step Functions Standard workflow using a task token callback for the human approval",
  "A single Lambda function that calls each step sequentially and sleeps while waiting for approval",
  "Amazon SQS queues chained between the steps",
  "AWS Step Functions Express workflow"],
 answer:[0],
 explain:"Step Functions Standard Workflows laufen bis zu einem Jahr, bieten deklarative Retry/Catch-Logik und unterstützen mit .waitForTaskToken das Warten auf externe Freigaben. Lambda ist auf 15 Minuten begrenzt und würde beim Warten Kosten verursachen. Verkettete Queues erfordern eigene Orchestrierungs- und Fehlerlogik. Express Workflows sind auf 5 Minuten begrenzt und für hochvolumige, kurze Abläufe gedacht."},

{id:"d2-022", domain:2, topic:"Lambda", multi:false,
 q:"Amazon S3 event notifications invoke a Lambda function asynchronously to process uploaded invoices. Occasionally the function fails because a downstream API is unavailable. After the built-in retries are exhausted, the events are lost. The company wants to capture failed events with details about the failure for later reprocessing. What should the solutions architect configure?",
 options:[
  "Increase the function's memory and timeout.",
  "Configure an on-failure destination for the function's asynchronous invocations that sends records to an Amazon SQS queue.",
  "Enable provisioned concurrency for the function.",
  "Enable S3 Versioning on the bucket."],
 answer:[1],
 explain:"Für asynchrone Aufrufe kann Lambda nach erschöpften Retries (Default 2) fehlgeschlagene Events an ein On-failure Destination (z. B. SQS, SNS, EventBridge, Lambda) senden, inklusive Kontext wie Fehlermeldung und Request-Payload; alternativ eine DLQ, die nur das Event enthält. Mehr Memory oder Timeout hilft nicht gegen einen ausgefallenen Downstream-Service. Provisioned Concurrency reduziert Cold Starts. Versioning bewahrt Objekte, nicht die fehlgeschlagenen Events."},

{id:"d2-023", domain:2, topic:"ECS Fargate", multi:false,
 q:"A company wants to run a containerized REST API without managing servers or cluster capacity. The API must remain available if an Availability Zone fails, and traffic must be distributed across healthy containers. Which solution meets these requirements with the LEAST operational overhead?",
 options:[
  "Run the containers with Docker on a single large EC2 instance with an Elastic IP address.",
  "Create an Amazon EKS cluster with self-managed EC2 worker nodes in one AZ.",
  "Deploy an Amazon ECS service on AWS Fargate with tasks spread across subnets in multiple AZs, registered with an Application Load Balancer target group.",
  "Package the containers as AMIs and launch them in an Auto Scaling group."],
 answer:[2],
 explain:"ECS auf Fargate eliminiert Server- und Kapazitätsverwaltung; der ECS-Service verteilt Tasks über die angegebenen Subnets mehrerer AZs, ersetzt fehlerhafte Tasks und registriert sie im ALB. Eine einzelne Instance ist ein Single Point of Failure. Self-managed Worker in einer AZ sind weder serverlos noch AZ-resilient. AMIs pro Container sind umständlich und kein Container-Orchestrierungsansatz."},

{id:"d2-024", domain:2, topic:"Disaster Recovery", multi:false,
 q:"A small accounting firm runs an internal document archive on AWS. Management accepts an RTO of 24 hours and an RPO of 12 hours for a Regional disaster and wants the LOWEST possible cost. Which DR strategy is MOST appropriate?",
 options:[
  "Multi-site active/active",
  "Warm standby",
  "Pilot light",
  "Backup and restore, with backups copied to another Region"],
 answer:[3],
 explain:"Backup and Restore ist die günstigste DR-Strategie und passt zu RTO/RPO im Stundenbereich: Daten werden regelmäßig gesichert und in eine zweite Region kopiert, die Infrastruktur wird erst im Ernstfall (idealerweise per IaC) aufgebaut. Pilot Light, Warm Standby und Multi-Site halten dauerhaft Ressourcen vor und sind teurer, als die Anforderungen rechtfertigen."},

{id:"d2-025", domain:2, topic:"Disaster Recovery", multi:false,
 q:"A company requires an RTO of a few hours and an RPO of minutes for its order system. In the DR Region, it wants only the core data layer to be running continuously, while application servers are not running until a disaster occurs. Which DR strategy does this describe?",
 options:[
  "Pilot light",
  "Backup and restore",
  "Warm standby",
  "Multi-site active/active"],
 answer:[0],
 explain:"Pilot Light hält nur die kritischen Kernkomponenten (meist die replizierte Datenbank) in der DR-Region aktiv; Applikationsserver werden erst im Ernstfall gestartet und skaliert. Backup and Restore hat keine laufende Replikation und daher ein schlechteres RPO. Warm Standby betreibt eine verkleinerte, aber voll funktionsfähige Umgebung. Multi-Site bedient produktiven Traffic in beiden Regionen."},

{id:"d2-026", domain:2, topic:"Disaster Recovery", multi:false,
 q:"An online bookstore requires that in a Regional disaster the application can serve production traffic within minutes. The company is willing to run a scaled-down but fully functional copy of the entire stack in a second Region at all times, which is scaled up during a failover. Which DR strategy is this?",
 options:[
  "Pilot light",
  "Warm standby",
  "Backup and restore",
  "Cold standby"],
 answer:[1],
 explain:"Warm Standby betreibt dauerhaft eine verkleinerte, aber vollständig lauffähige Kopie der Produktion, die sofort Requests verarbeiten kann und im Failover hochskaliert wird – RTO im Minutenbereich. Beim Pilot Light laufen Applikationsserver nicht und müssen erst gestartet werden. Backup and Restore baut alles neu auf. 'Cold Standby' ist kein AWS-DR-Muster aus dem Whitepaper und entspricht eher Backup and Restore."},

{id:"d2-027", domain:2, topic:"Disaster Recovery", multi:false,
 q:"A stock exchange's order-matching front end must achieve a near-zero RTO and an RPO as close to zero as possible for a Regional outage. Cost is a secondary concern. Which DR strategy should the solutions architect recommend?",
 options:[
  "Warm standby",
  "Pilot light",
  "Multi-site active/active across two Regions",
  "Backup and restore with AWS Backup cross-Region copies"],
 answer:[2],
 explain:"Multi-Site Active/Active betreibt volle Kapazität in mehreren Regionen, die gleichzeitig produktiven Traffic bedienen (z. B. per Route 53 und Global Tables/Aurora Global) – das niedrigste RTO/RPO, aber die höchsten Kosten. Warm Standby und Pilot Light benötigen noch Skalierung bzw. Start von Komponenten. Backup and Restore hat RTO/RPO im Stundenbereich."},

{id:"d2-028", domain:2, topic:"AWS Backup", multi:false,
 q:"A company has 30 AWS accounts with Amazon EC2, Amazon EBS, Amazon RDS, Amazon EFS, and Amazon DynamoDB resources. Auditors require centrally managed, policy-based backups with daily schedules, 35-day retention, and copies in a second Region, applied consistently across all accounts. Which solution requires the LEAST operational overhead?",
 options:[
  "Write Lambda functions in each account that call the native snapshot APIs of each service on a schedule.",
  "Use Amazon Data Lifecycle Manager policies in each account.",
  "Enable automated backups for each RDS instance and EBS snapshots by tag in each account.",
  "Use AWS Backup with backup policies in AWS Organizations that define backup plans with cross-Region copy rules, and assign resources by tags."],
 answer:[3],
 explain:"AWS Backup verwaltet Backups für viele Services zentral; über Backup Policies in AWS Organizations werden Backup Plans inklusive Retention und Cross-Region-Copy einheitlich in alle Accounts ausgerollt. Eigene Lambda-Skripte sind wartungsintensiv. Data Lifecycle Manager deckt nur EBS-Snapshots und AMIs ab. Service-native Einstellungen pro Account sind nicht zentral und nicht einheitlich auditierbar."},

{id:"d2-029", domain:2, topic:"AWS Backup", multi:false,
 q:"After a ransomware incident at a competitor, a company wants to ensure that its backups in AWS Backup cannot be deleted or have their retention shortened by anyone, including administrators with full privileges in the account, for the defined retention period. What should the solutions architect configure?",
 options:[
  "AWS Backup Vault Lock in compliance mode on the backup vault",
  "An IAM policy that denies backup:DeleteRecoveryPoint for all users",
  "S3 Versioning on the backup vault",
  "Encrypt the backup vault with a customer managed KMS key"],
 answer:[0],
 explain:"Vault Lock im Compliance Mode macht Recovery Points nach Ablauf der Grace Time unveränderlich (WORM): Niemand, auch nicht Root oder AWS, kann sie vor Ablauf der Retention löschen oder die Lock-Konfiguration ändern. Eine IAM-Deny-Policy kann ein Admin wieder entfernen. Backup Vaults sind keine S3-Buckets im Kundenkonto, Versioning ist dort nicht konfigurierbar. Verschlüsselung schützt vor Lesen, nicht vor Löschen."},

{id:"d2-030", domain:2, topic:"S3 Replication", multi:false,
 q:"A company enabled S3 Cross-Region Replication (CRR) from a bucket in eu-central-1 to a bucket in eu-north-1 for disaster recovery. New objects replicate correctly, but the 50 million objects that existed before the rule was created were not replicated. What is the MOST efficient way to replicate the existing objects?",
 options:[
  "Delete and re-upload all existing objects.",
  "Use S3 Batch Replication to replicate the existing objects.",
  "Enable S3 Transfer Acceleration on the source bucket.",
  "Change the replication rule's storage class to S3 Standard-IA."],
 answer:[1],
 explain:"Replication-Regeln gelten nur für Objekte, die nach Aktivierung hochgeladen werden; für bestehende Objekte (oder zuvor fehlgeschlagene Replikationen) ist S3 Batch Replication vorgesehen. Neu-Upload von 50 Millionen Objekten ist teuer und langsam. Transfer Acceleration beschleunigt Client-Uploads, nicht die Replikation. Die Ziel-Storage-Class beeinflusst nicht, welche Objekte repliziert werden."},

{id:"d2-031", domain:2, topic:"S3 Replication", multi:false,
 q:"A regulated company must prove that objects written to its primary S3 bucket are copied to a bucket in another Region within a predictable time, backed by an SLA, and must be alerted when replication falls behind. Which feature should the solutions architect enable?",
 options:[
  "S3 Same-Region Replication",
  "S3 Intelligent-Tiering",
  "S3 Cross-Region Replication with S3 Replication Time Control (S3 RTC) and replication metrics",
  "S3 Object Lock in governance mode"],
 answer:[2],
 explain:"S3 RTC repliziert 99,99 % der Objekte innerhalb von 15 Minuten mit SLA und liefert Replication Metrics sowie Event Notifications bei Verzögerung. Same-Region Replication erfüllt nicht die Anforderung einer anderen Region. Intelligent-Tiering optimiert Kosten. Object Lock schützt vor Löschung, repliziert aber nichts."},

{id:"d2-032", domain:2, topic:"Elastic Disaster Recovery", multi:false,
 q:"A manufacturing company runs 120 physical and VMware servers in its on-premises data center. It wants to use AWS as its DR site with continuous block-level replication, an RPO of seconds, and an RTO of minutes, while paying only for minimal staging resources until a failover is needed. Which service should the solutions architect recommend?",
 options:[
  "AWS Backup with on-premises backup gateways",
  "AWS DataSync scheduled tasks",
  "AWS Storage Gateway Volume Gateway in cached mode",
  "AWS Elastic Disaster Recovery (AWS DRS)"],
 answer:[3],
 explain:"AWS DRS repliziert Server kontinuierlich auf Blockebene in einen kostengünstigen Staging-Bereich und startet im Ernstfall vollständige Recovery-Instances – RPO in Sekunden, RTO in Minuten, für physische, virtuelle und Cloud-Server. AWS Backup und DataSync arbeiten zeitplanbasiert und erreichen kein Sekunden-RPO. Volume Gateway bietet Speicher mit Snapshots, aber keine orchestrierte Server-Wiederherstellung."},

{id:"d2-033", domain:2, topic:"EFS", multi:false,
 q:"A content management system runs on EC2 instances in an Auto Scaling group across three Availability Zones. All instances must read and write the same set of uploaded files, and the file storage must remain available if an AZ fails. Which storage solution should be used?",
 options:[
  "Amazon EFS with a Regional (Standard) file system and mount targets in each AZ",
  "An Amazon EBS volume with Multi-Attach enabled shared by all instances",
  "Instance store volumes synchronized with rsync",
  "An Amazon EFS One Zone file system"],
 answer:[0],
 explain:"EFS Regional speichert Daten redundant über mehrere AZs und kann gleichzeitig von vielen Instances über Mount Targets in jeder AZ per NFS genutzt werden. EBS Multi-Attach funktioniert nur für io1/io2 in einer AZ und erfordert ein clusterfähiges Dateisystem. Instance Store ist flüchtig. EFS One Zone ist günstiger, überlebt aber keinen AZ-Ausfall."},

{id:"d2-034", domain:2, topic:"EBS Snapshots", multi:false,
 q:"A company wants to automate the creation, retention, and deletion of Amazon EBS snapshots and EBS-backed AMIs for EC2 instances tagged Backup=Daily, keeping 14 daily snapshots and copying them to another Region. The team wants a native, no-code solution focused only on EBS. Which solution should be used?",
 options:[
  "A cron job on each instance that calls the AWS CLI to create snapshots",
  "Amazon Data Lifecycle Manager (DLM) policies targeting the Backup=Daily tag with a cross-Region copy rule",
  "An S3 Lifecycle policy on the bucket where snapshots are stored",
  "EBS Multi-Attach to a backup instance"],
 answer:[1],
 explain:"Data Lifecycle Manager automatisiert Erstellung, Aufbewahrung, Löschung und Cross-Region-Copy von EBS-Snapshots und AMIs auf Basis von Tags – ohne Code. Cron-Jobs pro Instance sind fehleranfällig und hängen an laufenden Instances. EBS-Snapshots liegen nicht in einem kundenseitig sichtbaren Bucket, S3-Lifecycle greift daher nicht. Multi-Attach ist keine Backup-Lösung."},

{id:"d2-035", domain:2, topic:"High Availability", multi:true,
 q:"A company runs a business-critical web application on a single EC2 instance with a MySQL database installed on the same instance. The company wants the application to tolerate the failure of an Availability Zone with minimal changes to the application code. Which TWO actions should the solutions architect take? (Choose TWO.)",
 options:[
  "Move the database to Amazon RDS for MySQL with a Multi-AZ deployment.",
  "Upgrade the EC2 instance to a larger instance type.",
  "Run the web tier in an Auto Scaling group across at least two Availability Zones behind an Application Load Balancer.",
  "Launch the instances in a cluster placement group.",
  "Create an RDS read replica in the same Availability Zone as the primary."],
 answer:[0,2],
 explain:"RDS Multi-AZ macht die Datenbank mit automatischem Failover AZ-resilient, und eine ASG über mehrere AZs hinter einem ALB eliminiert den Single Point of Failure im Web-Tier. Eine größere Instance bleibt ein Single Point of Failure. Eine Cluster Placement Group packt Instances in eine AZ und verringert die Ausfallsicherheit. Ein Read Replica in derselben AZ schützt nicht gegen AZ-Ausfälle."},

{id:"d2-036", domain:2, topic:"Route 53 Failover", multi:true,
 q:"A company has a primary web application in us-west-2 and a standby copy in us-east-1. It wants Route 53 to send users to us-east-1 automatically only when the us-west-2 application is unhealthy. Which TWO steps are required? (Choose TWO.)",
 options:[
  "Create a Route 53 health check (or enable Evaluate Target Health on an alias record) for the us-west-2 endpoint.",
  "Configure latency-based records for both Regions.",
  "Enable Multi-AZ on the Application Load Balancer.",
  "Create failover routing records: PRIMARY pointing to us-west-2 and SECONDARY pointing to us-east-1.",
  "Lower the TTL of the hosted zone's SOA record to 0."],
 answer:[0,3],
 explain:"Failover-Routing benötigt Primary- und Secondary-Records sowie eine Gesundheitsbewertung des Primary (Health Check oder Evaluate Target Health beim Alias); fällt der Primary durch, antwortet Route 53 mit dem Secondary. Latency Routing würde Nutzer auch im Normalbetrieb nach us-east-1 schicken. 'Multi-AZ' ist keine ALB-Einstellung (ALBs laufen bereits über mehrere AZs). Der SOA-TTL steuert nicht das Failover."},

{id:"d2-037", domain:2, topic:"Disaster Recovery", multi:true,
 q:"A company runs a web application on EC2 instances with an Amazon RDS for PostgreSQL database in eu-west-1. It wants to implement a pilot light DR strategy in eu-central-1 with an RPO of a few minutes, keeping costs low. Which TWO actions should be part of the solution? (Choose TWO.)",
 options:[
  "Run a full-size Auto Scaling group in eu-central-1 that serves 50% of production traffic.",
  "Create a cross-Region read replica of the RDS database in eu-central-1 that can be promoted during a disaster.",
  "Copy the application AMIs to eu-central-1 and keep launch templates and infrastructure as code ready to start the application tier on demand.",
  "Take weekly RDS snapshots and copy them to eu-central-1.",
  "Enable Multi-AZ for the RDS database in eu-west-1 only."],
 answer:[1,2],
 explain:"Beim Pilot Light läuft in der DR-Region nur der Daten-Kern: Ein Cross-Region Read Replica liefert ein RPO im Minutenbereich (asynchron) und kann promotet werden. AMIs, Launch Templates und IaC erlauben den schnellen Start des App-Tiers erst im Ernstfall. Eine aktive Vollkapazität mit Produktiv-Traffic wäre Multi-Site. Wöchentliche Snapshots verfehlen das RPO deutlich. Multi-AZ schützt nicht gegen Regionsausfälle."},

{id:"d2-038", domain:2, topic:"SQS", multi:true,
 q:"Workers on EC2 consume messages from an Amazon SQS standard queue. Processing a message takes up to 3 minutes. The team observes two problems: some messages are processed multiple times, and a few corrupt messages are retried endlessly. Which TWO changes should the solutions architect make? (Choose TWO.)",
 options:[
  "Set the queue's visibility timeout to a value longer than the maximum processing time.",
  "Reduce the message retention period to 5 minutes.",
  "Disable long polling on the queue.",
  "Configure a dead-letter queue with a redrive policy and a maxReceiveCount of, for example, 5.",
  "Increase the delivery delay of the queue to 15 minutes."],
 answer:[0,3],
 explain:"Ein Visibility Timeout über der maximalen Verarbeitungsdauer verhindert, dass Nachrichten während der Verarbeitung wieder sichtbar werden. Eine DLQ mit maxReceiveCount fängt Poison Messages nach wenigen Versuchen ab. Hinweis: Standard Queues sind at-least-once, Konsumenten sollten daher trotzdem idempotent sein. Kurze Retention löscht auch gültige Nachrichten, das Abschalten von Long Polling erhöht nur Kosten, und ein Delivery Delay verzögert lediglich die erste Zustellung."},

{id:"d2-039", domain:2, topic:"DynamoDB", multi:true,
 q:"A company's order history is stored in an Amazon DynamoDB table in eu-west-1. The company wants to (1) recover from accidental writes or deletes made by a faulty deployment to any second in the last 35 days, and (2) keep the application available if eu-west-1 fails. Which TWO features should be enabled? (Choose TWO.)",
 options:[
  "DynamoDB Accelerator (DAX)",
  "Point-in-time recovery (PITR)",
  "A local secondary index",
  "DynamoDB global tables with a replica in another Region",
  "On-demand capacity mode"],
 answer:[1,3],
 explain:"PITR erlaubt die Wiederherstellung einer Tabelle auf jede Sekunde innerhalb der Recovery-Periode (bis zu 35 Tage) und schützt so vor fehlerhaften Writes. Global Tables halten eine aktive Replica in einer anderen Region für Regionsausfälle; Achtung, sie replizieren fehlerhafte Writes ebenfalls, daher braucht man beides. DAX ist ein Cache, ein LSI ein alternativer Sortierschlüssel, und On-Demand betrifft nur die Kapazitätsabrechnung."},

{id:"d2-040", domain:2, topic:"CloudFront Origin Failover", multi:false,
 q:"A media company serves static images through Amazon CloudFront from an S3 bucket in us-east-1. The bucket is replicated to a second bucket in us-west-2. The company wants CloudFront to automatically fetch objects from the second bucket when the primary origin returns 5xx errors or times out. What should the solutions architect configure?",
 options:[
  "Two separate CloudFront distributions with Route 53 weighted routing between them",
  "An S3 Multi-Region Access Point as the only origin with no further configuration",
  "Lambda@Edge on viewer request to rewrite every request to the us-west-2 bucket",
  "A CloudFront origin group with the us-east-1 bucket as the primary origin, the us-west-2 bucket as the secondary origin, and failover criteria for 5xx status codes"],
 answer:[3],
 explain:"Eine Origin Group mit Primary- und Secondary-Origin lässt CloudFront bei definierten Statuscodes (z. B. 500, 502, 503, 504) oder Verbindungsfehlern automatisch auf den Secondary umschalten – für GET-, HEAD- und OPTIONS-Requests. Zwei Distributionen mit Weighted Routing verteilen Traffic statt gezieltem Failover. Ein Multi-Region Access Point ohne Failover-Konfiguration erfüllt die Anforderung nicht direkt. Lambda@Edge, das immer umschreibt, nutzt den Primary nie."}

]);
