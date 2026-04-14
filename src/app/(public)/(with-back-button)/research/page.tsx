import type { Metadata } from "next";
import "./research.css";

export const metadata: Metadata = {
  title: "Engineering Research — Review Destination",
  description:
    "Technical challenges, solutions, and outcomes encountered while building Review Destination.",
};

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-[#F3F4F4]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#853853] to-[#612D53] text-white px-6 lg:px-20 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto flex flex-col gap-6 items-center text-center">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-semibold tracking-wide">
            <span className="material-symbols-outlined text-base">science</span>
            Engineering Research
          </span>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Technical Challenges &amp;&nbsp;Solutions
          </h1>
          <p className="text-lg lg:text-xl text-white/80 max-w-2xl">
            A documented reference of real engineering problems encountered
            during the development of Review Destination — with diagrams,
            analysis and outcomes.
          </p>
        </div>
      </section>

      {/* ── Table of Contents ── */}
      <nav className="max-w-5xl mx-auto px-6 lg:px-0 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-sm font-bold text-[#853853] uppercase tracking-widest shrink-0">
            Challenges
          </span>
          <div className="h-px sm:h-8 sm:w-px bg-[#853853]/15" />
          <ol className="flex flex-wrap gap-3 text-sm font-medium text-[#2C2C2C]">
            <li>
              <a
                href="#challenge-1"
                className="hover:text-[#853853] transition-colors"
              >
                1. MongoDB Transaction Integrity
              </a>
            </li>
            {/* Future challenges will be listed here */}
          </ol>
        </div>
      </nav>

      {/* ── Challenge 1 ── */}
      <article
        id="challenge-1"
        className="max-w-5xl mx-auto px-6 lg:px-0 py-16"
      >
        {/* Challenge Header */}
        <div className="flex items-center gap-4 mb-10">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#853853] text-white text-lg font-extrabold shadow-md">
            1
          </span>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#2C2C2C]">
              MongoDB Transaction Integrity
            </h2>
            <p className="text-sm text-[#2C2C2C]/60 mt-1">
              Database &middot; Concurrency &middot; Data Consistency
            </p>
          </div>
        </div>

        {/* ─── CHALLENGE ─── */}
        <section className="research-section mb-14">
          <div className="section-label">
            <span className="material-symbols-outlined text-base">
              report_problem
            </span>
            Challenge
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <p className="text-[#2C2C2C] leading-relaxed mb-6">
              Posting a comment on a review involves four database operations
              that must succeed or fail together. Initially, the implementation
              used plain sequential calls — no MongoDB session, no transaction,
              no atomicity:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-[#2C2C2C] mb-8">
              <li>Check if the parent comment exists (for replies)</li>
              <li>Check if the target review exists</li>
              <li>Insert the new comment document</li>
              <li>
                Update the parent comment&apos;s <code>replyCommentIds</code>{" "}
                array
              </li>
            </ol>

            <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
              Three problems with the original approach:
            </h3>

            {/* Problem cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="problem-card">
                <div className="problem-number">P1</div>
                <h4 className="font-bold text-[#2C2C2C] mb-2">No Atomicity</h4>
                <p className="text-sm text-[#2C2C2C]/70">
                  Each database call was a standalone auto-committed operation.
                  If <code>insertCommentData</code> succeeded but{" "}
                  <code>addReplyToComment</code> failed or the server crashed,
                  the comment existed but was never linked to its parent — a
                  permanent orphan.
                </p>
              </div>
              <div className="problem-card">
                <div className="problem-number">P2</div>
                <h4 className="font-bold text-[#2C2C2C] mb-2">
                  Race Conditions
                </h4>
                <p className="text-sm text-[#2C2C2C]/70">
                  Between the guard read (<code>checkIfCommentExists</code>) and
                  the write (<code>addReplyToComment</code>), another request
                  could delete the parent comment. The guard passed but the
                  write silently operated on stale data — a classic TOCTOU bug.
                </p>
              </div>
              <div className="problem-card">
                <div className="problem-number">P3</div>
                <h4 className="font-bold text-[#2C2C2C] mb-2">
                  No Rollback Path
                </h4>
                <p className="text-sm text-[#2C2C2C]/70">
                  Without a transaction, there was no mechanism to undo a
                  partially completed operation. The{" "}
                  <code>addReplyToComment</code> return value was never checked
                  — a <code>null</code> result (parent deleted) was silently
                  ignored.
                </p>
              </div>
            </div>

            {/* Before code — Action */}
            <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
              Before — Server Action
            </h3>
            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span className="code-block-tag code-block-tag-before">
                  Before
                </span>
                post-comment.ts
              </div>
              <pre
                className="code-block"
                dangerouslySetInnerHTML={{
                  __html: `<span class="tk-kw">async function</span> <span class="tk-fn">postComment</span>(
  commentData: <span class="tk-ty">Omit&lt;CommentData, <span class="tk-str">"_id"</span>&gt;</span>,
): <span class="tk-ty">Promise&lt;ApiResponse&gt;</span> {
  <span class="tk-cm">// Sequential reads — no transaction, no session</span>
  <span class="tk-kw">if</span> (commentData.parentCommentId !== <span class="tk-ct">null</span>) {
    <span class="tk-kw">const</span> exists = <span class="tk-kw">await</span> <span class="tk-fn">checkIfCommentExists</span>({
      commentId: commentData.parentCommentId,
    });
    <span class="tk-kw">if</span> (!exists)
      <span class="tk-kw">return</span> { type: <span class="tk-str">"error"</span>, message: <span class="tk-str">"Parent comment not found."</span> };
  }

  <span class="tk-kw">const</span> reviewExists = <span class="tk-kw">await</span> <span class="tk-fn">checkIfReviewExists</span>({
    reviewId: commentData.reviewId,
  });
  <span class="tk-kw">if</span> (!reviewExists)
    <span class="tk-kw">return</span> { type: <span class="tk-str">"error"</span>, message: <span class="tk-str">"Review not found."</span> };

  <span class="tk-cm">// Independent writes — each auto-commits on its own</span>
  <span class="tk-kw">const</span> commentId = <span class="tk-kw">await</span> <span class="tk-fn">insertCommentData</span>(commentData);

  <span class="tk-kw">if</span> (commentData.parentCommentId !== <span class="tk-ct">null</span>) {
    <span class="tk-kw">await</span> <span class="tk-fn">addReplyToComment</span>({
      parentCommentId: commentData.parentCommentId,
      replyCommentId: commentId,
    });
    <span class="tk-cm">// ⚠ return value never checked — null silently ignored</span>
  }

  <span class="tk-kw">return</span> { type: <span class="tk-str">"success"</span>, message: <span class="tk-str">"Comment posted."</span> };
}`,
                }}
              />
            </div>

            {/* Before code — Repository */}
            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span className="code-block-tag code-block-tag-before">
                  Before
                </span>
                repository/comment.ts
              </div>
              <pre
                className="code-block"
                dangerouslySetInnerHTML={{
                  __html: `<span class="tk-kw">export async function</span> <span class="tk-fn">insertCommentData</span>(
  commentData: <span class="tk-ty">Omit&lt;CommentData, <span class="tk-str">"_id"</span>&gt;</span>,
): <span class="tk-ty">Promise&lt;string&gt;</span> {
  <span class="tk-kw">const</span> collection = <span class="tk-kw">await</span> <span class="tk-fn">getCommentsCollection</span>();
  <span class="tk-cm">// No session — runs outside any transaction</span>
  <span class="tk-kw">await</span> collection.<span class="tk-fn">insertOne</span>(validatedDocument);
  <span class="tk-kw">return</span> id;
}

<span class="tk-kw">export async function</span> <span class="tk-fn">checkIfCommentExists</span>({
  commentId,
}: {
  commentId: <span class="tk-ty">string</span>;
}): <span class="tk-ty">Promise&lt;boolean&gt;</span> {
  <span class="tk-kw">const</span> collection = <span class="tk-kw">await</span> <span class="tk-fn">getCommentsCollection</span>();
  <span class="tk-cm">// No session — always reads latest committed data</span>
  <span class="tk-kw">const</span> doc = <span class="tk-kw">await</span> collection.<span class="tk-fn">findOne</span>(
    { _id: <span class="tk-kw">new</span> <span class="tk-ty">ObjectId</span>(commentId) },
    { projection: { _id: <span class="tk-ct">1</span> } },
  );
  <span class="tk-kw">return</span> doc !== <span class="tk-ct">null</span>;
}`,
                }}
              />
            </div>

            {/* Before diagram */}
            <h3 className="text-lg font-bold text-[#2C2C2C] mt-8 mb-4">
              Before — No Transaction Flow
            </h3>
            <div className="diagram-container">
              <div className="diagram-flow">
                <div className="diagram-node diagram-node-start">
                  postComment() — no session, no transaction
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-warning">
                  <div className="diagram-node-label">READ</div>
                  checkIfCommentExists()
                  <span className="diagram-badge-warning">
                    Independent read — auto-commits instantly
                  </span>
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-warning">
                  <div className="diagram-node-label">READ</div>
                  checkIfReviewExists()
                  <span className="diagram-badge-warning">
                    Independent read — no snapshot consistency
                  </span>
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-danger">
                  <div className="diagram-node-label">WRITE</div>
                  insertCommentData()
                  <span className="diagram-badge-danger">
                    Auto-committed — cannot be rolled back
                  </span>
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-danger">
                  <div className="diagram-node-label">WRITE</div>
                  addReplyToComment()
                  <span className="diagram-badge-danger">
                    Auto-committed — null return unchecked
                  </span>
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-danger">
                  Done
                  <span className="diagram-badge-danger">
                    No atomicity — each operation independent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SOLUTION ─── */}
        <section className="research-section mb-14">
          <div className="section-label section-label-success">
            <span className="material-symbols-outlined text-base">
              lightbulb
            </span>
            Solution
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <p className="text-[#2C2C2C] leading-relaxed mb-8">
              Introduced MongoDB multi-document transactions using{" "}
              <code>ClientSession</code> and <code>withTransaction</code>. Three
              changes were applied:
            </p>

            {/* Solution steps */}
            <div className="space-y-6 mb-10">
              <div className="solution-step">
                <div className="solution-step-number">1</div>
                <div>
                  <h4 className="font-bold text-[#2C2C2C] mb-1">
                    Wrap all operations in <code>withTransaction</code>
                  </h4>
                  <p className="text-sm text-[#2C2C2C]/70">
                    Start a <code>ClientSession</code>, call{" "}
                    <code>withTransaction</code>, and run all four operations
                    inside the callback. MongoDB takes a snapshot at T=0 and
                    stages writes until commit.
                  </p>
                </div>
              </div>

              <div className="solution-step">
                <div className="solution-step-number">2</div>
                <div>
                  <h4 className="font-bold text-[#2C2C2C] mb-1">
                    Thread <code>clientSession</code> through every repository
                    call
                  </h4>
                  <p className="text-sm text-[#2C2C2C]/70">
                    Each repository function now accepts an optional{" "}
                    <code>clientSession</code> parameter and forwards it to the
                    MongoDB driver via{" "}
                    <code>{"{ session: clientSession }"}</code>. This enrolls
                    each operation in the transaction.
                  </p>
                </div>
              </div>

              <div className="solution-step">
                <div className="solution-step-number">3</div>
                <div>
                  <h4 className="font-bold text-[#2C2C2C] mb-1">
                    Add null-check guard on write return values
                  </h4>
                  <p className="text-sm text-[#2C2C2C]/70">
                    The result of <code>addReplyToComment</code> is now checked
                    for <code>null</code>. If the parent was deleted between the
                    guard read and the write, an error is thrown — forcing a
                    full rollback.
                  </p>
                </div>
              </div>
            </div>

            {/* After code — Action */}
            <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
              After — Server Action
            </h3>
            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span className="code-block-tag code-block-tag-after">
                  After
                </span>
                post-comment.ts
              </div>
              <pre
                className="code-block"
                dangerouslySetInnerHTML={{
                  __html: `<span class="tk-kw">async function</span> <span class="tk-fn">postCommentTransaction</span>(
  commentData: <span class="tk-ty">Omit&lt;CommentData, <span class="tk-str">"_id"</span>&gt;</span>,
): <span class="tk-ty">Promise&lt;ApiResponse&gt;</span> {
  <span class="tk-kw">const</span> clientSession = (<span class="tk-kw">await</span> <span class="tk-fn">getClientPromise</span>()).<span class="tk-fn">startSession</span>();
  <span class="tk-kw">let</span> domainErrorMessage: <span class="tk-ty">string</span> | <span class="tk-ct">null</span> = <span class="tk-ct">null</span>;

  <span class="tk-kw">try</span> {
    <span class="tk-kw">await</span> clientSession.<span class="tk-fn">withTransaction</span>(<span class="tk-kw">async</span> () =&gt; {
      <span class="tk-kw">if</span> (commentData.parentCommentId !== <span class="tk-ct">null</span>) {
        <span class="tk-kw">const</span> exists = <span class="tk-kw">await</span> <span class="tk-fn">checkIfCommentExists</span>(
          { commentId: commentData.parentCommentId },
          clientSession, <span class="tk-cm">// ← session threaded</span>
        );
        <span class="tk-kw">if</span> (!exists) {
          domainErrorMessage = <span class="tk-str">"Parent comment not found."</span>;
          <span class="tk-kw">throw new</span> <span class="tk-ty">Error</span>(domainErrorMessage);
        }
      }

      <span class="tk-kw">const</span> reviewExists = <span class="tk-kw">await</span> <span class="tk-fn">checkIfReviewExists</span>(
        { reviewId: commentData.reviewId },
        clientSession, <span class="tk-cm">// ← session threaded</span>
      );
      <span class="tk-kw">if</span> (!reviewExists) {
        domainErrorMessage = <span class="tk-str">"Review not found."</span>;
        <span class="tk-kw">throw new</span> <span class="tk-ty">Error</span>(domainErrorMessage);
      }

      <span class="tk-kw">const</span> commentId = <span class="tk-kw">await</span> <span class="tk-fn">insertCommentData</span>(
        commentData,
        clientSession, <span class="tk-cm">// ← session threaded</span>
      );

      <span class="tk-kw">if</span> (commentData.parentCommentId !== <span class="tk-ct">null</span>) {
        <span class="tk-kw">const</span> result = <span class="tk-kw">await</span> <span class="tk-fn">addReplyToComment</span>(
          {
            parentCommentId: commentData.parentCommentId,
            replyCommentId: commentId,
          },
          clientSession, <span class="tk-cm">// ← session threaded</span>
        );
        <span class="tk-kw">if</span> (!result) { <span class="tk-cm">// ← null-check guard</span>
          domainErrorMessage = <span class="tk-str">"Failed to link reply."</span>;
          <span class="tk-kw">throw new</span> <span class="tk-ty">Error</span>(domainErrorMessage);
        }
      }
    });

    <span class="tk-kw">return</span> { type: <span class="tk-str">"success"</span>, message: <span class="tk-str">"Comment posted."</span> };
  } <span class="tk-kw">catch</span> (error) {
    <span class="tk-kw">return</span> {
      type: <span class="tk-str">"error"</span>,
      message: domainErrorMessage ?? <span class="tk-str">"An unexpected error occurred."</span>,
    };
  } <span class="tk-kw">finally</span> {
    <span class="tk-kw">await</span> clientSession.<span class="tk-fn">endSession</span>();
  }
}`,
                }}
              />
            </div>

            {/* After code — Repository */}
            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span className="code-block-tag code-block-tag-after">
                  After
                </span>
                repository/comment.ts
              </div>
              <pre
                className="code-block"
                dangerouslySetInnerHTML={{
                  __html: `<span class="tk-kw">export async function</span> <span class="tk-fn">insertCommentData</span>(
  commentData: <span class="tk-ty">Omit&lt;CommentData, <span class="tk-str">"_id"</span>&gt;</span>,
  clientSession?: <span class="tk-ty">ClientSession</span>, <span class="tk-cm">// ← new parameter</span>
): <span class="tk-ty">Promise&lt;string&gt;</span> {
  <span class="tk-kw">const</span> collection = <span class="tk-kw">await</span> <span class="tk-fn">getCommentsCollection</span>();
  <span class="tk-kw">await</span> collection.<span class="tk-fn">insertOne</span>(validatedDocument, {
    session: clientSession, <span class="tk-cm">// ← forwarded to driver</span>
  });
  <span class="tk-kw">return</span> id;
}

<span class="tk-kw">export async function</span> <span class="tk-fn">checkIfCommentExists</span>(
  { commentId }: { commentId: <span class="tk-ty">string</span> },
  clientSession?: <span class="tk-ty">ClientSession</span>, <span class="tk-cm">// ← new parameter</span>
): <span class="tk-ty">Promise&lt;boolean&gt;</span> {
  <span class="tk-kw">const</span> collection = <span class="tk-kw">await</span> <span class="tk-fn">getCommentsCollection</span>();
  <span class="tk-kw">const</span> doc = <span class="tk-kw">await</span> collection.<span class="tk-fn">findOne</span>(
    { _id: <span class="tk-kw">new</span> <span class="tk-ty">ObjectId</span>(commentId) },
    { projection: { _id: <span class="tk-ct">1</span> }, session: clientSession }, <span class="tk-cm">// ← forwarded</span>
  );
  <span class="tk-kw">return</span> doc !== <span class="tk-ct">null</span>;
}`,
                }}
              />
            </div>

            {/* After diagram */}
            <h3 className="text-lg font-bold text-[#2C2C2C] mt-8 mb-4">
              After — Correct Transaction Flow
            </h3>
            <div className="diagram-container diagram-container-success">
              <div className="diagram-flow">
                <div className="diagram-node diagram-node-start">
                  withTransaction() — snapshot taken at T=0
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-success">
                  <div className="diagram-node-label">READ</div>
                  checkIfCommentExists(…, clientSession)
                  <span className="diagram-badge-success">
                    Reads from snapshot @ T=0
                  </span>
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-success">
                  <div className="diagram-node-label">READ</div>
                  checkIfReviewExists(…, clientSession)
                  <span className="diagram-badge-success">
                    Reads from snapshot @ T=0
                  </span>
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-success">
                  <div className="diagram-node-label">WRITE</div>
                  insertCommentData(…, clientSession)
                  <span className="diagram-badge-success">
                    Staged in write buffer
                  </span>
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-success">
                  <div className="diagram-node-label">WRITE</div>
                  addReplyToComment(…, clientSession)
                  <span className="diagram-badge-success">
                    Staged + null-check guard
                  </span>
                </div>
                <div className="diagram-arrow">↓</div>

                <div className="diagram-node diagram-node-commit">
                  COMMIT — all operations atomic
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── KEY CONCEPTS ─── */}
        <section className="research-section mb-14">
          <div className="section-label section-label-info">
            <span className="material-symbols-outlined text-base">school</span>
            Key Concepts Learned
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Session behavior diagram */}
            <h3 className="text-lg font-bold text-[#2C2C2C] mb-6">
              How <code>clientSession</code> Behaves Differently for Reads vs
              Writes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="concept-card concept-card-read">
                <div className="concept-card-header">
                  <span className="material-symbols-outlined">visibility</span>
                  <h4 className="font-bold">Reads + Session</h4>
                </div>
                <p className="text-sm text-[#2C2C2C]/70 mb-3">
                  MongoDB returns data as it existed at the snapshot timestamp
                  (T=0). Concurrent writes by other clients are invisible.
                </p>
                <div className="concept-code">
                  findOne(filter, {"{"} session {"}"}) → snapshot @ T=0
                </div>
              </div>

              <div className="concept-card concept-card-write">
                <div className="concept-card-header">
                  <span className="material-symbols-outlined">edit</span>
                  <h4 className="font-bold">Writes + Session</h4>
                </div>
                <p className="text-sm text-[#2C2C2C]/70 mb-3">
                  MongoDB stages the write in a buffer tied to the session. It
                  is invisible to all other clients until commit.
                </p>
                <div className="concept-code">
                  insertOne(doc, {"{"} session {"}"}) → staged, not committed
                </div>
              </div>
            </div>

            {/* MVCC explanation */}
            <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
              Snapshot Isolation (MVCC)
            </h3>
            <p className="text-[#2C2C2C]/80 text-sm leading-relaxed mb-6">
              A snapshot is not a copy of data — it is a{" "}
              <strong>timestamp</strong>. MongoDB records &ldquo;this
              transaction sees the world as it was at time T=0&rdquo;. No data
              is duplicated. When a read operation runs inside the transaction,
              MongoDB uses that timestamp to decide which version of each
              document to return.
            </p>
            <div className="diagram-container diagram-container-neutral mb-10">
              <div className="snapshot-timeline">
                <div className="timeline-row">
                  <span className="timeline-label">T=-2</span>
                  <div className="timeline-bar timeline-bar-past">
                    {"{ replyCommentIds: [] }"}
                  </div>
                </div>
                <div className="timeline-row">
                  <span className="timeline-label">T=-1</span>
                  <div className="timeline-bar timeline-bar-past">
                    {"{ replyCommentIds: [A] }"}
                  </div>
                </div>
                <div className="timeline-row timeline-row-active">
                  <span className="timeline-label">T=0</span>
                  <div className="timeline-bar timeline-bar-active">
                    Snapshot taken here →{" "}
                    <strong>your transaction reads this version</strong>
                  </div>
                </div>
                <div className="timeline-row">
                  <span className="timeline-label">T=+1</span>
                  <div className="timeline-bar timeline-bar-future">
                    {"{ replyCommentIds: [A, B] }"} — invisible to your tx
                  </div>
                </div>
              </div>
            </div>

            {/* Concurrency scenarios */}
            <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
              Concurrent Deletion Scenarios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="scenario-card scenario-card-danger">
                <div className="scenario-header">
                  <span className="scenario-tag scenario-tag-danger">
                    Case 1
                  </span>
                  <h4 className="font-bold text-[#2C2C2C]">
                    Delete Without Transaction
                  </h4>
                </div>
                <div className="scenario-timeline">
                  <div className="scenario-step">
                    T=0 → Guard read sees document ✓
                  </div>
                  <div className="scenario-step scenario-step-danger">
                    T=1 → External deleteOne() — no session, instant commit
                  </div>
                  <div className="scenario-step">
                    T=2 → findOneAndUpdate → returns null (silent)
                  </div>
                  <div className="scenario-step">T=3 → Tx commits ✓</div>
                </div>
                <div className="scenario-outcome scenario-outcome-danger">
                  <span className="material-symbols-outlined text-base">
                    error
                  </span>
                  <span>Orphaned reply — no conflict detected</span>
                </div>
              </div>

              <div className="scenario-card scenario-card-success">
                <div className="scenario-header">
                  <span className="scenario-tag scenario-tag-success">
                    Case 2
                  </span>
                  <h4 className="font-bold text-[#2C2C2C]">
                    Delete Inside Transaction
                  </h4>
                </div>
                <div className="scenario-timeline">
                  <div className="scenario-step">
                    T=0 → Guard read sees document ✓
                  </div>
                  <div className="scenario-step scenario-step-info">
                    T=1 → Tx B: deleteOne(…, session) — staged
                  </div>
                  <div className="scenario-step scenario-step-info">
                    T=2 → Tx B commits → delete visible
                  </div>
                  <div className="scenario-step scenario-step-success">
                    T=3 → Tx A write → WriteConflictError → auto-retry
                  </div>
                </div>
                <div className="scenario-outcome scenario-outcome-success">
                  <span className="material-symbols-outlined text-base">
                    check_circle
                  </span>
                  <span>Guard catches deletion on retry — clean error</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DESIGN DECISIONS ─── */}
        <section className="research-section mb-14">
          <div className="section-label section-label-neutral">
            <span className="material-symbols-outlined text-base">
              architecture
            </span>
            Design Decisions
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-bold text-[#2C2C2C] mb-6">
              Why Not Add <code>clientSession</code> to Every Repository Method?
            </h3>
            <p className="text-[#2C2C2C]/80 text-sm leading-relaxed mb-6">
              Adding an optional <code>clientSession</code> parameter to every
              repository function was considered and rejected. The core
              reasoning:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="decision-card">
                <div className="decision-icon decision-icon-no">
                  <span className="material-symbols-outlined">close</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#2C2C2C] text-sm mb-1">
                    &ldquo;use cache&rdquo; + session = incompatible
                  </h4>
                  <p className="text-xs text-[#2C2C2C]/60">
                    Cached functions may never reach the driver — the session
                    parameter becomes dead code that falsely implies transaction
                    participation.
                  </p>
                </div>
              </div>
              <div className="decision-card">
                <div className="decision-icon decision-icon-no">
                  <span className="material-symbols-outlined">close</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#2C2C2C] text-sm mb-1">
                    YAGNI — most methods are never transactional
                  </h4>
                  <p className="text-xs text-[#2C2C2C]/60">
                    Functions like <code>addLikeToComment</code> or{" "}
                    <code>removeLikeFromComment</code> have no transaction use
                    case. Adding a session invites the same bug of accepting but
                    not forwarding it.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-[#F3F4F4] rounded-xl">
              <h4 className="font-bold text-[#2C2C2C] text-sm mb-3">
                The Decision Rule
              </h4>
              <div className="decision-tree">
                <div className="tree-node">
                  <span className="tree-question">Is it a write?</span>
                  <div className="tree-branches">
                    <div className="tree-branch">
                      <span className="tree-label">Yes</span>
                      <span className="tree-answer">
                        No cache. Add <code>clientSession</code> only if called
                        inside <code>withTransaction</code>.
                      </span>
                    </div>
                    <div className="tree-branch">
                      <span className="tree-label">No (read)</span>
                      <span className="tree-question-sub">
                        Is it called inside withTransaction?
                      </span>
                      <div className="tree-sub-branches">
                        <div className="tree-branch">
                          <span className="tree-label">Yes</span>
                          <span className="tree-answer">
                            No cache. Add <code>clientSession</code>.
                          </span>
                        </div>
                        <div className="tree-branch">
                          <span className="tree-label">No</span>
                          <span className="tree-answer">
                            Add &ldquo;use cache&rdquo;. No{" "}
                            <code>clientSession</code>.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── OUTCOME ─── */}
        <section className="research-section">
          <div className="section-label section-label-outcome">
            <span className="material-symbols-outlined text-base">
              emoji_events
            </span>
            Outcome
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="outcome-stat">
                <div className="outcome-stat-value text-green-600">0 → 4</div>
                <div className="outcome-stat-label">
                  Operations enrolled in transaction
                </div>
              </div>
              <div className="outcome-stat">
                <div className="outcome-stat-value text-[#853853]">0</div>
                <div className="outcome-stat-label">
                  Possible orphaned documents
                </div>
              </div>
              <div className="outcome-stat">
                <div className="outcome-stat-value text-blue-600">4</div>
                <div className="outcome-stat-label">
                  Functions updated — no new abstractions
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="outcome-item">
                <span className="material-symbols-outlined text-green-600 text-xl">
                  check_circle
                </span>
                <p className="text-sm text-[#2C2C2C]">
                  <strong>All 4 operations</strong> now pass{" "}
                  <code>clientSession</code> to the MongoDB driver — reads use
                  the snapshot, writes are staged until commit.
                </p>
              </div>
              <div className="outcome-item">
                <span className="material-symbols-outlined text-green-600 text-xl">
                  check_circle
                </span>
                <p className="text-sm text-[#2C2C2C]">
                  <strong>Write-conflict detection</strong> works end-to-end —
                  concurrent transactional deletes trigger{" "}
                  <code>WriteConflictError</code> and automatic retry.
                </p>
              </div>
              <div className="outcome-item">
                <span className="material-symbols-outlined text-green-600 text-xl">
                  check_circle
                </span>
                <p className="text-sm text-[#2C2C2C]">
                  <strong>Null-check guard</strong> on{" "}
                  <code>addReplyToComment</code> catches the TOCTOU edge case
                  where a non-transactional delete removes the parent after the
                  guard read.
                </p>
              </div>
              <div className="outcome-item">
                <span className="material-symbols-outlined text-green-600 text-xl">
                  check_circle
                </span>
                <p className="text-sm text-[#2C2C2C]">
                  <strong>No over-engineering</strong> — session parameters were
                  only added to functions that participate in transactions, not
                  blanket-applied.
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
