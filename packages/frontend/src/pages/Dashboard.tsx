import { userService } from "../services/UserService";
import type { User } from "../interfaces/User";
import { useEffectOnce } from "react-use";
import { useRef, useState } from "react";
import { clsx } from "clsx/lite";
import { Link } from "react-router-dom";

const inputClasses = `
  border-2 border-primary-200 rounded-lg p-1
`;

export function DashboardPage() {
  const [editUserModalOpen, setEditUserModalOpen] = useState<number | null>(
    null
  );
  const [loggedUser, setLoggedUser] = useState<number | null>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffectOnce(() => {
    getIsUserLogged();
    refreshUsers();
  });

  const getIsUserLogged = async () => {
    try {
      const user = await userService.isLogged();
      setLoggedUser(user.id);
    } catch {
      setLoggedUser(null);
    }
  };

  const refreshUsers = async () => {
    const refreshedUsers = await userService.getAll();

    setUsers(refreshedUsers);
  };

  const handleClickEditUser = async (user: User) => {
    setEditUserModalOpen(user.id ?? null);

    const emailInput = emailRef.current;
    const usernameInput = usernameRef.current;
    const passwordInput = passwordRef.current;

    if (!emailInput || !usernameInput || !passwordInput) {
      return;
    }

    emailInput.value = user.email;
    usernameInput.value = user.username;
    passwordInput.value = "";
  };

  const handleClickSubmitEditModal = async () => {
    const emailInput = emailRef.current;
    const usernameInput = usernameRef.current;
    const passwordInput = passwordRef.current;

    if (!emailInput || !usernameInput || !passwordInput || !editUserModalOpen) {
      return;
    }

    await userService.update(editUserModalOpen, {
      email: emailInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
    });

    emailInput.value = "";
    usernameInput.value = "";

    setEditUserModalOpen(null);
    await refreshUsers();
  };

  const deleteUser = async (id: number) => {
    if (!loggedUser) {
      return;
    }

    await userService.delete(id);
    await refreshUsers();
  };

  const logOutUser = async () => {
    try {
      await userService.logOut();
      setLoggedUser(null);
    } catch {
      console.error("Could not log user out");
    }
  };

  return (
    <main>
      <div className="bg-primary-200 flex gap-2 p-2">
        <Link
          className="border-2 border-primary-700 rounded-lg p-1"
          to={"/register"}
        >
          Register
        </Link>
        {!loggedUser && (
          <Link
            className="border-2 border-primary-700 rounded-lg p-1"
            to={"/login"}
          >
            Log In
          </Link>
        )}
        {!!loggedUser && (
          <button
            className={clsx("rounded-lg p-1 bg-primary-500")}
            onClick={logOutUser}
          >
            Log Out
          </button>
        )}
      </div>
      <div className={clsx("flex flex-col gap-2 p-2")}>
        {users.map((user) => (
          <div
            className={clsx(
              "bg-primary-300 rounded-lg flex flex-col gap-2 p-2"
            )}
          >
            <p>ID: {user.id}</p>
            <p>E-mail: {user.email}</p>
            <p>Username: {user.username}</p>
            {!!loggedUser && loggedUser !== user.id && (
              <div className={clsx("flex gap-2")}>
                <button
                  className={clsx("w-full rounded-lg p-1 bg-primary-500")}
                  onClick={() => user.id && handleClickEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className={clsx("w-full rounded-lg p-1 bg-primary-500")}
                  onClick={() => user.id && deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!!editUserModalOpen && (
        <div
          className={clsx(
            "fixed inset-0 flex flex-col justify-center items-center",
            "bg-primary-50/50 gap-2"
          )}
        >
          <div
            className={clsx(
              "flex flex-col p-2 bg-primary-300 rounded-lg gap-2"
            )}
          >
            <button
              className="rounded-lg p-1 bg-primary-500"
              onClick={() => setEditUserModalOpen(null)}
            >
              Close
            </button>
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
              <input
                className={inputClasses}
                type="password"
                ref={passwordRef}
              />
            </label>
            <button
              className="rounded-lg p-1 bg-primary-500"
              onClick={() => handleClickSubmitEditModal()}
            >
              Update user
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
