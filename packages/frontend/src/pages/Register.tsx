import { userService } from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const inputClasses = `
  border-2 border-primary-200 rounded-lg p-1
`;

export function RegisterPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const emailInput = emailRef.current;
    const usernameInput = usernameRef.current;
    const passwordInput = passwordRef.current;

    if (!emailInput || !usernameInput || !passwordInput) {
      return;
    }

    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!email || !username || !password) {
      return;
    }

    await userService.register("", {
      email,
      username,
      password,
    });

    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 size-full flex items-center justify-center">
      <div className="flex flex-col gap-2 items-center">
        <label className="flex flex-col">
          <span>E-mail</span>
          <input className={inputClasses} type="email" ref={emailRef} />
        </label>
        <label className="flex flex-col">
          <span>Username</span>
          <input className={inputClasses} type="text" ref={usernameRef} />
        </label>
        <label className="flex flex-col">
          <span>Password</span>
          <input className={inputClasses} type="password" ref={passwordRef} />
        </label>
        <button
          className="rounded-lg p-1 bg-primary-500"
          onClick={handleSubmit}
        >
          Register
        </button>
      </div>
    </div>
  );
}
