import { userService } from "../services/UserService";
import type { User } from "../interfaces/User";
import { useEffectOnce } from "react-use";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { clsx } from "clsx/lite";

const inputClasses = `
  border-2 border-primary-200 rounded-lg p-1
`;

export function DashboardPage() {
  const [insertUserModalOpen, setInsertUserModalOpen] =
    useState<boolean>(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState<User | null>(null);
  const insertUsernameRef = useRef<HTMLInputElement>(null);
  const insertPasswordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffectOnce(() => {
    refreshUsers();
  });

  useEffect(() => {
    const usernameInput = usernameRef.current;
    const passwordInput = passwordRef.current;

    if (!usernameInput || !passwordInput || !editUserModalOpen) {
      return;
    }

    usernameInput.value = editUserModalOpen.username;
    passwordInput.value = editUserModalOpen.password!;
  }, [editUserModalOpen]);

  const refreshUsers = async () => {
    const refreshedUsers = await userService.getAll();

    setUsers(refreshedUsers);
  };

  const handleClickInsertModal = async () => {
    setInsertUserModalOpen(true);

    const usernameInput = insertUsernameRef.current;
    const passwordInput = insertPasswordRef.current;

    if (!usernameInput || !passwordInput) {
      return;
    }

    usernameInput.value = "";
    passwordInput.value = "";
  };

  const handleClickSubmitInsertModal = async () => {
    const usernameInput = insertUsernameRef.current;
    const passwordInput = insertPasswordRef.current;

    if (!usernameInput || !passwordInput || !insertUserModalOpen) {
      return;
    }

    await userService.insert({
      role: "common",
      username: usernameInput.value,
      password: passwordInput.value,
    });

    usernameInput.value = "";
    passwordInput.value = "";

    setInsertUserModalOpen(false);
    await refreshUsers();
  };

  const handleClickEditUser = async (user: User) => {
    setEditUserModalOpen(user);
  };

  const handleClickSubmitEditModal = async () => {
    const usernameInput = usernameRef.current;
    const passwordInput = passwordRef.current;

    if (!usernameInput || !passwordInput || !editUserModalOpen) {
      return;
    }

    await userService.update(editUserModalOpen.id!, {
      role: "common",
      username: usernameInput.value,
      password: passwordInput.value,
    });

    usernameInput.value = "";
    passwordInput.value = "";

    setEditUserModalOpen(null);
    await refreshUsers();
  };

  const deleteUser = async (id: number) => {
    await userService.delete(id);
    await refreshUsers();
  };

  return (
    <main>
      <div className="bg-primary-200 flex gap-2 p-2">
        <Link
          className="border-2 border-primary-700 rounded-lg p-1"
          to={"/login"}
        >
          Log In
        </Link>
        <button
          className={clsx("rounded-lg p-1 bg-primary-500")}
          onClick={handleClickInsertModal}
        >
          Insert
        </button>
      </div>
      <div className={clsx("flex flex-col gap-2 p-2")}>
        {users.map((user) => (
          <div
            key={user.id}
            className={clsx(
              "bg-primary-300 rounded-lg flex flex-col gap-2 p-2"
            )}
          >
            <p>ID: {user.id}</p>
            <p>Role: {user.role}</p>
            <p>Username: {user.username}</p>
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
          </div>
        ))}
      </div>
      {insertUserModalOpen && (
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
              onClick={() => setInsertUserModalOpen(false)}
            >
              Close
            </button>
            <label className="flex flex-col">
              <span>Username</span>
              <input
                className={inputClasses}
                aria-autocomplete="none"
                type="text"
                ref={insertUsernameRef}
              />
            </label>
            <label className="flex flex-col">
              <span>Password</span>
              <input
                className={inputClasses}
                aria-autocomplete="none"
                type="password"
                ref={insertPasswordRef}
              />
            </label>
            <button
              className="rounded-lg p-1 bg-primary-500"
              onClick={() => handleClickSubmitInsertModal()}
            >
              Insert user
            </button>
          </div>
        </div>
      )}
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
              <span>Username</span>
              <input
                className={inputClasses}
                autoComplete="off"
                type="text"
                ref={usernameRef}
              />
            </label>
            <label className="flex flex-col">
              <span>Password</span>
              <input
                className={inputClasses}
                autoComplete="off"
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
