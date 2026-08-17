export default function ForgotPasswordPage() {
  return (
    <main className="login-page">
      <div className="login-panel">
        <div className="login-heading">
          <span className="section-label">NORSE ONE</span>
          <h1>Reset access.</h1>
          <p>
            Enter your account email and the academy will provide the next
            secure recovery step.
          </p>
        </div>

        <form className="academy-form">
          <label>
            Account Email
            <input type="email" name="email" autoComplete="email" />
          </label>

          <button type="submit" className="button button-gold">
            Continue
          </button>
        </form>
      </div>

      <div className="login-art">
        <div className="login-art-circle">
          <span>N</span>
        </div>

        <h2>Norse One</h2>
        <p>Secure access to your Academy workspace.</p>
      </div>
    </main>
  );
}