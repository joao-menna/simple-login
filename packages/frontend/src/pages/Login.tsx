import { userService } from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import DOMPurify from "dompurify";

const inputClasses = `
  border-2 border-primary-200 rounded-lg p-1
`;

export function LoginPage() {
  const [error, setError] = useState<string | undefined>();
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const emailInput = emailRef.current;
    const passwordInput = passwordRef.current;

    if (!emailInput || !passwordInput) {
      return;
    }

    const email = DOMPurify.sanitize(emailInput.value);
    const password = passwordInput.value;

    if (!email || !password) {
      return;
    }

    try {
      await userService.login("", email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="fixed inset-0 size-full flex items-center justify-center">
      <div className="flex flex-col gap-2 items-center">
        {!!error && <p>{error}</p>}
        <label className="flex flex-col">
          <span>E-mail</span>
          <input className={inputClasses} type="email" ref={emailRef} />
        </label>
        <label className="flex flex-col">
          <span>Password</span>
          <input className={inputClasses} type="password" ref={passwordRef} />
        </label>
        <button
          className="rounded-lg p-1 bg-primary-500"
          onClick={handleSubmit}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
